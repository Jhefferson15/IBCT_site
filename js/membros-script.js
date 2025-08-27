
document.addEventListener('DOMContentLoaded', () => {
    // A guarda de rota já rodou via script inline no HTML.
    // Se chegamos aqui, o usuário está autenticado.

    const memberData = IBCT_Backend.getMemberData();
    if (!memberData) {
        // Segurança extra: se os dados não puderem ser carregados, desloga.
        IBCT_Backend.logout();
        window.location.href = 'login.html';
        return;
    }

    const { profile, notices } = memberData;

    // 1. Renderiza o cabeçalho dinamicamente
    function renderHeader() {
        const header = document.querySelector('.header');
        header.innerHTML = `
            <div class="container">
                <a href="index.html" class="logo-link">
                    <div class="logo">
                        <img src="img/logo.png" alt="Logo IBCT" class="header-logo-img">
                        <span>Membros</span>
                    </div>
                </a>
                <nav class="nav-links">
                    <a href="index.html">Início</a>
                    <a href="missoes/missoes.html">Missões</a>
                    <a href="ibct_tv.html">IBCT TV</a>
                    <a href="sobre_ibct.html">Sobre</a>
                </nav>
                <div id="user-session-container">
                    <span class="welcome-link">Olá, ${profile.name.split(' ')[0]}</span>
                    <a id="logout-button" class="logout-button">Sair</a>
                </div>
            </div>`;
        
        document.getElementById('logout-button').addEventListener('click', () => {
            IBCT_Backend.logout();
            window.location.href = 'index.html';
        });
    }


    // 2. Preenche o conteúdo da página
    function populatePage() {
        document.getElementById('welcome-message').textContent = `Bem-vindo(a) de volta, ${profile.name}!`;

        const avisosContainer = document.getElementById('avisos-container');
        avisosContainer.innerHTML = notices.map(aviso => `
            <div class="aviso-item">${aviso}</div>
        `).join('');

        const perfilContainer = document.getElementById('perfil-container');
        perfilContainer.innerHTML = `
            <div class="perfil-item">
                <strong>Nome Completo</strong>
                <span>${profile.name}</span>
            </div>
            <div class="perfil-item">
                <strong>Ministérios</strong>
                <span>${profile.ministries.join(', ')}</span>
            </div>
            <div class="perfil-item">
                <strong>PGM</strong>
                <span>${profile.pgm}</span>
            </div>
        `;
    }

    renderHeader();
    populatePage();
});