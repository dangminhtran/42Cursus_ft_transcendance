import { registerRoute, renderRoute } from './router';
import { renderHome } from './views/home';
import { renderPong } from './views/pong';
import { renderTron } from './views/tron';
import { renderLogin } from './views/login';
import { renderProfile } from './views/profile';
import axios from 'axios';
import { BASE_ADDRESS } from './config';

registerRoute('/', renderHome);
registerRoute('/login', renderLogin);
registerRoute('/pong', renderPong);
registerRoute('/tron', renderTron);
registerRoute('/profile', renderProfile);


document.addEventListener('DOMContentLoaded', () => {
	const token: string | null = window.sessionStorage.getItem('token');
	if (token)
	{
		axios.post(`${BASE_ADDRESS}/auth/verify-jwt`, {}, {
				headers: {
					'Authorization': `Bearer ${window.sessionStorage.getItem("token")}`
				}
			}).then(response => {
				if (response.status === 200) {		
					renderRoute();
				} else {
					window.sessionStorage.removeItem("token");
					renderLogin();
				}
			}).catch(error => {
				window.sessionStorage.removeItem("token");
				renderLogin();
			});

	}
	else
	{
		renderLogin();
	}
})
