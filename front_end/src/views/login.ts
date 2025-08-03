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
				<input class="w-80 p-3 m-4 bg-indigo-950 text-md font-normal rounded-md border border-slate-700" type="password" id="password" placeholder="YourPassword" />
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

			// const loginSuccessful = await Login(email, password);
			// if (loginSuccessful) {
			// 	navigateTo("/");
			// } else {
			// 	alert('Login failed. Please try again.');
			// }
				navigateTo("/");

		} else {
			if (!email || !password) {
				alert('Please fill in all fields');
				return;
			}

			// const signupSuccessful = await SignUp(email, password);
			// if (signupSuccessful) {
			// 	alert('Account created successfully! Please sign in.');
			// 	document.getElementById('loginToggle')?.click();
			// } else {
			// 	alert('Sign up failed. Please try again.');
			// }

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
	return true
}