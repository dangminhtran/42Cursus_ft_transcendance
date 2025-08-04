import { navigateTo } from "../router";
import { clearPongGame } from "../state";
import { clearTronGame } from "../state";
import { i18n, t } from "../i18n";
import type { Language } from "../i18n";
import { Quaternion } from "@babylonjs/core";

function getFlagEmoji(language: Language): string {
	const flags = {
		en: '🇺🇸',
		fr: '🇫🇷',
		es: '🇪🇸'
	};
	return flags[language] || '🌍';
}

function setupLanguageSwitcher(): void {
	const dropdownBtn = document.getElementById('languageDropdownBtn');
	const dropdown = document.getElementById('languageDropdown');
	const arrow = document.getElementById('languageArrow');
	
	if (!dropdownBtn || !dropdown || !arrow) return;

	// Toggle dropdown
	dropdownBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		const isHidden = dropdown.classList.contains('hidden');
		
		if (isHidden) {
			dropdown.classList.remove('hidden');
			arrow.style.transform = 'rotate(180deg)';
		} else {
			dropdown.classList.add('hidden');
			arrow.style.transform = 'rotate(0deg)';
		}
	});

	// Close dropdown when clicking outside
	document.addEventListener('click', () => {
		dropdown.classList.add('hidden');
		arrow.style.transform = 'rotate(0deg)';
	});

	// Handle language selection
	const languageOptions = document.querySelectorAll('.language-option');
	languageOptions.forEach(option => {
		option.addEventListener('click', (e) => {
			e.stopPropagation();
			const lang = (e.currentTarget as HTMLElement).getAttribute('data-lang') as Language;
			if (lang) {
				i18n.setLanguage(lang);
				// Re-render navbar to reflect changes
				renderNavbar();
				// Trigger re-render of current page
				window.dispatchEvent(new CustomEvent('languageChanged'));
			}
		});
	});
}

export function renderNavbar() {
	const currentLanguage = i18n.getCurrentLanguage();
	const availableLanguages = i18n.getAvailableLanguages();
	
	document.getElementById('navbar')!.innerHTML = `
	<nav class=navHeader>
		<ul class="w-screen h-full flex gap-5 justify-center items-center">
			<li class="buttonNavStyle"><a class="nav-navlink" href="/">${t('nav.home')}</a></li>
			<li class="buttonNavStyle"><a class="nav-navlink" href="/pong">${t('nav.pong')}</a></li>
			<li class="buttonNavStyle"><a class="nav-navlink" href="/tron">${t('nav.tron')}</a></li>
			<li class="buttonNavStyle"><a class="nav-navlink" href="/profile">${t('nav.profile')}</a></li>
			<li class="relative languageSelector">
				<button class="buttonNavStyle languageButton flex items-center gap-2" id="languageDropdownBtn">
					<span class="language-flag">${getFlagEmoji(currentLanguage)}</span>
					<span class="language-name">${t(`languages.${currentLanguage}`)}</span>
					<svg class="w-4 h-4 transition-transform" id="languageArrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				<div class="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg hidden z-50 min-w-32" id="languageDropdown">
					${availableLanguages.map(lang => `
						<button class="language-option block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2 ${lang.code === currentLanguage ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}" data-lang="${lang.code}">
							<span class="language-flag">${getFlagEmoji(lang.code)}</span>
							<span>${lang.name}</span>
							${lang.code === currentLanguage ? '<span class="ml-auto">✓</span>' : ''}
						</button>
					`).join('')}
				</div>
			</li>
			${window.sessionStorage.getItem('token') ? `<li class="buttonNavStyle" id="disconnect-navlink"><a class="nav-navlink" href="#">${t('nav.disconnect')}</a></li>` : ""}
		</ul>
	</nav>
	`;

	const navlinks = document.querySelectorAll<HTMLAnchorElement>(".nav-navlink");
	navlinks.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
				clearPongGame();
				clearTronGame();
			navigateTo(link.getAttribute("href")!);
		});
	});

	const disconnect = document.querySelector("#disconnect-navlink");
	disconnect?.addEventListener("click", e => {
		e.preventDefault();
		window.sessionStorage.removeItem('token');
		console.log("disconnect") // la


		navigateTo("/login"); // / login et pas /
	});

	// Language switcher functionality
	setupLanguageSwitcher();
}