interface Message {
    id: number;
    username: string;
    text: string;
    timestamp: Date;
    isOwn: boolean;
}

interface DemoMessage {
    username: string;
    text: string;
    isOwn: boolean;
}

export class ChatSystem {
    private messages: Message[];
    private username: string;
    private isCollapsed: boolean;
    private isTyping: boolean;
    
    private messagesArea: HTMLElement | null;
    private messageInput: HTMLInputElement | null;
    private sendButton: HTMLElement | null;
    private toggleButton: HTMLElement | null;
    private chatContainer: HTMLElement | null;
    
    private simulationInterval: number | null = null;

    constructor() {
        this.messages = [];
        this.username = "Player" + Math.floor(Math.random() * 1000);
        this.isCollapsed = false;
        this.isTyping = false;
        
        this.messagesArea = document.getElementById('messagesArea');
        this.messageInput = document.getElementById('messageInput') as HTMLInputElement;
        this.sendButton = document.getElementById('sendButton');
        this.toggleButton = document.getElementById('toggleChat');
        this.chatContainer = document.getElementById('chatContainer');
        
        this.initEventListeners();
        this.simulateMessages(); // Test Minh - Simulation
    }
    
    private initEventListeners(): void {
        // SEND BUTTON
        this.sendButton?.addEventListener('click', () => this.sendMessage());

        // KEYPRESS ENTER
        this.messageInput?.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // COLLAPSE WINDOW
        this.toggleButton?.addEventListener('click', () => this.toggleChat());
        
        // Track typing state
        this.messageInput?.addEventListener('focus', () => {
            this.isTyping = true;
        });
        
        this.messageInput?.addEventListener('blur', () => {
            this.isTyping = false;
        });

        // Also track typing state on input
        this.messageInput?.addEventListener('input', () => {
            this.isTyping = true;
        });
    }
    
    public sendMessage(): void {
        if (!this.messageInput) {
             return;
        }
        
        const text = this.messageInput.value.trim();
        if (!text) return;
        
        const message: Message = {
            id: Date.now(),
            username: this.username,
            text: text,
            timestamp: new Date(),
            isOwn: true
        };
        
        this.addMessage(message);
        this.messageInput.value = '';
        
        // POUR LES MULTIPLAYERS ?
        // this.sendToServer(message);
    }
    
    public addMessage(message: Message): void {
        this.messages.push(message);
        
        if (!this.messagesArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.isOwn ? 'own' : 'other'}`;
        messageDiv.innerHTML = `
            <div class="username">${message.username}</div>
            <div class="text">${this.escapeHtml(message.text)}</div>
            <div class="timestamp">${message.timestamp.toLocaleTimeString()}</div>
        `;
        
        this.messagesArea.appendChild(messageDiv);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        
        if (this.isCollapsed && !message.isOwn) {
            this.showNotification();
        }
        
        if (this.messages.length > 50) {
            this.messages.shift();
            if (this.messagesArea.firstChild) {
                this.messagesArea.removeChild(this.messagesArea.firstChild);
            }
        }
    }
    
    private toggleChat(): void {
        this.isCollapsed = !this.isCollapsed;
        this.chatContainer?.classList.toggle('collapsed');
        
        if (this.toggleButton) {
            this.toggleButton.textContent = this.isCollapsed ? '+' : '−';
        }
        
        if (!this.isCollapsed) {
            this.hideNotification();
            setTimeout(() => {
                this.messageInput?.focus();
            }, 100);
        }
    }
    
    private showNotification(): void {
        if (!document.querySelector('.notification-dot') && this.toggleButton) {
            const dot = document.createElement('div');
            dot.className = 'notification-dot';
            this.toggleButton.style.position = 'relative';
            this.toggleButton.appendChild(dot);
        }
    }
    
    private hideNotification(): void {
        const dot = document.querySelector('.notification-dot');
        if (dot) dot.remove();
    }
    
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Test Minh: Simulate incoming messages
    private simulateMessages(): void {
        const demoMessages: DemoMessage[] = [
            { username: "GameMaster", text: "Welcome to the game!", isOwn: false },
            { username: "Player123", text: "Good luck everyone!", isOwn: false },
            { username: "ProGamer", text: "Ready to play!", isOwn: false }
        ];
        
        demoMessages.forEach((msg, index) => {
            setTimeout(() => {
                this.addMessage({
                    ...msg,
                    id: Date.now() + index,
                    timestamp: new Date()
                });
            }, (index + 1) * 2000);
        });
        
        // Continue simulating messages
        this.simulationInterval = window.setInterval(() => {
            if (Math.random() < 0.3) {
                const randomMessages = [
                    "Nice shot!",
                    "Great game!",
                    "Close one!",
                    "Good play",
                    "Almost had it!",
                    "GG!",
                    "Well played",
                    "That was close!"
                ];
                
                this.addMessage({
                    id: Date.now(),
                    username: "Player" + Math.floor(Math.random() * 999),
                    text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
                    timestamp: new Date(),
                    isOwn: false
                });
            }
        }, 10000);
    }

    public getIsTyping(): boolean {
        return this.isTyping;
    }
    
    public getUsername(): string {
        return this.username;
    }
    
    public setUsername(username: string): void {
        this.username = username;
    }
    
    public clearMessages(): void {
        this.messages = [];
        if (this.messagesArea) {
            this.messagesArea.innerHTML = '';
        }
    }
    
    public destroy(): void {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
    }
    
    public receiveMessage(username: string, text: string): void {
        const message: Message = {
            id: Date.now(),
            username: username,
            text: text,
            timestamp: new Date(),
            isOwn: false
        };
        
        this.addMessage(message);
    }
}