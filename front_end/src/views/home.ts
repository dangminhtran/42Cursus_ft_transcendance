import { renderNavbar } from '../componentes/navbar';

export function renderHome() {
	renderNavbar();
	document.getElementById('app')!.innerHTML = `
	<h1>Bienvenue sur Pong</h1>
	<p>Bienvenue sur le projet ft_transcendence !</p>
	<a href="/pong" data-link>Jouer</a>
	<button id="test">click me</button>
	`;

	const btn = document.getElementById("test");
	btn?.addEventListener('click', () => {
		console.log("clicked")}
	);
}