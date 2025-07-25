import { renderNavbar } from '../componentes/navbar';

export function render404() {
	renderNavbar();
	document.getElementById('app')!.innerHTML = `
	<h1>404 not found</h1>
	`;
}