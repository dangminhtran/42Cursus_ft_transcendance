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
        this.initPageContent(page);
    }

    initPageContent(page) {
        switch (page) {
            case 'contact':
                this.initContactForm();
                break;
            case 'data':
                this.initDataPage();
                break;
        }
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            alert(`Thank you ${data.name}! Your message has been sent.`);
            form.reset();
        });
    }

    initDataPage() {
        const loadButton = document.getElementById('loadData');
        const container = document.getElementById('dataContainer');

        loadButton.addEventListener('click', async () => {
            container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading users...</div>';

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Generate mock data
                const users = this.generateMockUsers(3);
                this.displayUsers(users);
            } catch (error) {
                container.innerHTML = '<div class="api-data">Error loading data. Please try again.</div>';
            }
        });
    }

    generateMockUsers(count) {
        const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis'];
        const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Consultant'];

        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            name: names[Math.floor(Math.random() * names.length)],
            role: roles[Math.floor(Math.random() * roles.length)],
            email: `user${i + 1}@example.com`
        }));
    }

    displayUsers(users) {
        const container = document.getElementById('dataContainer');
        const html = users.map(user => `
            <div class="api-data">
                <strong>${user.name}</strong><br>
                Role: ${user.role}<br>
                Email: ${user.email}
            </div>
        `).join('');

        container.innerHTML = html;
    }
}

// Initialize the SPA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SPARouter();
});

// Optional: Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to cards
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
});