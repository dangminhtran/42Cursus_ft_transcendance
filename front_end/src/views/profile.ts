import { renderNavbar } from "../componentes/navbar";
import axios from "axios";
import { navigateTo } from "../router";
import { BASE_ADDRESS, TEST_ADDRESS } from "../config";

export async function renderProfile() {
	renderNavbar();
	document.getElementById('app')!.innerHTML = `
		<div class="bg-emerald-900 border border-white flex flex-col justify-center items-center gap-5 -mt-20 text-md text-indigo-950 rounded-xl p-10">
			<div class="text-lg text-white text-xl font-semibold">Change your information here</div>	
		
			<!-- Avatar Preview Section -->
			<div class="flex flex-col items-center gap-4 mb-6">
				<div class="text-white font-medium">Profile Picture Preview</div>
				<div class="relative">
					<img 
						id="avatarPreview" 
						src="https://www.gravatar.com/avatar/default?s=150&d=mp"
						alt="Avatar Preview" 
						class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
						onerror="this.src='https://via.placeholder.com/150/4338ca/ffffff?text=No+Image'"
					>
					<div class="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Avatar loaded successfully" id="avatarStatus"></div>
				</div>
			</div>

			<div class="flex flex-col justify-center gap-2 w-full max-w-md">
				<label for="pictureInput" class="text-white font-semibold">Profile picture URL:</label>
				<input 
					class="rounded-sm bg-indigo-950 text-lg text-white border border-teal-50 ease-in-out p-2" 
					type="url" 
					name="pictureInput" 
					id="pictureInput"
					placeholder="https://example.com/your-image.jpg"
				>
				<button 
					id="previewBtn" 
					class="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
				>
					Preview Image
				</button>
			</div>

			<div class="flex flex-col justify-center gap-2 w-full max-w-md">
				<label for="usernameInput" class="text-white font-semibold">Username:</label>
				<input 
					class="rounded-sm bg-indigo-950 text-lg text-white border border-teal-50 ease-in-out p-2" 
					type="text" 
					name="usernameInput" 
					id="usernameInput"
				>
			</div>

			<div class="flex flex-col justify-center gap-2 w-full max-w-md">
				<label for="emailInput" class="text-white font-semibold">Email:</label>
				<input 
					class="rounded-sm bg-indigo-950 text-lg text-white border border-teal-50 ease-in-out p-2" 
					type="email" 
					name="emailInput" 
					id="emailInput"
				>
			</div>
			
			<div class="flex flex-col justify-center gap-2 w-full max-w-md">
				<label for="oldPassword" class="text-white font-semibold">Old password:</label>
				<input 
					class="rounded-sm bg-indigo-950 text-lg text-white border border-teal-50 ease-in-out p-2" 
					type="password" 
					name="oldPassword" 
					id="oldPassword"
				>
			</div>
			
			<div class="flex flex-col justify-center gap-2 w-full max-w-md">
				<label for="newPassword" class="text-white font-semibold">New password:</label>
				<input 
					class="rounded-sm bg-indigo-950 text-lg text-white border border-teal-50 ease-in-out p-2" 
					type="password" 
					name="newPassword" 
					id="newPassword"
				>
			</div>
			
			<button 
				id="enable2FABtn">
				Enable 2FA
			</button>
			
			<button 
				id="saveChangesBtn">
				Save Changes
			</button>
		</div>
	`;

	setupEventListeners();
	enable2Fa();
}


