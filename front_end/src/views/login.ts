import axios from "axios";
import { navigateTo } from "../router";
import { BASE_ADDRESS } from "../config";
import sanitizeHtml from 'sanitize-html';

let isLoginMode = true;

export function renderLogin() {
	const token: string | null = window.sessionStorage.getItem('token');
	if (token)
		return navigateTo("/");
	document.getElementById('navbar')!.innerHTML = "";

    document.getElementById('app')!.innerHTML = `
    	<div class="flex flex-col -mt-60 justify-center" id="authContainer">
		<div class="flex justify-center text-white text-8xl mb-20 font-bold" id="authTitle">LOG IN</div>
		<div class="card">
			<div class="flex rounded-sm p-4 mb-4 w-full m-w-300" id="auth-toggle">
				<button class=" toggle-btn active" id="loginToggle">Log In</button>
				<button class="toggle-btn" id="signupToggle">Sign Up</button>
			</div>

			<div class="w-full flex flex-col items-center" id="authForm">
				<p class="font-bold text-lg mb-5" id="authDescription">Sign in with email address</p>
				<input class="w-80 p-3 m-4 bg-indigo-950 text-md font-normal rounded-md border border-slate-700" type="email" id="email" placeholder="Yourname@gmail.com" />
				<input class="w-80 p-3 m-4 bg-indigo-950 text-md font-normal rounded-md border border-slate-700 signup-only" type="text" id="username" placeholder="Your username" style="display: none;" />
				<input class="w-80 p-3 m-4 bg-indigo-950 text-md font-normal rounded-md border border-slate-700" type="password" id="password" placeholder="Your password" />
				<button id="authBtn">Log In</button>
				</div>
			</div>
		</div>
	</div>
    `
	initializeAuthToggle();
	initializeAuthHandlers();
}

function initializeAuthToggle() {
	const loginToggle = document.getElementById('loginToggle');
	const signupToggle = document.getElementById('signupToggle');
	const authTitle = document.getElementById('authTitle');
	const authDescription = document.getElementById('authDescription');
	const authBtn = document.getElementById('authBtn');
	const signupFields = document.querySelectorAll('.signup-only');

	function switchToLogin() {
		isLoginMode = true;
		
		loginToggle?.classList.add('active');
		signupToggle?.classList.remove('active');
		
		if (authTitle) authTitle.textContent = 'LOG IN';
		if (authDescription) authDescription.textContent = 'Sign in with email address';
		if (authBtn) authBtn.textContent = 'Log In';
		
		signupFields.forEach((field: Element) => {
			const htmlField = field as HTMLElement;
			htmlField.style.display = 'none';
			if (field instanceof HTMLInputElement) {
				field.required = false;
			}
		});
	}

	function switchToSignup() {
		isLoginMode = false;
		
		loginToggle?.classList.remove('active');
		signupToggle?.classList.add('active');
		
		if (authTitle) authTitle.textContent = 'SIGN UP';
		if (authDescription) authDescription.textContent = 'Create your account';
		if (authBtn) authBtn.textContent = 'Sign Up';
		
		signupFields.forEach((field: Element) => {
			const htmlField = field as HTMLElement;
			htmlField.style.display = 'block';
			if (field instanceof HTMLInputElement) {
				field.required = true;
			}
		});
	}

	loginToggle?.addEventListener('click', switchToLogin);
	signupToggle?.addEventListener('click', switchToSignup);
}

function initializeAuthHandlers() {

	document.getElementById('authBtn')?.addEventListener('click', async () => {
		const email = sanitizeHtml((document.getElementById('email') as HTMLInputElement)?.value);
		const username = sanitizeHtml((document.getElementById('username') as HTMLInputElement)?.value);
		const password = sanitizeHtml((document.getElementById('password') as HTMLInputElement)?.value);

		// ecris regex pour valider l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert('Please enter a valid email address');
			return;
		}

		if (isLoginMode) {
			if (!email || !password) {
				alert('Please fill in both email and password');
				return;
			}

			const loginSuccessful = await Login(email, password);
			if (loginSuccessful) {
				navigateTo("/");
			} else {
				alert('Login failed. Please try again.');
			}

		} else {
			if (!email || !password || !username) {
				alert('Please fill in all fields');
				return;
			}

			const signupSuccessful = await SignUp(email, password, username);
			if (signupSuccessful) {
				alert('Account created successfully! Please sign in.');
				document.getElementById('loginToggle')?.click();
			} else {
				alert('Sign up failed. Please try again.');
			}

			document.getElementById('loginToggle')?.click();
		}
	});

	// Gestion de la touche Entree
	document.addEventListener('keypress', (e) => {
		if (e.key === 'Enter' && document.getElementById('authContainer')?.style.display !== 'none') {
			document.getElementById('authBtn')?.click();
		}
	});
}

