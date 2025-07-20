import axios from "axios";
import { PongGame } from "./pong";
import { BASE_ADDRESS } from "./config";

/* VARIABLES GLOBALES */
let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
	initializeAuthToggle();
	initializeAuthHandlers();
	initializeBackButton();
});

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
		
		if (authTitle) authTitle.textContent = 'SIGN IN';
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
				startPongGame();
			} else {
				alert('Login failed. Please try again.');
			}
		} else {
      // Pour le sign in
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
		startPongGame();
	});

	// Gestion de la touche Entree
	document.addEventListener('keypress', (e) => {
		if (e.key === 'Enter' && document.getElementById('authContainer')?.style.display !== 'none') {
			document.getElementById('authBtn')?.click();
		}
	});
}

function initializeBackButton() {
	document.getElementById('backBtn')?.addEventListener('click', () => {
		document.getElementById('gameContainer')!.style.display = 'none';
		document.getElementById('authContainer')!.style.display = 'flex';

		if ((window as any).currentGame) {
			(window as any).currentGame.dispose();
			(window as any).currentGame = null;
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

function startPongGame() {
	document.getElementById('authContainer')!.style.display = 'none';
	document.getElementById('gameContainer')!.style.display = 'block';

	const game = new PongGame();
	game.setupChat();
	(window as any).currentGame = game;
}
