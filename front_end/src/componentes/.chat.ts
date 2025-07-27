interface Message {
    id: number;
    username: string;
    text: string;
    timestamp: Date;
    isOwn: boolean;
    type: 'global' | 'dm' | 'system' | 'tournament' | 'game_invite';
    recipientId?: string;
    senderId?: string;
    metadata?: any;
}

interface User {
    id: string;
    username: string;
    status: 'online' | 'offline' | 'in_game';
    avatar?: string;
    stats?: {
        wins: number;
        losses: number;
        rank: number;
    };
}

interface GameInvite {
    id: string;
    fromUser: string;
    toUser: string;
    gameType: 'solo' | 'tournament';
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    timestamp: Date;
}

export class EnhancedChatSystem {
    private messages: Message[] = [];
    private dmMessages: Map<string, Message[]> = new Map();
    private users: Map<string, User> = new Map();
    private blockedUsers: Set<string> = new Set();
    private gameInvites: Map<string, GameInvite> = new Map();
    
    private currentUser: User;
    private currentTab: 'global' | 'dm' | 'tournament' = 'global';
    private currentDmRecipient: string | null = null;
    private isCollapsed: boolean = false;
    private isTyping: boolean = false;
    
    // DOM elements
    private messagesArea: HTMLElement | null;
    private messageInput: HTMLInputElement | null;
    private sendButton: HTMLElement | null;
    private toggleButton: HTMLElement | null;
    private chatContainer: HTMLElement | null;
    
    // Simulation intervals
    private simulationInterval: number | null = null;
    private tournamentInterval: number | null = null;

    constructor() {
        this.currentUser = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            username: "Player" + Math.floor(Math.random() * 1000),
            status: 'online',
            stats: {
                wins: Math.floor(Math.random() * 50),
                losses: Math.floor(Math.random() * 30),
                rank: Math.floor(Math.random() * 1000) + 1
            }
        };
        
