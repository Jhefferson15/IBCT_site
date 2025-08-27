document.addEventListener('DOMContentLoaded', () => {
    const missoesGrid = document.getElementById('missoes-grid');
    const modalOverlay = document.getElementById('mission-details-modal');
    const modalCloseBtn = modalOverlay.querySelector('.modal-close');
    const modalImage = document.getElementById('modal-mission-image');
    const modalTitle = document.getElementById('modal-mission-title');
    const modalSubtitle = document.getElementById('modal-mission-subtitle');
    const modalDescription = document.getElementById('modal-mission-description');
    const modalStats = document.getElementById('modal-mission-stats');
    const modalLinkContainer = document.getElementById('modal-mission-link-container');
    const modalLink = document.getElementById('modal-mission-link');

    // Função para renderizar os cards de missão
    function renderMissionCards() {
        missoesGrid.innerHTML = ''; // Limpa o grid antes de renderizar
        missoesData.forEach(mission => {
            const missionCard = document.createElement('div');
            missionCard.classList.add('mission-card');
            missionCard.dataset.missionId = mission.id; // Adiciona o ID da missão ao dataset
            missionCard.innerHTML = `
                <img src="${mission.image}" alt="${mission.title}">
                <div class="mission-content">
                    <h3>${mission.title}</h3>
                    <p>${mission.shortDescription}</p>
                </div>
            `;
            missoesGrid.appendChild(missionCard);
        });

        // Adiciona event listeners aos cards de missão
        document.querySelectorAll('.mission-card').forEach(card => {
            card.addEventListener('click', (event) => {
                const missionId = event.currentTarget.dataset.missionId;
                openMissionModal(missionId);
            });
        });
    }

    // Função para abrir o modal com os detalhes da missão
    function openMissionModal(missionId) {
        const mission = missoesData.find(m => m.id === missionId);

        if (mission) {
            modalImage.src = mission.image;
            modalImage.alt = mission.title;
            modalTitle.textContent = mission.title;
            modalSubtitle.textContent = mission.subtitle;
            modalDescription.innerHTML = mission.detailedDescription;

            // Renderiza as estatísticas
            modalStats.innerHTML = '';
            if (mission.stats && mission.stats.length > 0) {
                mission.stats.forEach(stat => {
                    const statDiv = document.createElement('div');
                    statDiv.classList.add('stat');
                    statDiv.innerHTML = `<div class="number">${stat.number}</div><div class="label">${stat.label}</div>`;
                    modalStats.appendChild(statDiv);
                });
                modalStats.style.display = 'flex';
            } else {
                modalStats.style.display = 'none';
            }

            // Renderiza o link externo, se houver
            if (mission.link && mission.linkText) {
                modalLink.href = mission.link;
                modalLink.textContent = mission.linkText;
                modalLinkContainer.style.display = 'block';
            } else {
                modalLinkContainer.style.display = 'none';
            }

            modalOverlay.classList.add('active');
            document.body.classList.add('modal-open'); // Trava a rolagem de fundo
        }
    }

    // Função para fechar o modal
    function closeMissionModal() {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open'); // Libera a rolagem de fundo
    }

    // Event listeners para fechar o modal
    modalCloseBtn.addEventListener('click', closeMissionModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeMissionModal();
        }
    });

    // Renderiza os cards de missão ao carregar a página
    renderMissionCards();
});