function setupEventListeners() {
	const saveBtn = document.getElementById("saveChangesBtn");
	const previewBtn = document.getElementById("previewBtn");
	const pictureInput = document.getElementById("pictureInput") as HTMLInputElement;

	previewBtn?.addEventListener('click', () => {
		previewAvatar();
	});

	pictureInput?.addEventListener('input', () => {
		const url = pictureInput.value.trim();
		if (url && isValidUrl(url)) {
			previewAvatar();
		}
	});

	saveBtn?.addEventListener('click', () => {
		const username = (document.getElementById("usernameInput") as HTMLInputElement)?.value || '';
		const email = (document.getElementById("emailInput") as HTMLInputElement)?.value || '';
		const oldPassword = (document.getElementById("oldPassword") as HTMLInputElement)?.value || '';
		const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value || '';
		const twofa = (document.getElementById("2fa") as HTMLInputElement)?.checked || false;
		const profilepicture = (document.getElementById("pictureInput") as HTMLInputElement)?.value || '';

		if (profilepicture && !isValidUrl(profilepicture)) {
			alert('Please enter a valid image URL');
			return;
		}

		console.log('profile picture dans le front', profilepicture)
		//const json = JSON.stringify({ username, profilepicture, email, oldPassword, newPassword, twofa })
		const data = { username, profilepicture, email, oldPassword, newPassword, twofa}
		try {
			axios.post(`${TEST_ADDRESS}/user-management/update`, data, {
				headers: {
					'Authorization': `Bearer ${window.sessionStorage.getItem("token")}`
				}
			}).then(response => {
				if (response.status === 200) {
					alert('Profile updated successfully!')
					window.sessionStorage.removeItem('token')
					navigateTo('/login');
				} else {
					alert('Failed to update profile. Please try again.');
				}
			}).catch(error => {
				console.error('Error updating profile:', error);
				alert('An error occurred while updating your profile. Please try again.');
			});
		} catch (error) {
			console.error('Error in saveChanges:', error);
			alert('An unexpected error occurred. Please try again later.');
		}
	});
}

function previewAvatar() {
	const pictureInput = document.getElementById("pictureInput") as HTMLInputElement;
	const avatarPreview = document.getElementById("avatarPreview") as HTMLImageElement;
	const imageUrl = pictureInput?.value.trim();

	if (!imageUrl) {
		// Reset to default if empty
		avatarPreview.src = "https://via.placeholder.com/150/4338ca/ffffff?text=Avatar";
		updateAvatarStatus('default');
		return;
	}

	if (!isValidUrl(imageUrl)) {
		alert('Please enter a valid URL');
		updateAvatarStatus('error');
		return;
	}

	const testImage = new Image();

	testImage.onload = () => {
		avatarPreview.src = imageUrl;
		updateAvatarStatus('success');
	};

	testImage.onerror = () => {
		alert('Failed to load image. Please check the URL.');
		updateAvatarStatus('error');
	};

	updateAvatarStatus('loading');
	testImage.src = imageUrl;
}

function updateAvatarStatus(status: 'success' | 'error' | 'loading' | 'default') {
	const avatarStatus = document.getElementById("avatarStatus");
	if (!avatarStatus) return;

	switch (status) {
		case 'success':
			avatarStatus.className = "absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white";
			avatarStatus.title = "Avatar loaded successfully";
			break;
		case 'error':
			avatarStatus.className = "absolute bottom-0 right-0 bg-red-500 w-4 h-4 rounded-full border-2 border-white";
			avatarStatus.title = "Failed to load avatar";
			break;
		case 'loading':
			avatarStatus.className = "absolute bottom-0 right-0 bg-yellow-500 w-4 h-4 rounded-full border-2 border-white animate-pulse";
			avatarStatus.title = "Loading avatar...";
			break;
		case 'default':
			avatarStatus.className = "absolute bottom-0 right-0 bg-gray-500 w-4 h-4 rounded-full border-2 border-white";
			avatarStatus.title = "Default avatar";
			break;
	}
}

