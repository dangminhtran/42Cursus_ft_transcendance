import { renderNavbar } from '../componentes/navbar';

type GameScore = {
	player1name: string,
	player1score: number,
	player2name: string,
	player2score: number,
	date: string,
	gameType: '1v1' | 'tournament',
	duration: string,
	winner: string,
};

type User = {
	id: string,
	name: string,
	isOnline: boolean,
	lastSeen: string,
	stats: {
		wins: number,
		losses: number,
		draws: number,
		totalGames: number,
		winRate: number,
	},
	avatar: string,
	joinDate: string,
};

type Friend = {
	user: User,
	status: 'online' | 'offline' | 'in-game',
	addedDate: string,
};

// Mock current user data
const currentUser: User = {
	id: 'current-user',
	name: 'Alice',
	isOnline: true,
	lastSeen: '2025-07-27T10:30:00Z',
	stats: {
		wins: 12,
		losses: 8,
		draws: 2,
		totalGames: 22,
		winRate: 54.5,
	},
	avatar: '🎮',
	joinDate: '2025-01-15',
};

// Mock users data
const users: User[] = [
	{
		id: 'bob',
		name: 'Bob',
		isOnline: true,
		lastSeen: '2025-07-27T10:25:00Z',
		stats: { wins: 8, losses: 12, draws: 1, totalGames: 21, winRate: 38.1 },
		avatar: '🎯',
		joinDate: '2025-02-01',
	},
	{
		id: 'charlie',
		name: 'Charlie',
		isOnline: false,
		lastSeen: '2025-07-26T22:15:00Z',
		stats: { wins: 15, losses: 6, draws: 3, totalGames: 24, winRate: 62.5 },
		avatar: '⚡',
		joinDate: '2025-01-20',
	},
	{
		id: 'eve',
		name: 'Eve',
		isOnline: true,
		lastSeen: '2025-07-27T10:28:00Z',
		stats: { wins: 18, losses: 9, draws: 1, totalGames: 28, winRate: 64.3 },
		avatar: '🔥',
		joinDate: '2025-01-10',
	},
	{
		id: 'dave',
		name: 'Dave',
		isOnline: false,
		lastSeen: '2025-07-27T08:45:00Z',
		stats: { wins: 7, losses: 11, draws: 4, totalGames: 22, winRate: 31.8 },
		avatar: '🎲',
		joinDate: '2025-02-10',
	},
	{
		id: 'mallory',
		name: 'Mallory',
		isOnline: true,
		lastSeen: '2025-07-27T10:20:00Z',
		stats: { wins: 13, losses: 10, draws: 2, totalGames: 25, winRate: 52.0 },
		avatar: '🌟',
		joinDate: '2025-01-25',
	},
		{
		id: 'oscar',
		name: 'Oscar',
		isOnline: true,
		lastSeen: '2025-07-27T10:50:00Z',
		stats: { wins: 19, losses: 1, draws: 2, totalGames: 22, winRate: 80.0 },
		avatar: '🌟',
		joinDate: '2025-01-19',
	},
];

// Mock friends data
const friends: Friend[] = [
	{
		user: users.find(u => u.id === 'bob')!,
		status: 'online',
		addedDate: '2025-07-20',
	},
	{
		user: users.find(u => u.id === 'charlie')!,
		status: 'offline',
		addedDate: '2025-07-18',
	},
	{
		user: users.find(u => u.id === 'eve')!,
		status: 'in-game',
		addedDate: '2025-07-15',
	},
	{
		user: users.find(u => u.id === 'mallory')!,
		status: 'online',
		addedDate: '2025-07-22',
	},
];