        this.initializeDOM();
        this.initEventListeners();
        this.initializeUsers();
        this.simulateActivity();
        this.setupTournamentNotifications();
    }
    
    private initializeDOM(): void {
        this.messagesArea = document.getElementById('messagesArea');
        this.messageInput = document.getElementById('messageInput') as HTMLInputElement;
        this.sendButton = document.getElementById('sendButton');
        this.toggleButton = document.getElementById('toggleChat');
        this.chatContainer = document.getElementById('chatContainer');
    }
    
    private initEventListeners(): void {
        // Send message
        this.sendButton?.addEventListener('click', () => this.sendMessage());
        this.messageInput?.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Toggle chat
        this.toggleButton?.addEventListener('click', () => this.toggleChat());
        
        // Tab switching
        document.getElementById('globalTab')?.addEventListener('click', () => this.switchTab('global'));
        document.getElementById('dmTab')?.addEventListener('click', () => this.switchTab('dm'));
        document.getElementById('tournamentTab')?.addEventListener('click', () => this.switchTab('tournament'));
        
        // Settings and profile modals
        document.getElementById('chatSettings')?.addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings')?.addEventListener('click', () => this.closeSettings());
        document.getElementById('closeProfile')?.addEventListener('click', () => this.closeProfile());
        
        // Character count
        this.messageInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = `${target.value.length}/200`;
            }
        });
        
        // Typing state tracking
        this.messageInput?.addEventListener('focus', () => this.isTyping = true);
        this.messageInput?.addEventListener('blur', () => this.isTyping = false);
        
        // Cancel reply
        document.getElementById('cancelReply')?.addEventListener('click', () => this.cancelReply());
        
        // Modal click outside to close
        document.getElementById('settingsModal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeSettings();
        });
        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeProfile();
        });
    }
    
    private initializeUsers(): void {
        // Add some demo users
        const demoUsers = [
            { id: 'user_1', username: 'Alice', status: 'online', stats: { wins: 45, losses: 12, rank: 1 } },
            { id: 'user_2', username: 'Bob', status: 'in_game', stats: { wins: 38, losses: 15, rank: 2 } },
            { id: 'user_3', username: 'Charlie', status: 'online', stats: { wins: 32, losses: 18, rank: 3 } },
            { id: 'user_4', username: 'Dave', status: 'offline', stats: { wins: 28, losses: 22, rank: 4 } },
            { id: 'user_5', username: 'Eve', status: 'online', stats: { wins: 25, losses: 25, rank: 5 } }
        ];
        
        demoUsers.forEach(user => {
            this.users.set(user.id, user as User);
        });
        
        this.updateOnlineCount();
    }
    
    private switchTab(tab: 'global' | 'dm' | 'tournament'): void {
        // Update tab appearance
        document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`${tab}Tab`)?.classList.add('active');
        
        this.currentTab = tab;
        this.refreshMessages();
        
        // Update input placeholder
        if (this.messageInput) {
            switch (tab) {
                case 'global':
                    this.messageInput.placeholder = 'Type a message...';
                    break;
                case 'dm':
                    this.messageInput.placeholder = this.currentDmRecipient ? 
                        `Message ${this.getUserById(this.currentDmRecipient)?.username}...` : 
                        'Select a user to message...';
                    break;
                case 'tournament':
                    this.messageInput.placeholder = 'Tournament chat...';
                    break;
            }
        }
    }
    
    private sendMessage(): void {
        if (!this.messageInput || !this.messageInput.value.trim()) return;
        
        const text = this.messageInput.value.trim();
        const message: Message = {
            id: Date.now(),
            username: this.currentUser.username,
            text: text,
            timestamp: new Date(),
            isOwn: true,
            type: this.currentTab === 'global' ? 'global' : 
                  this.currentTab === 'dm' ? 'dm' : 'tournament',
            senderId: this.currentUser.id
        };
        
        if (this.currentTab === 'dm' && this.currentDmRecipient) {
            message.recipientId = this.currentDmRecipient;
            this.addDmMessage(this.currentDmRecipient, message);
        } else {
            this.addMessage(message);
        }
        
        this.messageInput.value = '';
        this.updateCharCount();
        
        // Check for commands
        this.processCommands(text);
    }
    
    private processCommands(text: string): void {
        if (text.startsWith('/invite ')) {
            const username = text.split(' ')[1];
            const user = Array.from(this.users.values()).find(u => u.username.toLowerCase() === username.toLowerCase());
            if (user) {
                this.sendGameInvite(user.id);
            } else {
                this.addSystemMessage(`User "${username}" not found.`);
            }
        } else if (text.startsWith('/block ')) {
            const username = text.split(' ')[1];
            const user = Array.from(this.users.values()).find(u => u.username.toLowerCase() === username.toLowerCase());
            if (user) {
                this.blockUser(user.id);
            } else {
                this.addSystemMessage(`User "${username}" not found.`);
            }
        } else if (text.startsWith('/unblock ')) {
            const username = text.split(' ')[1];
            const user = Array.from(this.users.values()).find(u => u.username.toLowerCase() === username.toLowerCase());
            if (user) {
                this.unblockUser(user.id);
            } else {
                this.addSystemMessage(`User "${username}" not found.`);
            }
        } else if (text === '/help') {
            this.showHelp();
        }
    }
    
    private sendGameInvite(userId: string): void {
        const invite: GameInvite = {
            id: 'invite_' + Date.now(),
            fromUser: this.currentUser.id,
            toUser: userId,
            gameType: 'solo',
            status: 'pending',
            timestamp: new Date()
        };
        
        this.gameInvites.set(invite.id, invite);
        
        const user = this.getUserById(userId);
        this.addSystemMessage(`Game invite sent to ${user?.username}!`);
        
        // Simulate response after a delay
        setTimeout(() => {
            this.simulateInviteResponse(invite.id);
        }, Math.random() * 5000 + 3000);
    }
    
    private simulateInviteResponse(inviteId: string): void {
        const invite = this.gameInvites.get(inviteId);
        if (!invite) return;
        
        const user = this.getUserById(invite.toUser);
        const responses = ['accepted', 'declined'];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        invite.status = response as 'accepted' | 'declined';
        
        if (response === 'accepted') {
            this.addSystemMessage(`${user?.username} accepted your game invite! 🎮`);
            // Here you would trigger the actual game launch
            // launchPongGameWithPlayers(this.currentUser.username, user.username);
        } else {
            this.addSystemMessage(`${user?.username} declined your game invite.`);
        }
    }
    
    private blockUser(userId: string): void {
        this.blockedUsers.add(userId);
        const user = this.getUserById(userId);
        this.addSystemMessage(`Blocked ${user?.username}. You will no longer see their messages.`);
        this.refreshMessages();
        this.updateBlockedUsersList();
    }
    
    private unblockUser(userId: string): void {
        this.blockedUsers.delete(userId);
        const user = this.getUserById(userId);
        this.addSystemMessage(`Unblocked ${user?.username}.`);
        this.updateBlockedUsersList();
    }
    
    private showHelp(): void {
        const helpText = `
Available commands:
• /invite [username] - Invite a player to a game
• /block [username] - Block a user
• /unblock [username] - Unblock a user
• /help - Show this help message

Click on usernames to view profiles or send direct messages.
        `.trim();
        
        this.addSystemMessage(helpText);
    }
    
    private addMessage(message: Message): void {
        // Don't show messages from blocked users
        if (message.senderId && this.blockedUsers.has(message.senderId) && !message.isOwn) {
            return;
        }
        
        this.messages.push(message);
        
        if (this.currentTab === message.type || 
            (this.currentTab === 'global' && message.type === 'system')) {
            this.renderMessage(message);
        }
        
        // Keep only last 100 messages
        if (this.messages.length > 100) {
            this.messages.shift();
        }
        
        this.scrollToBottom();
    }
    
    private addDmMessage(recipientId: string, message: Message): void {
        if (!this.dmMessages.has(recipientId)) {
            this.dmMessages.set(recipientId, []);
        }
        
        const messages = this.dmMessages.get(recipientId)!;
        messages.push(message);
        
        if (this.currentTab === 'dm' && this.currentDmRecipient === recipientId) {
            this.renderMessage(message);
        } else {
            // Show notification
            this.showDmNotification();
        }
        
        // Keep only last 50 DM messages per user
        if (messages.length > 50) {
            messages.shift();
        }
        
        this.scrollToBottom();
    }
    
    private addSystemMessage(text: string): void {
        const message: Message = {
            id: Date.now(),
            username: 'System',
            text: text,
            timestamp: new Date(),
            isOwn: false,
            type: 'system'
        };
        
        this.addMessage(message);
    }
    
    private addTournamentMessage(text: string): void {
        const message: Message = {
            id: Date.now(),
            username: 'Tournament',
            text: text,
            timestamp: new Date(),
            isOwn: false,
            type: 'tournament'
        };
        
        this.messages.push(message);
        
        if (this.currentTab === 'tournament') {
            this.renderMessage(message);
        } else {
            this.showTournamentNotification();
        }
        
        this.scrollToBottom();
    }
    
    private renderMessage(message: Message): void {
        if (!this.messagesArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.isOwn ? 'own' : message.type} relative`;
        
        const showTimestamp = document.getElementById('showTimestamps')?.checked !== false;
        
        let actionsHtml = '';
        if (!message.isOwn && message.type !== 'system' && message.type !== 'tournament') {
            actionsHtml = `
                <div class="message-actions flex space-x-1">
                    <button onclick="chatSystem.replyToUser('${message.senderId}')" class="text-xs text-gray-400 hover:text-white" title="Reply">↩</button>
                    <button onclick="chatSystem.showUserProfile('${message.senderId}')" class="text-xs text-gray-400 hover:text-white" title="Profile">👤</button>
                    <button onclick="chatSystem.blockUser('${message.senderId}')" class="text-xs text-gray-400 hover:text-red-400" title="Block">🚫</button>
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="username">${this.escapeHtml(message.username)}</div>
            <div class="text">${this.escapeHtml(message.text)}</div>
            ${showTimestamp ? `<div class="timestamp">${message.timestamp.toLocaleTimeString()}</div>` : ''}
            ${actionsHtml}
        `;
        
        this.messagesArea.appendChild(messageDiv);
        
        // Add click handler for username
        const usernameEl = messageDiv.querySelector('.username');
        if (usernameEl && !message.isOwn && message.senderId) {
            usernameEl.classList.add('cursor-pointer', 'hover:text-blue-400');
            usernameEl.addEventListener('click', () => {
                this.showUserProfile(message.senderId!);
            });
        }
    }
    
    private refreshMessages(): void {
        if (!this.messagesArea) return;
        
        this.messagesArea.innerHTML = '';
        
        let messagesToShow: Message[] = [];
        
        switch (this.currentTab) {
            case 'global':
                messagesToShow = this.messages.filter(m => 
                    m.type === 'global' || m.type === 'system'
                );
                break;
            case 'dm':
                if (this.currentDmRecipient) {
                    messagesToShow = this.dmMessages.get(this.currentDmRecipient) || [];
                } else {
                    this.showDmUserList();
                    return;
                }
                break;
            case 'tournament':
                messagesToShow = this.messages.filter(m => 
                    m.type === 'tournament' || m.type === 'system'
                );
                break;
        }
        
        messagesToShow.forEach(message => this.renderMessage(message));
        this.scrollToBottom();
    }
    
    private showDmUserList(): void {
        if (!this.messagesArea) return;
        
        this.messagesArea.innerHTML = `
            <div class="text-center text-gray-400 mt-8">
                <h3 class="text-lg font-semibold mb-4">Direct Messages</h3>
                <div class="space-y-2">
                    ${Array.from(this.users.values())
                        .filter(user => user.id !== this.currentUser.id)
                        .map(user => `
                            <div class="flex items-center justify-between p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600" onclick="chatSystem.startDmWith('${user.id}')">
                                <div class="flex items-center space-x-2">
                                    <div class="w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-400' : user.status === 'in_game' ? 'bg-yellow-400' : 'bg-gray-400'}"></div>
                                    <span class="text-white">${user.username}</span>
                                </div>
                                <span class="text-xs text-gray-400">${user.status}</span>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    }
    
    public startDmWith(userId: string): void {
        this.currentDmRecipient = userId;
        const user = this.getUserById(userId);
        
        // Update input placeholder
        if (this.messageInput && user) {
            this.messageInput.placeholder = `Message ${user.username}...`;
        }
        
        this.refreshMessages();
    }
    
    public replyToUser(userId: string): void {
        const user = this.getUserById(userId);
        if (!user) return;
        
        // Switch to DM tab and start conversation
        this.switchTab('dm');
        this.startDmWith(userId);
        
        // Show reply indicator
        const recipientInfo = document.getElementById('recipientInfo');
        const recipientName = document.getElementById('recipientName');
        
        if (recipientInfo && recipientName) {
            recipientName.textContent = user.username;
            recipientInfo.classList.remove('hidden');
        }
        
        this.messageInput?.focus();
    }
    
    private cancelReply(): void {
        const recipientInfo = document.getElementById('recipientInfo');
        recipientInfo?.classList.add('hidden');
    }
    
    public showUserProfile(userId: string): void {
        const user = this.getUserById(userId);
        if (!user) return;
        
        const modal = document.getElementById('profileModal');
        const content = document.getElementById('profileContent');
        
        if (!modal || !content) return;
        
        content.innerHTML = `
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
                    ${user.username.charAt(0).toUpperCase()}
                </div>
                <h3 class="text-xl font-bold text-white">${user.username}</h3>
                <div class="flex items-center justify-center space-x-2 mt-2">
                    <div class="w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-400' : user.status === 'in_game' ? 'bg-yellow-400' : 'bg-gray-400'}"></div>
                    <span class="text-sm text-gray-400 capitalize">${user.status.replace('_', ' ')}</span>
                </div>
            </div>
            
            <div class="bg-gray-700 rounded-lg p-4 mb-4">
                <h4 class="text-white font-semibold mb-2">Statistics</h4>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div class="text-lg font-bold text-green-400">${user.stats?.wins || 0}</div>
                        <div class="text-xs text-gray-400">Wins</div>
                    </div>
                    <div>
                        <div class="text-lg font-bold text-red-400">${user.stats?.losses || 0}</div>
                        <div class="text-xs text-gray-400">Losses</div>
                    </div>
                    <div>
                        <div class="text-lg font-bold text-blue-400">#${user.stats?.rank || 'N/A'}</div>
                        <div class="text-xs text-gray-400">Rank</div>
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button onclick="chatSystem.replyToUser('${userId}')" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    Send Message
                </button>
                <button onclick="chatSystem.sendGameInvite('${userId}')" class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                    Invite to Game
                </button>
                <button onclick="chatSystem.blockUser('${userId}'); chatSystem.closeProfile()" class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
                    Block
                </button>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }
    
    public closeProfile(): void {
        document.getElementById('profileModal')?.classList.add('hidden');
    }
    
    private openSettings(): void {
        this.updateBlockedUsersList();
        document.getElementById('settingsModal')?.classList.remove('hidden');
    }
    
    private closeSettings(): void {
        document.getElementById('settingsModal')?.classList.add('hidden');
    }
    
    private updateBlockedUsersList(): void {
        const container = document.getElementById('blockedUsersList');
        if (!container) return;
        
        if (this.blockedUsers.size === 0) {
            container.innerHTML = '<div class="text-gray-400 text-sm">No blocked users</div>';
            return;
        }
        
        container.innerHTML = Array.from(this.blockedUsers)
            .map(userId => {
                const user = this.getUserById(userId);
                return user ? `
                    <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <span class="text-white text-sm">${user.username}</span>
                        <button onclick="chatSystem.unblockUser('${userId}')" class="text-xs text-red-400 hover:text-red-300">
                            Unblock
                        </button>
                    </div>
                ` : '';
            }).join('');
    }
    
    private toggleChat(): void {
        this.isCollapsed = !this.isCollapsed;
        this.chatContainer?.classList.toggle('collapsed');
        
        const icon = document.getElementById('chatIcon');
        if (icon && this.isCollapsed) {
            icon.innerHTML = `<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>`;
        } else if (icon) {
            icon.innerHTML = `<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>`;
        }
        
        if (!this.isCollapsed) {
            setTimeout(() => this.messageInput?.focus(), 100);
        }
    }
    
    private showDmNotification(): void {
        const notification = document.getElementById('dmNotification');
        if (notification) {
            notification.classList.remove('hidden');
            // Update count logic here if needed
        }
    }
    
    private showTournamentNotification(): void {
        const notification = document.getElementById('tournamentNotification');
        if (notification) {
            notification.classList.remove('hidden');
        }
    }
    
    private updateOnlineCount(): void {
        const onlineUsers = Array.from(this.users.values()).filter(u => u.status === 'online').length;
        const counter = document.getElementById('onlineCount');
        if (counter) {
            counter.textContent = `(${onlineUsers} online)`;
        }
    }
    
    private updateCharCount(): void {
        const charCount = document.getElementById('charCount');
        const inputLength = this.messageInput?.value.length || 0;
        if (charCount) {
            charCount.textContent = `${inputLength}/200`;
        }
    }
    
    private scrollToBottom(): void {
        if (this.messagesArea) {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }
    }
    
    private getUserById(id: string): User | undefined {
        return this.users.get(id);
    }
    
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    private simulateActivity(): void {
        // Add welcome message
        setTimeout(() => {
            this.addSystemMessage(`Welcome ${this.currentUser.username}! Type /help for available commands.`);
        }, 1000);
        
        // Simulate random messages
        this.simulationInterval = window.setInterval(() => {
            if (Math.random() < 0.3) {
                const users = Array.from(this.users.values()).filter(u => u.status === 'online');
                const randomUser = users[Math.floor(Math.random() * users.length)];
                
                if (randomUser && !this.blockedUsers.has(randomUser.id)) {
                    const messages = [
                        "Anyone up for a game?",
                        "GG last match!",
                        "Looking for tournament partners",
                        "That was an intense game!",
                        "New high score! 🎉",
                        "Who wants to practice?",
                        "Tournament starting soon!",
                        "Great plays everyone!"
                    ];
                    
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    
                    this.addMessage({
                        id: Date.now(),
                        username: randomUser.username,
                        text: randomMessage,
                        timestamp: new Date(),
                        isOwn: false,
                        type: 'global',
                        senderId: randomUser.id
                    });
                }
            }
        }, 8000);
    }
    
    private setupTournamentNotifications(): void {
        const tournamentMessages = [
            "🏆 Tournament registration is now open!",
            "⚡ Next tournament match starting in 5 minutes",
            "🎮 Finals match beginning soon - don't miss it!",
            "🥇 Congratulations to our tournament winner!",
            "📋 Tournament bracket has been updated",
            "⏰ Tournament round 2 starting now"
        ];
        
        let messageIndex = 0;
        this.tournamentInterval = window.setInterval(() => {
            if (Math.random() < 0.4) {
                this.addTournamentMessage(tournamentMessages[messageIndex % tournamentMessages.length]);
                messageIndex++;
            }
        }, 15000);
    }
    
    public getIsTyping(): boolean {
        return this.isTyping;
    }
    
    public getCurrentUser(): User {
        return this.currentUser;
    }
    
    public destroy(): void {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        if (this.tournamentInterval) {
            clearInterval(this.tournamentInterval);
        }
    }
    
    public notifyTournamentMatch(player1: string, player2: string): void {
        this.addTournamentMessage(`🎮 Next match: ${player1} vs ${player2}`);
    }
    
    public notifyTournamentResult(winner: string, loser: string): void {
        this.addTournamentMessage(`🏆 ${winner} defeated ${loser}!`);
    }
    
    public notifyTournamentWinner(winner: string): void {
        this.addTournamentMessage(`🥇 Tournament Champion: ${winner}! Congratulations! 🎉`);
    }
}

declare global {
    interface Window {
        chatSystem: EnhancedChatSystem;
    }
}

// Export for use in other modules
(window as any).chatSystem = null;