function isValidUrl(string: string): boolean {
	try {
		const url = new URL(string);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch (_) {
		return false;
	}
}

export function loadUserProfile(userData: any) {

	setTimeout(() => {
		const emailInput = document.getElementById("emailInput") as HTMLInputElement;
		const pictureInput = document.getElementById("pictureInput") as HTMLInputElement;
		const twofaInput = document.getElementById("2fa") as HTMLInputElement;

		if (emailInput && userData.email) {
			emailInput.value = userData.email;
		}

		if (pictureInput && userData.profilePicture) {
			pictureInput.value = userData.profilePicture;
			previewAvatar();
		}

		if (twofaInput && userData.twofa !== undefined) {
			twofaInput.checked = userData.twofa;
		}
	}, 100);
}

async function get2Fa(jwt: string) {
	try {
		const response = await axios.post(`${TEST_ADDRESS}/2fa/setup`, {}, {
			headers: { Authorization: `Bearer ${jwt}` }
		});
		console.log('2FA setup response:', response.data);

		if (response.data.qrCodeDataURL) {
			const qrCodeDataURL = response.data.qrCodeDataURL;
			create2FAModal(qrCodeDataURL, jwt);
		} else {
			alert('Failed to generate QR code. Please try again.');
		}
	} catch (error) {
		console.error('Error enabling 2FA:', error);
		alert('An error occurred while enabling 2FA. Please try again.');
	}
}

function create2FAModal(qrCodeDataURL: string, jwt: string) {
	const existingModal = document.getElementById('twofa-modal');
	if (existingModal) {
		existingModal.remove();
	}

	const modal = document.createElement('div');
	modal.id = 'twofa-modal';
	modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

	modal.innerHTML = `
		<div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
			<div class="text-center">
				<h2 class="text-2xl font-bold mb-4 text-gray-800">Setup 2FA</h2>
				<p class="text-gray-600 mb-4">Scan this QR code with your authenticator app:</p>
				
				<div class="mb-6">
					<img src="${qrCodeDataURL}" alt="2FA QR Code" class="mx-auto border rounded" />
				</div>
				
				<div class="mb-4">
					<label for="twofa-code" class="block text-gray-700 font-medium mb-2">
						Enter the 6-digit code from your app:
					</label>
					<input 
						type="text" 
						id="twofa-code" 
						placeholder="123456"
						maxlength="6"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				
				<div class="flex gap-3">
					<button 
						id="verify-2fa-btn" 
						class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
					>
						Verify & Enable
					</button>
					<button 
						id="cancel-2fa-btn" 
						class="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	`;

	document.body.appendChild(modal);

	const verifyBtn = document.getElementById('verify-2fa-btn');
	const cancelBtn = document.getElementById('cancel-2fa-btn');
	const codeInput = document.getElementById('twofa-code') as HTMLInputElement;

	verifyBtn?.addEventListener('click', async () => {
		const token = codeInput.value.trim();
		if (!token || token.length !== 6) {
			alert('Please enter a valid 6-digit code');
			return;
		}

		try {
			verifyBtn.textContent = 'Verifying...';
			verifyBtn.setAttribute('disabled', 'true');

			const verifyResponse = await axios.post(`${TEST_ADDRESS}/2fa/verify-setup`, {
				token,
			}, {
				headers: { Authorization: `Bearer ${jwt}` }
			});

			if (verifyResponse.data.success) {
				alert('2FA setup successful!');
				modal.remove();
				navigateTo('/');
			} else {
				alert('Invalid code. Please try again.');
				verifyBtn.textContent = 'Verify & Enable';
				verifyBtn.removeAttribute('disabled');
			}
		} catch (error) {
			console.error('Error verifying 2FA code:', error);
			alert('An error occurred while verifying the 2FA code. Please try again.');
			verifyBtn.textContent = 'Verify & Enable';
			verifyBtn.removeAttribute('disabled');
		}
	});

	cancelBtn?.addEventListener('click', () => {
		modal.remove();
		navigateTo('/profile');
	});

	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
			modal.remove();
		}
	});

	codeInput.focus();
}


function enable2Fa() {
	const twofaInput = document.getElementById("enable2FABtn") as HTMLInputElement;
	twofaInput.addEventListener('click', () => {
		const jwt = window.sessionStorage.getItem("token")
		if (!jwt) {
			alert('You must be logged in to enable 2FA.');
			return;
		}
		get2Fa(jwt);
	})
}