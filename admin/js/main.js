document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a.nav-link');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    // --- Roteamento e Carregamento de Página ---
    const loadContent = async (page) => {
        // Se a página for nula ou indefinida, carregue o dashboard
        if (!page) {
            page = 'dashboard';
        }

        const response = await fetch(`pages/${page}.html`);
        if (response.ok) {
            const content = await response.text();
            appContent.innerHTML = content;
            updateActiveLink(page);
        } else {
            appContent.innerHTML = `<p>Error loading page. Please try again.</p>`;
            console.error('Page not found:', page);
        }
    };

    const updateActiveLink = (page) => {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${page}`) {
                link.classList.add('active');
            }
        });
    };

    const router = () => {
        const page = location.hash.substring(1);
        loadContent(page);
    };

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);

    // --- Lógica do Menu Hamburger (Mobile) ---
    if (hamburgerBtn && sidebar && overlay) {
        const openSidebar = () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        };

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        };

        // Modificado para delegar o evento ao container principal
        appContent.addEventListener('click', (e) => {
            if (e.target.closest('#hamburger-btn')) {
                 e.stopPropagation();
                 sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
            }
        });

        overlay.addEventListener('click', closeSidebar);

        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    closeSidebar();
                }
            });
        });
    }
});