import { renderNavbar } from "../componentes/navbar";

export function renderProfile() {
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
			
			<div class="flex justify-center items-center gap-2 w-full max-w-md">
				<label for="2fa" class="text-white font-semibold">Enable 2FA:</label>
				<input 
					class="rounded-sm bg-indigo-950 text-lg text-white border border-teal-50 ease-in-out" 
					type="checkbox" 
					name="2fa" 
					id="2fa"
				>
			</div>
			
			<button 
				id="saveChangesBtn"
				class="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg mt-4"
			>
				Save Changes
			</button>
		</div>
	`;

	setupEventListeners();
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
		const email = (document.getElementById("emailInput") as HTMLInputElement)?.value || '';
		const oldPassword = (document.getElementById("oldPassword") as HTMLInputElement)?.value || '';
		const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value || '';
		const twofa = (document.getElementById("2fa") as HTMLInputElement)?.checked || false;
		const profilePicture = (document.getElementById("pictureInput") as HTMLInputElement)?.value || '';
		
		if (profilePicture && !isValidUrl(profilePicture)) {
			alert('Please enter a valid image URL');
			return;
		}

		const json = JSON.stringify({email, oldPassword, newPassword, twofa, profilePicture});
		console.log(json);
		
		// TODO: Send to backend
		alert('Profile updated successfully!');
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