import axios from "axios";
import { navigateTo } from "../router";
import { BASE_ADDRESS } from "../config";

let isLoginMode = true;

export function renderLogin() {
	const token: string | null = window.sessionStorage.getItem('token');
	if (token)
		return navigateTo("/");
	document.getElementById('navbar')!.innerHTML = "";

    document.getElementById('app')!.innerHTML = `
    	<div class="container" id="authContainer">
		<h2 id="authTitle">LOG IN</h2>
		<div class="card">
			<div class="auth-toggle">
				<button class="toggle-btn active" id="loginToggle">Log In</button>
				<button class="toggle-btn" id="signupToggle">Sign Up</button>
			</div>

			<div class="auth-form" id="authForm">
				<p id="authDescription">Sign in with email address</p>
				<input type="email" id="email" placeholder="Yourname@gmail.com" />
				<input type="password" id="password" placeholder="YourPassword" />
				<button id="authBtn">Log In</button>

				<hr class="line" />
				<div class="google-signup">
					<p>or continue with</p>
					<button id="googleBtn">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4" />
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853" />
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05" />
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335" />
						</svg>
						Google</button>
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
		if (authDescription) authDescription.textContent = 'Log in with email address';
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
		const email = (document.getElementById('email') as HTMLInputElement)?.value;
		const password = (document.getElementById('password') as HTMLInputElement)?.value;

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
			if (!email || !password) {
				alert('Please fill in all fields');
				return;
			}

			const signupSuccessful = await SignUp(email, password);
			if (signupSuccessful) {
				alert('Account created successfully! Please sign in.');
				document.getElementById('loginToggle')?.click();
			} else {
				alert('Sign up failed. Please try again.');
			}
		}
	});


/* BOUTON GOOGLE */
	document.getElementById('googleBtn')?.addEventListener('click', () => {
		console.log('Google authentication');
		// Test Minh - SIMULATION
		navigateTo("/");
	});

	// Gestion de la touche Entree
	document.addEventListener('keypress', (e) => {
		if (e.key === 'Enter' && document.getElementById('authContainer')?.style.display !== 'none') {
			document.getElementById('authBtn')?.click();
		}
	});
}

async function SignUp(email: string, password: string): Promise<boolean> {
	if (!email || !password) return false;

	try {
		const response = await axios.post(`${BASE_ADDRESS}/auth/register`, {
			email,
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

async function Login(email: string, password: string) {
	if (!email || !password) return false;

	try {
		const response = await axios.post(`${BASE_ADDRESS}/auth/login`,
			{ email, password },
		);
		const token = response.data?.token;
		if (token) {
			window.sessionStorage.setItem("token", token);
			return true;
		}
		return false;
	} catch (err) {
		console.error("Login failed:", err);
		return false;
	}
}