async function SignUp(email: string, password: string, username: string): Promise<boolean> {
	if (!email || !password) return false;

	try {
		const response = await axios.post(`${BASE_ADDRESS}/auth/register`, {
			email,
			username,
			password,
		});
		const token = response.data?.token;
		if (token) {
			window.sessionStorage.setItem("token", token);
			return true;
		}
		return false;
	} catch (err) {
		console.error("Signup failed:", err);
		return false;
	}
}

async function Login(email: string, password: string): Promise<boolean> {
	if (!email || !password) {
		alert("Email and password are required.");
		return false;
	}

	try {
		const response = await axios.post(`${BASE_ADDRESS}/auth/login`, {
			email,
			password
		});

		const twoFARequired = response.data?.twoFARequired;
		
		if (twoFARequired) {
			const twoFACode = await show2FAModal();
			
			if (!twoFACode) {
				alert("2FA code is required.");
				return false;
			}

			try {
				const twoFAResponse = await axios.post(`${BASE_ADDRESS}/2fa/login`, {
					userid: response.data.userId,
					token: twoFACode
				});

				if (twoFAResponse.data?.error) {
					alert(`2FA Error: ${twoFAResponse.data.error}`);
					return false;
				}

				const token = twoFAResponse.data?.token;
				if (!token) {
					alert("2FA verification failed. No token received.");
					return false;
				}

				window.sessionStorage.setItem("token", token);
				return true;

			} catch (twoFAError) {
				console.error("2FA verification failed:", twoFAError);
				alert("2FA verification failed. Please try again.");
				return false;
			}
		}

		// Login sans 2FA
		const token = response.data?.token;
		if (!token) {
			alert("Login failed. No token received.");
			return false;
		}

		window.sessionStorage.setItem("token", token);
		return true;

	} catch (err: any) {
		if (err.response?.status === 401) {
			alert("Invalid email or password.");
		} else if (err.response?.status === 429) {
			alert("Too many login attempts. Please try again later.");
		} else if (err.response?.data?.error) {
			alert(`Login failed: ${err.response.data.error}`);
		} else {
			alert("Login failed. Please check your connection and try again.");
		}
		
		return false;
	}
//	return true
}


function show2FAModal(): Promise<string | null> {
	return new Promise((resolve) => {
		const existingModal = document.getElementById('login-2fa-modal');
		if (existingModal) {
			existingModal.remove();
		}

		const modal = document.createElement('div');
		modal.id = 'login-2fa-modal';
		modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
		
		modal.innerHTML = `
			<div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
				<div class="text-center">
					<h2 class="text-2xl font-bold mb-4 text-gray-800">2FA Verification</h2>
					<p class="text-gray-600 mb-4">Enter the 6-digit code from your authenticator app:</p>
					
					<div class="mb-6">
						<input 
							type="text" 
							id="login-2fa-code" 
							placeholder="123456"
							maxlength="6"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
						/>
					</div>
					
					<div class="flex gap-3">
						<button 
							id="verify-login-2fa-btn" 
							class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
						>
							Verify
						</button>
						<button 
							id="cancel-login-2fa-btn" 
							class="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		`;
		
		document.body.appendChild(modal);
		
		const verifyBtn = document.getElementById('verify-login-2fa-btn');
		const cancelBtn = document.getElementById('cancel-login-2fa-btn');
		const codeInput = document.getElementById('login-2fa-code') as HTMLInputElement;
		
		const cleanup = () => {
			modal.remove();
		};
		
		verifyBtn?.addEventListener('click', () => {
			const code = sanitizeHtml(codeInput.value.trim());
			if (!code || code.length !== 6) {
				alert('Please enter a valid 6-digit code');
				return;
			}
			cleanup();
			resolve(code);
		});
		
		cancelBtn?.addEventListener('click', () => {
			cleanup();
			resolve(null);
		});
		
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				cleanup();
				resolve(null);
			}
		});
		
		setTimeout(() => codeInput.focus(), 100);
	});
}