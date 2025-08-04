import axios from 'axios';
import { renderNavbar } from '../componentes/navbar';
import { TEST_ADDRESS, TOURNAMENT_ADDRESS, BASE_ADDRESS } from '../config';
import { navigateTo } from '../router';
import { i18n, t } from '../i18n';
import { WebXRMotionControllerManager } from '@babylonjs/core';
import * as sanitizeHtml from 'sanitize-html';

let currentUser: any = {}
const getCurrentUser = async () => {
	try {
		const token = sessionStorage.getItem("token");

		if (!token) {
			console.error('No token found in sessionStorage');
			return null;
		}

		const response = await axios.post(
			`${BASE_ADDRESS}/user-management/profile`,
			{},
			{
				headers:
				{
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		currentUser = response.data;
		return currentUser;
	} catch (error: any) {
		console.error('Error loading current user:', error);
		if (error.response) {
			console.error('Response status:', error.response.status);
			console.error('Response data:', error.response.data);
		}
		return null;
	}
}

// Variables globales pour les données chargées
let friends: any[] = [];
let isLoading = true;

// Current view - can be 'all', 'my-games', or a specific friend's name
let currentHistoryView = 'my-games';
let selectedFriend: string | null = null;

function getAuthToken(): string | null {
	return sessionStorage.getItem('token');
}

function getAuthHeaders() {
	const token = getAuthToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}


async function loadFriends(): Promise<void> {

	try {
		isLoading = true;
		const response = await axios.post(
			`${TEST_ADDRESS}/friends/fetch`,
			{},
			{
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}
		)
		if (response.data == null) {
			friends = []
			isLoading = false
		} else {
			friends = response.data
			isLoading = false

		}
	} catch (error) {
		console.error('Error loading friends:', error);
		isLoading = false;
		friends = []
		showMessage(t('home.errorLoadingFriends'), 'error');
	}
}


async function addFriendAPI(email: string): Promise<boolean> {
	try {
		await axios.post(
			`${TEST_ADDRESS}/friends/add`,
			{ email: email },
			{
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}
		);
		navigateTo('/');
		return true;
	} catch (error) {
		console.error('Error adding friend:', error);
		return false;
	}
}

// Fonction pour supprimer un ami via l'API
async function deleteFriendAPI(friendId: number): Promise<boolean> {
	try {
		await axios.post(
			`${TEST_ADDRESS}/friends/delete`,
			{ friend_id: friendId },
			{
				headers: getAuthHeaders()
			}
		);
		return true;
	} catch (error) {
		console.error('Error deleting friend:', error);
		return false;
	}
}

function renderUserProfile(): string {
	if (!currentUser || !currentUser.username) {
		return `
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-bold text-white mb-4">👤 ${t('home.yourProfile')}</h2>
                <div class="flex items-center justify-center h-32">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <span class="ml-2 text-gray-400">${t('home.loadingProfile')}</span>
                </div>
            </div>
        `;
	}

	let win: number = 0;
	let losses: number = 0;
	const totalGames = data.length;

	data.forEach((game) => {
		const winnerusername = game.player1_score > game.player2_score ? game.player1 : game.player2;
		if (winnerusername == currentUser.username)
			win++;
		else
			losses++;
	})

	const winrate: number = totalGames === 0 ? 0 : Math.round((win / totalGames) * 10000) / 100;


	return `
        <div class="bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4">👤 ${t('home.yourProfile')}</h2>
            <div class="flex items-center space-x-4 mb-4">
                <img class="h-12 w-12 rounded-full" src="${currentUser.profilepicture ? currentUser.profilepicture : "https://www.gravatar.com/avatar/default?s=150&d=mp"}" alt="User profile picture">
                <div>
                    <h3 class="text-xl font-semibold text-white">${currentUser.username}</h3>
                    <p class="text-gray-400 text-base">${t('home.memberSince')} ${new Date(currentUser.created_at).toLocaleDateString()}</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="text-green-400 text-base">🟢 ${t('home.online')}</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                <div class="bg-gray-700 rounded p-3">

                    <div class="text-xl font-bold text-green-400">${win}</div>
                    <div class="text-gray-300 text-sm">${t('home.wins')}</div>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-red-400">${losses}</div>
                    <div class="text-gray-300 text-sm">${t('home.losses')}</div>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-blue-400">${totalGames}</div>
                    <div class="text-gray-300 text-sm">${t('home.totalGames')}</div>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-xl font-bold text-purple-400">${winrate}%</div>
                    <div class="text-gray-300 text-sm">${t('home.winRate')}</div>
                </div>
            </div>
        </div>
    `;
}

function renderFriendsList(): string {
	if (isLoading) {
		return `
            <div class="bg-gray-800 rounded-lg p-6 h-full flex flex-col">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">👥 ${t('home.friends')}</h2>
                    <button id="add-friend-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        + ${t('home.addFriend')}
                    </button>
                </div>
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-gray-400 text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                        ${t('home.loadingFriends')}
                    </div>
                </div>
            </div>
        `;
	}

	if (friends.length == 0) {
		return `
            <div class="bg-gray-800 rounded-lg p-6 h-full flex flex-col">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">👥 ${t('home.friends')} (0)</h2>
                    <button id="add-friend-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        + ${t('home.addFriend')}
                    </button>
                </div>
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-gray-400 text-center">
                        <div class="text-4xl mb-2">👥</div>
                        <p>${t('home.noFriendsYet')}</p>
                        <p class="text-sm">${t('home.addSomeFriends')}</p>
                </div>
            </div>
        `;
	}

	console.log(friends);
	const friendsHtml = friends.map(friend => `
        <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer friend-item">
            <div class="flex items-center space-x-3">
                <img class="h-8 w-8" src=${friend.profilepicture ? friend.profilepicture : "https://www.gravatar.com/avatar/default?s=150&d=mp"}  />
                <div>
                    <div class="flex items-center space-x-4">
						<span class="font-semibold text-white text-base">${friend.username != null && friend.username.length > 10 ? friend.username.slice(0, 10) + '...' : friend.username}</span>
						<span class="text-green-400 text-base">🟢 ${t('home.online')}</span>
						<button class="delete-friend-btn bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors" data-email="${friend.email}"> ${t('home.removeFriend')} </button>
						</div>
                </div>
            </div>
        </div>
    `).join('');

	return `
        <div class="bg-gray-800 rounded-lg p-6 h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white">👥 ${t('home.friends')} (${friends.length})</h2>
                <button id="add-friend-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    + ${t('home.addFriend')}
                </button>
            </div>
            <div class="space-y-3 flex-1 overflow-y-auto">
                ${friendsHtml}
            </div>
        </div>
    `;
}


type Match = {
	player1: string,
	player2: string,
	player1_score: number,
	player2_score: number,
}

let data: Match[] = []
async function getMyGameHistory(): Promise<Match[]> {
	try {
		
		const response = await axios.post(`${TOURNAMENT_ADDRESS}/match/getAllMatches`, {}, {
			headers: {
				'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		});
		return data = response.data
	} catch (error) {
		console.error("Erreur dans getMyGameHistory:", error);

		// Si c’est une erreur d’authentification, on peut rediriger
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			// sessionStorage.removeItem("token");
			navigateTo("/login");
		}
	return [];
	}
}



async function getFilteredGames(): Promise<Match[]> {
	if (currentHistoryView === 'all') {
		return [];
	} else if (currentHistoryView === 'my-games') {
		return getMyGameHistory();
	} else {
		return []
	}
}

function getHistoryTitle(): string {
	// if (currentHistoryView === 'all') {
	// 	return '📊 All Match History';
	// } else if (currentHistoryView === 'my-games') {
	// 	return '📊 My Match History';
	// } else {
	// 	const friend = friends.find(f => f.user.name === selectedFriend);
	// 	return `📊 ${selectedFriend}'s Match History ${friend?.user.avatar || ''}`;
	// }
	return ""
}

function renderMatchHistory(): string {
    const filteredGames = getFilteredGames();
    const rowsHtml = data.map(game => {

        return `
            <tr class="hover:bg-gray-700 transition-colors">
                <td class="p-3 border-b border-gray-600 text-sm">
                    <span class="${game.player1 === currentUser.username ? 'font-bold text-blue-400' :
                game.player1 === selectedFriend ? 'font-bold text-purple-400' : ''
            }">${game.player1}</span>
                </td>
                <td class="p-3 border-b border-gray-600 text-center font-mono text-sm">${game.player1_score}</td>
                <td class="p-3 border-b border-gray-600 text-center text-gray-400 text-sm">vs</td>
                <td class="p-3 border-b border-gray-600 text-center font-mono text-sm">${game.player2_score}</td>
                <td class="p-3 border-b border-gray-600 text-sm">
                    <span class="${game.player2 === currentUser.name ? 'font-bold text-blue-400' :
                game.player2 === selectedFriend ? 'font-bold text-purple-400' : ''
            }">${game.player2}</span>
                </td>
				<td class="p-3 border-b border-gray-600 text-center font-mono text-sm">${game.player1_score > game.player2_score ? game.player1 : game.player2}</td>
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
                        ${t('home.myGames')}
                    </button>
                    <button onclick="switchHistoryView('all')" 
                            class="px-3 py-2 rounded text-sm transition-colors ${currentHistoryView === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
        }">
                        ${t('home.allGames')}
                    </button>
                    ${currentHistoryView !== 'my-games' && currentHistoryView !== 'all' ? `
                        <button onclick="switchHistoryView('my-games')" 
                                class="px-3 py-2 rounded text-sm bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors">
                            ${t('home.back')}
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="flex-1 overflow-auto">
                <table class="w-full border-collapse text-base">
                    <thead class="sticky top-0 bg-gray-700">
                        <tr>
                            <th class="p-3 text-left text-white font-semibold border-b border-gray-600">${t('home.player')} 1</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">${t('home.score')}</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600"></th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">${t('home.score')}</th>
                            <th class="p-3 text-left text-white font-semibold border-b border-gray-600">${t('home.player')} 2</th>
                            <th class="p-3 text-center text-white font-semibold border-b border-gray-600">${t('home.winner')}</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-300">
                        ${rowsHtml}
                        ${data.length === 0 ? `
                            <tr>
                                <td colspan="9" class="p-4 text-center text-gray-400">
                                    ${t('home.noGamesYet')}
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            <div class="mt-3 text-sm text-gray-400 text-center">
                ${t('home.showingGames')} ${data.length} game${data.length !== 1 ? 's' : ''}
            </div>
        </div>
    `;
}

export async function renderHome() {
	renderNavbar();

	// Charger l'utilisateur actuel et les amis en parallèle
	await Promise.all([
		getCurrentUser(),
		loadFriends(),
		getMyGameHistory()
	]);

	document.getElementById('app')!.innerHTML = `
        <div class="flex flex-col justify-center items-center -mt-20 h-screen overflow-hidden pt-15">
            <div class="w-full max-w-7xl mx-auto p-6 h-full flex flex-col">				
                <h1 class="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    🎮 ${t('home.gameDashboard')}
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
    
    // Listen for language changes and re-render
    i18n.addLanguageChangeListener(() => {
        if (location.pathname === '/') {
            renderHome();
        }
    });
}

async function refreshHomeDashboard() {
	// Recharger les données utilisateur
	await getCurrentUser();

	const mainContent = `
        <div class="flex flex-col justify-center items-center -mt-20 h-screen overflow-hidden pt-15">
            <div class="w-full max-w-7xl mx-auto p-6 h-full flex flex-col">
                <h1 class="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    🎮 ${t('home.gameDashboard')}
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

	// Event listeners for deleting friends
	const deleteFriendBtns = document.querySelectorAll('.delete-friend-btn');
	console.log(deleteFriendBtns)
	deleteFriendBtns.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const email = e.currentTarget.dataset.email;
			if (email && confirm(t('home.confirmRemoveFriend'))) {
				axios.post(
			`${TEST_ADDRESS}/friends/delete`,
				{email:email},
				{
					headers: {
						'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
						'Content-Type': 'application/json'
					}
				}
			)
			navigateTo("/")
			}
		});
	});

	const friendElements = document.querySelectorAll('.friend-item');
	friendElements.forEach(element => {
		element.addEventListener('click', () => {
			const friendName = element.querySelector('.font-semibold')?.textContent;
			if (friendName) {
				selectedFriend = friendName;
				currentHistoryView = 'friend';

				refreshHomeDashboard();
				setTimeout(() => {
					const historySection = document.querySelector('.bg-gray-800:last-child');
					if (historySection) {
						historySection.scrollIntoView({
							behavior: 'smooth',
							block: 'center'
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
				<h2 class="text-2xl font-bold text-white mb-6 text-center">👥 ${t('home.addNewFriend')}</h2>
				<form id="add-friend-form">
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-300 mb-2">${t('home.friendsName')}</label>
						<input 
							id="friend-name-input"
							type="text" 
							placeholder="${t('home.enterFriendEmail')}"
							class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						>
					</div>
					<div class="flex space-x-3">
						<button 
							type="submit"
							class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
						>
							${t('home.addFriend')}
						</button>
						<button 
							type="button"
							id="cancel-add-friend"
							class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
						>
							${t('common.cancel')}
						</button>
					</div>
				</form>
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
			const friendName = sanitizeHtml(friendNameInput.value.trim());
			if (friendName) {
				addFriendAPI(friendName);
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

function showMessage(message: string, type: 'success' | 'error' | 'warning') {

	const existingMessage = document.getElementById('status-message');
	if (existingMessage) {
		existingMessage.remove();
	}

	const messageDiv = document.createElement('div');
	messageDiv.id = 'status-message';
	messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-1002 transition-all duration-300 ${type === 'success' ? 'bg-green-600' :
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