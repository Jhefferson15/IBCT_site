document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (hamburgerBtn && sidebar && overlay) {
        // Função para abrir o menu
        const openSidebar = () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        };

        // Função para fechar o menu
        const closeSidebar = () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        };

        // Evento de clique no botão hamburger
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
        });

        // Evento de clique no overlay para fechar o menu
        overlay.addEventListener('click', closeSidebar);
    }
});