import { registerRoute, renderRoute } from './router';
import { renderHome } from './views/home';
import { renderPong } from './views/pong';
import { renderTron } from './views/tron';
import { renderLogin } from './views/login';
import { renderProfile } from './views/profile';

registerRoute('/', renderHome);
registerRoute('/login', renderLogin);
registerRoute('/pong', renderPong);
registerRoute('/tron', renderTron);
registerRoute('/profile', renderProfile);


document.addEventListener('DOMContentLoaded', () => {
	const token: string | null = window.sessionStorage.getItem('token');
	if (token)
		renderRoute();
	else
	{
		renderLogin();
	}
})