// Mock - All games in the system
const allGameHistory: GameScore[] = [
	// Alice's games
	{ player1name: "Alice", player1score: 5, player2name: "Bot", player2score: 3, date: "2025-07-24", gameType: "1v1", duration: "12:34", winner: "Alice" },
	{ player1name: "Eve", player1score: 1, player2name: "Alice", player2score: 5, date: "2025-07-21", gameType: "1v1", duration: "09:12", winner: "Alice" },
	{ player1name: "Alice", player1score: 3, player2name: "Charlie", player2score: 5, date: "2025-07-19", gameType: "1v1", duration: "14:25", winner: "Charlie" },
	{ player1name: "Bob", player1score: 1, player2name: "Alice", player2score: 5, date: "2025-07-17", gameType: "1v1", duration: "11:08", winner: "Alice" },

	// Bob's games
	{ player1name: "Bob", player1score: 2, player2name: "Eve", player2score: 5, date: "2025-07-23", gameType: "1v1", duration: "08:45", winner: "Eve" },
	{ player1name: "Peggy", player1score: 5, player2name: "Bob", player2score: 2, date: "2025-07-16", gameType: "1v1", duration: "14:33", winner: "Peggy" },
	{ player1name: "Bob", player1score: 4, player2name: "Charlie", player2score: 3, date: "2025-07-14", gameType: "1v1", duration: "16:45", winner: "Bob" },
	{ player1name: "Bob", player1score: 5, player2name: "Mallory", player2score: 2, date: "2025-07-12", gameType: "1v1", duration: "09:33", winner: "Bob" },

	// Charlie's games
	{ player1name: "Charlie", player1score: 4, player2name: "Dave", player2score: 4, date: "2025-07-22", gameType: "1v1", duration: "15:20", winner: "Draw" },
	{ player1name: "Trent", player1score: 2, player2name: "Charlie", player2score: 5, date: "2025-07-18", gameType: "1v1", duration: "13:42", winner: "Charlie" },
	{ player1name: "Charlie", player1score: 5, player2name: "Eve", player2score: 3, date: "2025-07-13", gameType: "1v1", duration: "12:18", winner: "Charlie" },
	{ player1name: "Charlie", player1score: 2, player2name: "Mallory", player2score: 5, date: "2025-07-11", gameType: "1v1", duration: "10:27", winner: "Mallory" },

	// Eve's games
	{ player1name: "Eve", player1score: 5, player2name: "Dave", player2score: 2, date: "2025-07-20", gameType: "1v1", duration: "11:55", winner: "Eve" },
	{ player1name: "Eve", player1score: 4, player2name: "Mallory", player2score: 3, date: "2025-07-15", gameType: "1v1", duration: "13:12", winner: "Eve" },
	{ player1name: "Oscar", player1score: 2, player2name: "Eve", player2score: 5, date: "2025-07-10", gameType: "1v1", duration: "08:44", winner: "Eve" },

	// Mallory's games
	{ player1name: "Mallory", player1score: 3, player2name: "Trent", player2score: 5, date: "2025-07-20", gameType: "1v1", duration: "11:28", winner: "Trent" },
	{ player1name: "Victor", player1score: 4, player2name: "Mallory", player2score: 5, date: "2025-07-17", gameType: "1v1", duration: "10:55", winner: "Mallory" },
	{ player1name: "Mallory", player1score: 5, player2name: "Dave", player2score: 1, date: "2025-07-09", gameType: "1v1", duration: "07:22", winner: "Mallory" },

	// Other games
	{ player1name: "Oscar", player1score: 5, player2name: "Peggy", player2score: 0, date: "2025-07-19", gameType: "1v1", duration: "06:15", winner: "Oscar" },
	{ player1name: "Dave", player1score: 3, player2name: "Oscar", player2score: 5, date: "2025-07-15", gameType: "1v1", duration: "07:48", winner: "Oscar" },
];

// Current view - can be 'all', 'my-games', or a specific friend's name
let currentHistoryView = 'my-games';
let selectedFriend: string | null = null;

function getStatusIcon(status: string): string {
	switch (status) {
		case 'online': return '🟢';
		case 'offline': return '⚫';
		case 'in-game': return '🎮';
		default: return '⚫';
	}
}

function formatLastSeen(lastSeen: string): string {
	const date = new Date(lastSeen);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;

	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;

	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
}

function renderUserProfile(): string {
    return `
        <div class="bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4">👤 Your Profile</h2>
            <div class="flex items-center space-x-4 mb-4">
                <div class="text-4xl">${currentUser.avatar}</div>
                <div>
                    <h3 class="text-xl font-semibold text-white">${currentUser.name}</h3>
                    <p class="text-gray-400 text-base">Member since ${new Date(currentUser.joinDate).toLocaleDateString()}</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="text-green-400 text-base">🟢 Online</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-green-400">${currentUser.stats.wins}</div>
                    <div class="text-gray-300 text-sm">Wins</div>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-red-400">${currentUser.stats.losses}</div>
                    <div class="text-gray-300 text-sm">Losses</div>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-yellow-400">${currentUser.stats.draws}</div>
                    <div class="text-gray-300 text-sm">Draws</div>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-blue-400">${currentUser.stats.totalGames}</div>
                    <div class="text-gray-300 text-sm">Total Games</div>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-purple-400">${currentUser.stats.winRate}%</div>
                    <div class="text-gray-300 text-sm">Win Rate</div>
                </div>
            </div>
        </div>
    `;
}

