import { navigateTo } from "../router";
import { clearPongGame } from "../state";
import { clearTronGame } from "../state";

export function renderNavbar() {
	document.getElementById('navbar')!.innerHTML = `
	<nav>
		<ul>
			<li><a class="nav-navlink" href="/">Home</a></li>
			<li><a class="nav-navlink" href="/pong">Pong</a></li>
			<li><a class="nav-navlink" href="/tron">Tron</a></li>
			<li><a class="nav-navlink" href="/chat">Chat</a></li>
			<li><a class="nav-navlink" href="/profile">Profile</a></li>
			${window.sessionStorage.getItem('token') ? '<li id="disconnect-navlink"><a class="nav-navlink" href="#">Disconnect</a></li>' : ""}
		</ul>
	</nav>
	`;

	const navlinks = document.querySelectorAll<HTMLAnchorElement>(".nav-navlink");
	navlinks.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
			// clearGame
				clearPongGame();
				clearTronGame();
			navigateTo(link.getAttribute("href")!);
		});
	});

	const disconnect = document.querySelector("#disconnect-navlink");
	disconnect?.addEventListener("click", e => {
		e.preventDefault();
		window.sessionStorage.removeItem('token');
		navigateTo("/login");
	})
	
}