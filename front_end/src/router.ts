import { render404 } from "./views/404";

type RouteHandler = () => void;
const routes: Record<string, RouteHandler> = {};

export function registerRoute(path: string, handler: RouteHandler) {
    routes[path] = handler;
}

export function navigateTo(path: string) {
    history.pushState({}, '', path);
    renderRoute();
}

export function renderRoute() {
    const handler = routes[location.pathname];
    if (handler) handler();
    else renderNotFound();
}

function renderNotFound() {
    render404();
}

window.addEventListener('popstate', renderRoute);