function renderFriendsList(): string {
    const friendsHtml = friends.map(friend => `
        <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer friend-item">
            <div class="flex items-center space-x-3">
                <div class="text-2xl">${friend.user.avatar}</div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="font-semibold text-white text-base">${friend.user.name}</span>
                        <span class="text-sm">${getStatusIcon(friend.status)}</span>
                    </div>
                    <div class="text-sm text-gray-400 mt-1">
                        ${friend.status === 'online' ? 'Online' :
            friend.status === 'in-game' ? 'In Game' :
                `Last seen ${formatLastSeen(friend.user.lastSeen)}`}
                    </div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-sm text-gray-300">${friend.user.stats.wins}W-${friend.user.stats.losses}L</div>
                <div class="text-sm text-gray-500">${friend.user.stats.winRate}% WR</div>
            </div>
        </div>
    `).join('');

    return `
        <div class="bg-gray-800 rounded-lg p-6 h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white">👥 Friends (${friends.length})</h2>
                <button id="add-friend-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    + Add Friend
                </button>
            </div>
            <div class="space-y-3 flex-1 overflow-y-auto">
                ${friendsHtml}
            </div>
        </div>
    `;
}

function getFilteredGames(): GameScore[] {
	if (currentHistoryView === 'all') {
		return allGameHistory;
	} else if (currentHistoryView === 'my-games') {
		return allGameHistory.filter(game =>
			game.player1name === currentUser.name || game.player2name === currentUser.name
		);
	} else {
		return allGameHistory.filter(game =>
			game.player1name === selectedFriend || game.player2name === selectedFriend
		);
	}
}

function getHistoryTitle(): string {
	if (currentHistoryView === 'all') {
		return '📊 All Match History';
	} else if (currentHistoryView === 'my-games') {
		return '📊 My Match History';
	} else {
		const friend = friends.find(f => f.user.name === selectedFriend);
		return `📊 ${selectedFriend}'s Match History ${friend?.user.avatar || ''}`;
	}
}

