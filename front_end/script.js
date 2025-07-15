class SPARouter {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;

				const token = window.localStorage.getItem("token");
				if (token)
					document.getElementById("nav-link-logout").classList.remove('nodisplay');
				// TODO: check if token is valid with API call
				if (token && page == "log_in")
					 this.navigate("home");
				else
					this.navigate(page);
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.navigate(page, false);
        });

        // Set initial state
        history.replaceState({ page: 'home' }, '', '#home');
    }

    navigate(page, pushState = true) {
		const token = window.localStorage.getItem("token");
		if (!token && (page == "pong" || page == "game2"))
		{
			page = "log_in";
		}

		if (page == "logout" && token)
		{
			window.localStorage.removeItem("token");
			page = "home";
			document.getElementById("nav-link-logout").classList.add('nodisplay');
			document.getElementById("nav-link-login").classList.remove('nodisplay');
		}
        // Hide current page
        document.querySelector('.page.active').classList.remove('active');
        document.querySelector('.nav-link.active').classList.remove('active');

        // Show new page
        document.getElementById(page).classList.add('active');
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update browser history
        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }

        this.currentPage = page;

        // Page-specific initialization
        // this.initPageContent(page);
    }
}

// Initialize the SPA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new SPARouter();

	if (window.localStorage.getItem("token"))
	{
		document.getElementById("nav-link-logout").classList.remove('nodisplay');
		document.getElementById("nav-link-login").classList.add('nodisplay');
	}

	document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add loading state simulation
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.id === 'loadData') return; // Skip for data loading button

            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.style.opacity = '0.7';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 1000);
        });
    });

	document.querySelector("#loginForm").addEventListener("submit", function (e) {
		e.preventDefault();
		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;

		// TODO: connect with back end
		const token = email + password;
		window.localStorage.setItem("token", token);
		document.querySelector("#nav-link-logout").classList.remove('nodisplay');
		document.getElementById("nav-link-login").classList.add('nodisplay');
		window.router.navigate("home");
	})
});

