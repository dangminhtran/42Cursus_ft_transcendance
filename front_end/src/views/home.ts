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
		<div class="bg-gray-800 rounded-lg p-6 mb-6">
			<h2 class="text-2xl font-bold text-white mb-4">👤 Your Profile</h2>
			<div class="flex items-center space-x-4 mb-4">
				<div class="text-4xl">${currentUser.avatar}</div>
				<div>
					<h3 class="text-xl font-semibold text-white">${currentUser.name}</h3>
					<p class="text-gray-400">Member since ${new Date(currentUser.joinDate).toLocaleDateString()}</p>
					<div class="flex items-center space-x-2">
						<span class="text-green-400">🟢 Online</span>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
				<div class="bg-gray-700 rounded p-3">
					<div class="text-2xl font-bold text-green-400">${currentUser.stats.wins}</div>
					<div class="text-gray-300 text-sm">Wins</div>
				</div>
				<div class="bg-gray-700 rounded p-3">
					<div class="text-2xl font-bold text-red-400">${currentUser.stats.losses}</div>
					<div class="text-gray-300 text-sm">Losses</div>
				</div>
				<div class="bg-gray-700 rounded p-3">
					<div class="text-2xl font-bold text-yellow-400">${currentUser.stats.draws}</div>
					<div class="text-gray-300 text-sm">Draws</div>
				</div>
				<div class="bg-gray-700 rounded p-3">
					<div class="text-2xl font-bold text-blue-400">${currentUser.stats.totalGames}</div>
					<div class="text-gray-300 text-sm">Total Games</div>
				</div>
				<div class="bg-gray-700 rounded p-3">
					<div class="text-2xl font-bold text-purple-400">${currentUser.stats.winRate}%</div>
					<div class="text-gray-300 text-sm">Win Rate</div>
				</div>
			</div>
		</div>
	`;
}

function renderFriendsList(): string {
	const friendsHtml = friends.map(friend => `
		<div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
			<div class="flex items-center space-x-3">
				<div class="text-2xl">${friend.user.avatar}</div>
				<div>
					<div class="flex items-center space-x-2">
						<span class="font-semibold text-white">${friend.user.name}</span>
						<span class="text-sm">${getStatusIcon(friend.status)}</span>
					</div>
					<div class="text-sm text-gray-400">
						${friend.status === 'online' ? 'Online' :
			friend.status === 'in-game' ? 'In Game' :
				`Last seen ${formatLastSeen(friend.user.lastSeen)}`}
					</div>
				</div>
			</div>
			<div class="text-right">
				<div class="text-sm text-gray-300">${friend.user.stats.wins}W-${friend.user.stats.losses}L</div>
				<div class="text-xs text-gray-500">${friend.user.stats.winRate}% WR</div>
			</div>
		</div>
	`).join('');

	return `
		<div class="bg-gray-800 rounded-lg p-6 mb-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-2xl font-bold text-white">👥 Friends (${friends.length})</h2>
				<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
					+ Add Friend
				</button>
			</div>
			<div class="space-y-3">
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
			rowClass = 'bg-blue-900 bg-opacity-30';
		} else if (currentHistoryView !== 'my-games' && isFriendInvolved) {
			rowClass = 'bg-purple-900 bg-opacity-30';
		}

		return `
			<tr class="${rowClass} hover:bg-gray-700 transition-colors">
				<td class="p-3 border-b border-gray-600">${game.date}</td>
				<td class="p-3 border-b border-gray-600">
					<span class="${game.player1name === currentUser.name ? 'font-bold text-blue-400' :
				game.player1name === selectedFriend ? 'font-bold text-purple-400' : ''
			}">${game.player1name}</span>
				</td>
				<td class="p-3 border-b border-gray-600 text-center font-mono">${game.player1score}</td>
				<td class="p-3 border-b border-gray-600 text-center text-gray-400">vs</td>
				<td class="p-3 border-b border-gray-600 text-center font-mono">${game.player2score}</td>
				<td class="p-3 border-b border-gray-600">
					<span class="${game.player2name === currentUser.name ? 'font-bold text-blue-400' :
				game.player2name === selectedFriend ? 'font-bold text-purple-400' : ''
			}">${game.player2name}</span>
				</td>
				<td class="p-3 border-b border-gray-600 text-center">
					<span class="px-2 py-1 bg-gray-600 rounded text-xs">${game.gameType}</span>
				</td>
				<td class="p-3 border-b border-gray-600 text-center text-gray-400 font-mono text-sm">${game.duration}</td>
				<td class="p-3 border-b border-gray-600 text-center">
					<span class="font-semibold ${game.winner === currentUser.name ? 'text-green-400' :
				game.winner === selectedFriend ? 'text-purple-400' :
					game.winner === 'Draw' ? 'text-yellow-400' : 'text-red-400'
			}">${game.winner}</span>
				</td>
			</tr>
		`;
	}).join('');

	return `
		<div class="bg-gray-800 rounded-lg p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-2xl font-bold text-white">${getHistoryTitle()}</h2>
				<div class="flex space-x-2">
					<button onclick="switchHistoryView('my-games')" 
							class="px-3 py-1 rounded text-sm transition-colors ${currentHistoryView === 'my-games' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
		}">
						My Games
					</button>
					<button onclick="switchHistoryView('all')" 
							class="px-3 py-1 rounded text-sm transition-colors ${currentHistoryView === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
		}">
						All Games
					</button>
					${currentHistoryView !== 'my-games' && currentHistoryView !== 'all' ? `
						<button onclick="switchHistoryView('my-games')" 
								class="px-3 py-1 rounded text-sm bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors">
							← Back
						</button>
					` : ''}
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr class="bg-gray-700">
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
								<td colspan="9" class="p-6 text-center text-gray-400">
									No games found for this filter
								</td>
							</tr>
						` : ''}
					</tbody>
				</table>
			</div>
			<div class="mt-4 text-sm text-gray-400 text-center">
				Showing ${filteredGames.length} game${filteredGames.length !== 1 ? 's' : ''}
			</div>
		</div>
	`;
}

export function renderHome() {
	renderNavbar();

	// Main container with dark theme
	document.getElementById('app')!.innerHTML = `
		<div class="min-h-screen glassTouch text-white p-6">
			<div class="max-w-7xl mx-auto">
				<h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
					🎮 Game Dashboard
				</h1>
				
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					<div class="lg:col-span-2">
						${renderUserProfile()}
					</div>
					<div>
						${renderFriendsList()}
					</div>
				</div>
				
				${renderMatchHistory()}
			</div>
		</div>
	`;

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

	const historyContainer = document.querySelector('.bg-gray-800:last-child');
	if (historyContainer) {
		historyContainer.outerHTML = renderMatchHistory();
	}
};

function addEventListeners() {
	const addFriendBtn = document.querySelector('button');
	if (addFriendBtn) {
		addFriendBtn.addEventListener('click', () => {
			addFriends()
		});
	}

	const friendElements = document.querySelectorAll('.bg-gray-700');
	friendElements.forEach(element => {
		element.addEventListener('click', (e) => {
			if ((e.target as HTMLElement).tagName !== 'BUTTON') {
				const friendName = element.querySelector('.font-semibold')?.textContent;
				if (friendName) {
					// Show friend's match history
					selectedFriend = friendName;
					currentHistoryView = 'friend';

					// Re-render the match history
					const historyContainer = document.querySelector('.bg-gray-800:last-child');
					if (historyContainer) {
						historyContainer.outerHTML = renderMatchHistory();
					}

					setTimeout(() => {
						const historySection = document.querySelector('.bg-gray-800:last-child');
						if (historySection) {
							historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}
					}, 100);
				}
			}
		});
	});
}

export function addFriends() {
	renderNavbar()
	document.getElementById('app')!.innerHTML = `
  <div class="flex flex-col -mt-60 justify-center">
  	<div class="card p-7">
		<label class="block text-sm font-medium text-gray-700 mb-2">Put your friend's name</label>
		<input 
			type="text" 
			placeholder="Enter friend name"
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			required
		>
      </div>
    </div>
  `;
}

// function openFriendsModal(playerCount: number) {
//   const modal = document.getElementById("playerModal");
//   const inputsContainer = document.getElementById("playerInputs");

//   if (inputsContainer != null) {
//     inputsContainer.innerHTML = '';
//     for (let i = 1; i <= playerCount; i++) {
//       inputsContainer.innerHTML += `
//             <div>
//                 <label class="block text-sm font-medium text-gray-700 mb-2">Player ${i}</label>
//                 <input 
//                     type="text" 
//                     id="player${i}" 
//                     placeholder="Enter player ${i} name"
//                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                 >
//             </div>
//         `;
//     }

//     modal?.classList.remove('hidden');
//   }

//   setTimeout(() => {
//     document.getElementById("player1")?.focus();
//   }, 100);
// }

// function closeFriendsModal() {
//   document.getElementById("playerModal")?.classList.add('hidden');
// }