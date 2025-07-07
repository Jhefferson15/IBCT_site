// js/tv-loader.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DO DOM ---
    const videoGrid = document.getElementById('video-grid');
    const filterContainer = document.getElementById('video-filters');
    const searchInput = document.getElementById('search-input');
    const galleryTitle = document.getElementById('gallery-title');
    const resultsSummary = document.getElementById('results-summary'); // NOVO: Elemento para o sumário
    
    const modalOverlay = document.getElementById('video-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalVideoContainer = document.getElementById('modal-video-player-container');

    let allVideos = [];
    const RESULTS_LIMIT = 25;

    // --- FUNÇÕES AUXILIARES ---

    const getYoutubeId = (url) => url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1] || null;

    const createVideoCard = (video) => {
        const videoId = getYoutubeId(video.url);
        if (!videoId) return '';
        
        const bestQualityThumb = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
        const highQualityThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const mediumQualityThumb = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

        const onErrorLogic = `this.onerror=null; this.src='${highQualityThumb}'; this.onerror=function(){this.onerror=null; this.src='${mediumQualityThumb}';};`;

        return `
            <div class="video-card fade-in">
                <a href="${video.url}" data-video-id="${videoId}" class="video-thumbnail">
                    <img src="${bestQualityThumb}" alt="${video.title}" loading="lazy" onerror="${onErrorLogic}">
                    <i class="fab fa-youtube"></i>
                </a>
                <div class="video-info"><h3>${video.title}</h3></div>
            </div>
        `;
    };

    const renderVideos = () => {
        const currentFilter = filterContainer.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();
        const keywords = { 'domingo': ['domingo', 'sunday'], 'quarta': ['quarta', 'wednesday'], 'ebd': ['ebd'] };

        let filteredByCategory = (currentFilter === 'all')
            ? allVideos
            : allVideos.filter(video => keywords[currentFilter].some(kw => video.title.toLowerCase().includes(kw)));
        
        let finalFiltered = searchTerm
            ? filteredByCategory.filter(video => video.title.toLowerCase().includes(searchTerm))
            : filteredByCategory;

        const totalFound = finalFiltered.length;
        const limitedResults = finalFiltered.slice(0, RESULTS_LIMIT);
        const showingCount = limitedResults.length;

        // ATUALIZAÇÃO: Lógica para o sumário de resultados
        if (totalFound > 0) {
            let summaryText = `Aproximadamente <strong>${totalFound}</strong> resultado(s) encontrado(s). Exibindo <strong>${showingCount}</strong>.`;
            if (totalFound > RESULTS_LIMIT) {
                summaryText += ` <span class="hidden-notice">(os mais antigos podem não estar listados)</span>`;
            }
            resultsSummary.innerHTML = summaryText;
            videoGrid.innerHTML = limitedResults.map(createVideoCard).join('');
        } else {
            resultsSummary.innerHTML = ''; // Limpa o sumário se não houver resultados
            videoGrid.innerHTML = '<p class="error-message">Nenhum vídeo encontrado com estes critérios.</p>';
        }
    };

    // --- LÓGICA DO MODAL ---
    
    const openModal = (videoId) => {
        modalVideoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            modalVideoContainer.innerHTML = '';
        }, 300);
    };

    videoGrid.addEventListener('click', (e) => {
        const videoLink = e.target.closest('.video-thumbnail');
        if (videoLink) {
            e.preventDefault();
            const videoId = videoLink.dataset.videoId;
            openModal(videoId);
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);

    // ALTERAÇÃO: A linha abaixo foi comentada para que o modal não feche ao clicar fora.
    /*
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    */
    
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- LÓGICA PRINCIPAL E EVENTOS ---

    const setupEventListeners = () => {
        filterContainer.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.filter-btn');
            if (!clickedButton) return;
            filterContainer.querySelector('.filter-btn.active').classList.remove('active');
            clickedButton.classList.add('active');
            galleryTitle.textContent = `Exibindo: ${clickedButton.textContent}`;
            renderVideos();
        });

        searchInput.addEventListener('input', renderVideos);
    };

    const loadVideos = async () => {
        try {
            const response = await fetch('./src/dados_completos.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allVideos = await response.json();
            renderVideos();
            setupEventListeners();
        } catch (error) {
            console.error('Falha ao carregar o arquivo de vídeos:', error);
            videoGrid.innerHTML = '<p class="error-message">Não foi possível carregar os vídeos. Por favor, tente novamente mais tarde.</p>';
        }
    };

    loadVideos();

    // --- UI GERAL (Menu, Scroll to Top) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
        if (!document.body.classList.contains('modal-open')) {
             document.body.classList.toggle('modal-open', navLinks.classList.contains('active'));
        }
    });

    window.addEventListener('scroll', () => scrollToTopBtn?.classList.toggle('visible', window.scrollY > 400));
    scrollToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});