function renderMatchHistory(): string {
    const filteredGames = getFilteredGames();
    const rowsHtml = filteredGames.map(game => {
        const isCurrentUserInvolved = game.player1name === currentUser.name || game.player2name === currentUser.name;
        const isFriendInvolved = game.player1name === selectedFriend || game.player2name === selectedFriend;

        let rowClass = '';
        if (currentHistoryView === 'my-games' && isCurrentUserInvolved) {
            // Color based on win/loss for current user in "My Games" view
            if (game.winner === currentUser.name) {
                rowClass = 'bg-blue-900 bg-opacity-30'; // Victory in blue
            } else if (game.winner === 'Draw') {
                rowClass = 'bg-yellow-900 bg-opacity-30'; // Draw in yellow
            } else {
                rowClass = 'bg-red-900 bg-opacity-30'; // Defeat in red
            }
        } else if (currentHistoryView !== 'my-games' && isFriendInvolved) {
            rowClass = 'bg-purple-900 bg-opacity-30';
        }

        return `
            <tr class="${rowClass} hover:bg-gray-700 transition-colors">
                <td class="p-3 border-b border-gray-600 text-sm">${game.date}</td>
                <td class="p-3 border-b border-gray-600 text-sm">
                    <span class="${game.player1name === currentUser.name ? 'font-bold text-blue-400' :
                game.player1name === selectedFriend ? 'font-bold text-purple-400' : ''
            }">${game.player1name}</span>
                </td>
                <td class="p-3 border-b border-gray-600 text-center font-mono text-sm">${game.player1score}</td>
                <td class="p-3 border-b border-gray-600 text-center text-gray-400 text-sm">vs</td>
                <td class="p-3 border-b border-gray-600 text-center font-mono text-sm">${game.player2score}</td>
                <td class="p-3 border-b border-gray-600 text-sm">
                    <span class="${game.player2name === currentUser.name ? 'font-bold text-blue-400' :
                game.player2name === selectedFriend ? 'font-bold text-purple-400' : ''
            }">${game.player2name}</span>
                </td>
                <td class="p-3 border-b border-gray-600 text-center">
                    <span class="px-2 py-1 bg-gray-600 rounded text-sm">${game.gameType}</span>
                </td>
                <td class="p-3 border-b border-gray-600 text-center text-gray-400 font-mono text-sm">${game.duration}</td>
                <td class="p-3 border-b border-gray-600 text-center">
                    <span class="font-semibold text-sm ${game.winner === currentUser.name ? 'text-green-400' :
                game.winner === selectedFriend ? 'text-purple-400' :
                    game.winner === 'Draw' ? 'text-yellow-400' : 'text-red-400'
            }">${game.winner}</span>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="bg-gray-800 rounded-lg p-6 h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-white">${getHistoryTitle()}</h2>
                <div class="flex space-x-2">
                    <button onclick="switchHistoryView('my-games')" 
                            class="px-3 py-2 rounded text-sm transition-colors ${currentHistoryView === 'my-games' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
        }">
                        My Games
                    </button>
                    <button onclick="switchHistoryView('all')" 
                            class="px-3 py-2 rounded text-sm transition-colors ${currentHistoryView === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
        }">
                        All Games
                    </button>
                    ${currentHistoryView !== 'my-games' && currentHistoryView !== 'all' ? `
                        <button onclick="switchHistoryView('my-games')" 
                                class="px-3 py-2 rounded text-sm bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors">
                            ← Back
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="flex-1 overflow-auto">
                <table class="w-full border-collapse text-base">
                    <thead class="sticky top-0 bg-gray-700">
                        <tr>
                            <th class="p-3 text-left text-white font-semibold border-b border-gray-600">Date</th>
                            <th class="p-3 text-left text-white font-semibold border-b border-gray-600">Player 1</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">Score</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600"></th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">Score</th>
                            <th class="p-3 text-left text-white font-semibold border-b border-gray-600">Player 2</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">Type</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">Duration</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">Winner</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-300">
                        ${rowsHtml}
                        ${filteredGames.length === 0 ? `
                            <tr>
                                <td colspan="9" class="p-4 text-center text-gray-400">
                                    No games found for this filter
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            <div class="mt-3 text-sm text-gray-400 text-center">
                Showing ${filteredGames.length} game${filteredGames.length !== 1 ? 's' : ''}
            </div>
        </div>
    `;
}

export function renderHome() {
    renderNavbar();

    document.getElementById('app')!.innerHTML = `
        <div class="flex flex-col justify-center items-center -mt-20 h-screen overflow-hidden pt-15">
            <div class="w-full max-w-7xl mx-auto p-6 h-full flex flex-col">				
                <h1 class="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    🎮 Game Dashboard
                </h1>
                
                <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    <div class="lg:col-span-2 flex flex-col space-y-6 overflow-hidden">
                        ${renderUserProfile()}
                        <div class="flex-1 overflow-hidden">
                            ${renderMatchHistory()}
                        </div>
                    </div>
                    <div class="overflow-y-auto">
                        ${renderFriendsList()}
                    </div>
                </div>
            </div>
        </div>
    `;

    addEventListeners();
}

function refreshHomeDashboard() {
    const mainContent = `
        <div class="flex flex-col justify-center items-center -mt-20 h-screen overflow-hidden pt-15">
            <div class="w-full max-w-7xl mx-auto p-6 h-full flex flex-col">
                <h1 class="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    🎮 Game Dashboard
                </h1>

                <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    <div class="lg:col-span-2 flex flex-col space-y-6 overflow-hidden">
                        ${renderUserProfile()}
                        <div class="flex-1 overflow-hidden">
                            ${renderMatchHistory()}
                        </div>
                    </div>
                    <div class="overflow-y-auto">
                        ${renderFriendsList()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app')!.innerHTML = mainContent;
    addEventListeners();
}

(window as any).switchHistoryView = function (view: string) {
	currentHistoryView = view;
	if (view !== 'my-games' && view !== 'all') {
		selectedFriend = view;
		currentHistoryView = 'friend';
	} else {
		selectedFriend = null;
	}

	refreshHomeDashboard();
};

function addEventListeners() {
	const addFriendBtn = document.getElementById('add-friend-btn');
	if (addFriendBtn) {
		addFriendBtn.addEventListener('click', () => {
			addFriends();
		});
	}

	const friendElements = document.querySelectorAll('.friend-item');
	friendElements.forEach(element => {
		element.addEventListener('click', () => {
			const friendName = element.querySelector('.font-semibold')?.textContent;
			if (friendName) {
				selectedFriend = friendName;
				currentHistoryView = 'friend';

				refreshHomeDashboard();

				// setTimeout(() => {
				// 	const historySection = document.querySelector('.bg-gray-800:last-child');
				// 	if (historySection) {
				// 		historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
				// 	}
				// }, 100);

				setTimeout(() => {
					const historySection = document.querySelector('.bg-gray-800:last-child');
					if (historySection) {
						historySection.scrollIntoView({ 
							behavior: 'smooth', 
							block: 'center' // This centers the element in the viewport
						});
					}
				}, 100);
			}
		});
	});
}

export function addFriends() {
	renderNavbar();
	
	document.getElementById('app')!.innerHTML = `
		<div class="flex flex-col justify-center items-center -mt-20 h-screen">
			<div class="bg-gray-800 rounded-lg p-8 w-full max-w-md">
				<h2 class="text-2xl font-bold text-white mb-6 text-center">👥 Add New Friend</h2>
				<form id="add-friend-form">
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-300 mb-2">Friend's Name</label>
						<input 
							id="friend-name-input"
							type="text" 
							placeholder="Enter friend's name"
							class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						>
					</div>
					<div class="flex space-x-3">
						<button 
							type="submit"
							class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
						>
							Add Friend
						</button>
						<button 
							type="button"
							id="cancel-add-friend"
							class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
				
				<!-- Available users to add -->
				<div class="mt-6">
					<h3 class="text-lg font-semibold text-white mb-3">Available Users</h3>
					<div class="space-y-2 max-h-48 overflow-y-auto">
						${getAvailableUsers().map(user => `
							<div class="flex items-center justify-between p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors available-user" data-user-name="${user.name}">
								<div class="flex items-center space-x-3">
									<span class="text-xl">${user.avatar}</span>
									<div>
										<span class="text-white font-medium">${user.name}</span>
										<div class="text-xs text-gray-400">${user.stats.wins}W-${user.stats.losses}L (${user.stats.winRate}% WR)</div>
									</div>
								</div>
								<button class="text-blue-400 hover:text-blue-300 text-sm">Add</button>
							</div>
						`).join('')}
					</div>
				</div>
			</div>
		</div>
	`;

	const form = document.getElementById('add-friend-form');
	const cancelBtn = document.getElementById('cancel-add-friend');
	const friendNameInput = document.getElementById('friend-name-input') as HTMLInputElement;
	const availableUsers = document.querySelectorAll('.available-user');

	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const friendName = friendNameInput.value.trim();
			if (friendName) {
				handleAddFriend(friendName);
			}
		});
	}

	if (cancelBtn) {
		cancelBtn.addEventListener('click', () => {
			renderHome();
		});
	}

	availableUsers.forEach(userElement => {
		userElement.addEventListener('click', () => {
			const userName = userElement.getAttribute('data-user-name');
			if (userName) {
				friendNameInput.value = userName;
			}
		});
	});

	// Focus on input
	setTimeout(() => {
		friendNameInput.focus();
	}, 100);
}

function getAvailableUsers(): User[] {
	const friendIds = friends.map(friend => friend.user.id);
	return users.filter(user => !friendIds.includes(user.id));
}

function handleAddFriend(friendName: string) {
	const userToAdd = users.find(user => user.name.toLowerCase() === friendName.toLowerCase());
	
	if (!userToAdd) {
		showMessage('User not found. Please check the name and try again.', 'error');
		return;
	}

	const isAlreadyFriend = friends.some(friend => friend.user.id === userToAdd.id);
	if (isAlreadyFriend) {
		showMessage(`${userToAdd.name} is already your friend!`, 'warning');
		return;
	}

	const newFriend: Friend = {
		user: userToAdd,
		status: userToAdd.isOnline ? 'online' : 'offline',
		addedDate: new Date().toISOString().split('T')[0]
	};

	friends.push(newFriend);
	showMessage(`${userToAdd.name} has been added to your friends list!`, 'success');
	
	setTimeout(() => {
		renderHome();
	}, 1500);
}

function showMessage(message: string, type: 'success' | 'error' | 'warning') {

	const existingMessage = document.getElementById('status-message');
	if (existingMessage) {
		existingMessage.remove();
	}

	const messageDiv = document.createElement('div');
	messageDiv.id = 'status-message';
	messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-1002 transition-all duration-300 ${
		type === 'success' ? 'bg-green-600' :
		type === 'error' ? 'bg-red-600' :
		'bg-yellow-600'
	}`;
	messageDiv.textContent = message;

	document.body.appendChild(messageDiv);

	setTimeout(() => {
		messageDiv.style.opacity = '0';
		messageDiv.style.transform = 'translateX(100%)';
		setTimeout(() => {
			messageDiv.remove();
		}, 300);
	}, 3000);
}