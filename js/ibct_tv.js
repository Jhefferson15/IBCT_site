
// js/ibct_tv.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VERIFICAÇÃO INICIAL DE ELEMENTOS ---
    const elements = {
        videoGrid: document.getElementById('video-grid'),
        resultsSummary: document.getElementById('results-summary'),
        searchInput: document.getElementById('search-input'),
        modalOverlay: document.getElementById('video-modal-overlay'),
        modalPlayerContainer: document.getElementById('modal-video-player-container'),
        modalCloseBtn: document.getElementById('modal-close-btn')
    };

    if (!elements.videoGrid) {
        console.error('ERRO CRÍTICO: O elemento #video-grid não foi encontrado no HTML.');
        return;
    }

    let allVideos = [];

    // --- 2. LÓGICA DE CARREGAMENTO DE VÍDEOS ---
    async function loadVideos() {
        try {
            const response = await fetch('./src/dados_IBCT_tv.json?v=' + new Date().getTime()); // Cache busting
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();

            if (!data.videosByYearMonth) throw new Error('O arquivo JSON não contém a estrutura esperada.');

            allVideos = Object.values(data.videosByYearMonth)
                .flatMap(months => Object.values(months))
                .flatMap(videosInMonth => videosInMonth)
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

            displayVideos(allVideos);

        } catch (error) {
            console.error('Erro ao carregar e processar vídeos:', error);
            elements.videoGrid.innerHTML = '<p class="error-message">Não foi possível carregar os vídeos.</p>';
        }
    }

    // --- 3. LÓGICA DE EXIBIÇÃO ---
    function displayVideos(videos) {
        elements.videoGrid.innerHTML = '';
        
        if (videos.length === 0) {
            elements.videoGrid.innerHTML = '<p>Nenhum vídeo corresponde aos critérios.</p>';
            if (elements.resultsSummary) elements.resultsSummary.textContent = '0 vídeos encontrados';
            return;
        }

        videos.forEach(video => {
            const thumbnails = video.thumbnails || {};
            const thumbnailUrl = (thumbnails.high || thumbnails.medium || thumbnails.default)?.url;

            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            
            // Estrutura HTML corrigida para corresponder ao CSS
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${video.title}" loading="lazy">` : ''}
                    <div class="play-icon"><i class="fas fa-play"></i></div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                </div>
            `;
            
            videoCard.addEventListener('click', () => openModal(video.id));
            elements.videoGrid.appendChild(videoCard);
        });

        if (elements.resultsSummary) elements.resultsSummary.textContent = `Mostrando ${videos.length} vídeo(s).`;
    }

    // --- 4. LÓGICA DO MODAL DE VÍDEO ---
    function openModal(videoId) {
        if (!elements.modalOverlay || !elements.modalPlayerContainer) {
            console.error('Elementos do modal não encontrados.');
            return;
        }
        elements.modalPlayerContainer.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        
        // CORREÇÃO: Usar a classe .active que o CSS espera, em vez de .visible
        elements.modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        if (!elements.modalOverlay) return;
        // CORREÇÃO: Usar a classe .active que o CSS espera, em vez de .visible
        elements.modalOverlay.classList.remove('active');
        if (elements.modalPlayerContainer) elements.modalPlayerContainer.innerHTML = '';
        document.body.classList.remove('modal-open');
    }

    if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeModal);
    if (elements.modalOverlay) elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) closeModal();
    });

    // --- 5. LÓGICA DE BUSCA ---
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredVideos = allVideos.filter(video => 
                video.title.toLowerCase().includes(searchTerm)
            );
            displayVideos(filteredVideos);
        });
    }

    // --- INICIALIZAÇÃO ---
    loadVideos();
});
