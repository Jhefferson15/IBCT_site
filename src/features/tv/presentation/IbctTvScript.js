import { FirebaseVideoRepository } from '../infrastructure/FirebaseVideoRepository.js';
import { GetVideosUseCase } from '../domain/use_cases/GetVideosUseCase.js';
import { initSharedUI } from '../../../core/utils/SharedScript.js';

const videoRepo = new FirebaseVideoRepository();
const getVideosUseCase = new GetVideosUseCase(videoRepo);

let currentFilter = 'all';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();

    const videoGrid = document.getElementById('video-grid');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modalOverlay = document.getElementById('video-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const videoPlayerContainer = document.getElementById('modal-video-player-container');

    async function renderVideos() {
        if (!videoGrid) {
            console.error("ERRO: Elemento #video-grid não encontrado no DOM.");
            return;
        }
        
        try {
            videoGrid.innerHTML = '<p class="loading-message">Carregando vídeos...</p>';
            console.log(`Buscando vídeos com filtro: ${currentFilter}, busca: "${currentSearch}"`);
            
            const videos = await getVideosUseCase.execute(currentFilter, currentSearch);
            console.log(`Sucesso: ${videos.length} vídeos retornados do Firebase.`);

            if (videos.length === 0) {
                videoGrid.innerHTML = '<p class="loading-message">Nenhum vídeo encontrado para os filtros selecionados.</p>';
                return;
            }

        videoGrid.innerHTML = videos.map(video => `
            <div class="video-card" data-youtube-id="${video.youtubeId}">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg" alt="${video.title}">
                    <div class="play-overlay"><i class="fas fa-play"></i></div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description || ''}</p>
                    <span class="video-date">${video.date}</span>
                </div>
            </div>
        `).join('');

        // Adicionar eventos de clique nos cards
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                const youtubeId = card.dataset.youtubeId;
                openVideoModal(youtubeId);
            });
        });

        } catch (error) {
            console.error("ERRO CRÍTICO ao carregar vídeos:", error);
            let errorMessage = "Não foi possível carregar os vídeos.";
            
            if (error.message.includes("database (default) does not exist")) {
                errorMessage = "<strong>Banco de dados não encontrado.</strong><br>Por favor, crie a instância do Firestore no Console do Firebase.";
            } else if (error.code === "permission-denied") {
                errorMessage = "<strong>Acesso negado.</strong><br>Verifique as regras de segurança do Firestore.";
            }

            videoGrid.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 40px; background: rgba(255,0,0,0.1); border-radius: 12px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff4444; margin-bottom: 20px;"></i>
                    <p style="font-size: 18px; font-weight: bold;">${errorMessage}</p>
                    <small style="display: block; margin-top: 10px; opacity: 0.7;">Código do erro: ${error.code || 'desconhecido'}</small>
                </div>`;
        }
    }

    function openVideoModal(id) {
        if (!modalOverlay || !videoPlayerContainer) return;
        videoPlayerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${id}?autoplay=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        `;
        modalOverlay.style.display = 'flex';
        document.body.classList.add('modal-open');
    }

    function closeVideoModal() {
        if (!modalOverlay || !videoPlayerContainer) return;
        videoPlayerContainer.innerHTML = '';
        modalOverlay.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderVideos();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderVideos();
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeVideoModal();
        });
    }

    // Inicialização
    renderVideos();
});



