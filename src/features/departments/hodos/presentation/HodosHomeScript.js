import { FirebaseEventsRepository } from '../../../home/infrastructure/FirebaseEventsRepository.js';
import { GetEventsUseCase } from '../../../home/domain/use_cases/GetEventsUseCase.js';
import { initSharedUI, openAnyModal, closeAnyModal } from '../../../../../core/utils/SharedScript.js';

const eventsRepo = new FirebaseEventsRepository();
const getEventsUseCase = new GetEventsUseCase(eventsRepo);

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();

    // --- LÓGICA DE EVENTOS (CAROUSEL & WIDGET) ---

    async function renderEventsCarousel(filterType = 'future') {
        const lessonsScroller = document.querySelector('.lessons-scroller');
        if (!lessonsScroller) return;

        lessonsScroller.innerHTML = '<p style="padding: 20px; text-align: center; width: 100%;">Carregando eventos...</p>';

        // Busca todos os eventos do Hodos (limite maior para o carrossel)
        const allHodosEvents = await getEventsUseCase.execute(20, 'hodos');

        const today = new Date().toISOString().split('T')[0];
        
        const filteredEvents = allHodosEvents.filter(event => {
            if (filterType === 'future') return event.date >= today;
            return event.date < today;
        });

        if (filteredEvents.length === 0) {
            lessonsScroller.innerHTML = `<p style="padding: 20px; text-align: center; width: 100%;">Nenhum evento ${filterType === 'future' ? 'futuro' : 'passado'} encontrado.</p>`;
            return;
        }

        lessonsScroller.innerHTML = filteredEvents.map(event => {
            const cardImageContent = event.cardContentHTML || event.type?.toUpperCase() || 'EVENTO';
            const imageContainerClass = event.cardContentHTML ? "lesson-card-image special-content-container" : "lesson-card-image";
            
            return `
                <div class="event-card ${event.cardClass || ''}" data-external-page="${event.externalPage || ''}">
                    <div class="${imageContainerClass}">${cardImageContent}</div>
                    <div class="lesson-card-content">
                        <span class="date-value">${event.date}</span>
                        <h3>${event.title}</h3>
                    </div>
                </div>`;
        }).join('');

        addModalListeners();
    }

    function addModalListeners() {
        document.querySelectorAll('.event-card').forEach(card => {
            const externalPage = card.dataset.externalPage;
            if (externalPage) {
                card.addEventListener('click', () => {
                    const externalPageModal = document.getElementById('external-page-modal');
                    const iframe = document.getElementById('modal-iframe');
                    if (externalPageModal && iframe) {
                        iframe.src = externalPage;
                        openAnyModal(externalPageModal);
                    }
                });
            }
        });
    }

    async function populateNextHodosEvents() {
        const listContainer = document.getElementById('next-events-list');
        if (!listContainer) return;

        const next4Events = await getEventsUseCase.execute(4, 'hodos');

        if (next4Events.length === 0) {
            listContainer.innerHTML = '<p>Nenhum evento do Hodos agendado em breve.</p>';
            return;
        }

        listContainer.innerHTML = next4Events.map(event => `
                <div class="event-item-widget">
                    <div class="date">
                        <span>${event.formattedDay}</span>
                        <small>${event.formattedMonth}</small>
                    </div>
                    <div class="info">
                        <strong>${event.title}</strong>
                        <span>${event.location || ''}</span>
                    </div>
                </div>`).join('');
    }

    // --- CONTROLES DE UI ---

    const toggleBtn = document.getElementById('toggle-events-btn');
    const eventsTitle = document.getElementById('events-title');
    let showingFutureEvents = true;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            showingFutureEvents = !showingFutureEvents;
            eventsTitle.textContent = showingFutureEvents ? 'Nossos Próximos Encontros' : 'Eventos que já Aconteceram';
            toggleBtn.textContent = showingFutureEvents ? 'Ver Eventos Passados' : 'Ver Próximos Eventos';
            renderEventsCarousel(showingFutureEvents ? 'future' : 'past');
        });
    }

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const scroller = document.querySelector('.lessons-scroller');

    if (prevBtn && nextBtn && scroller) {
        prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -330, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => scroller.scrollBy({ left: 330, behavior: 'smooth' }));
    }

    // Inicialização
    renderEventsCarousel('future');
    populateNextHodosEvents();

    // Modais genéricos
    document.querySelectorAll('.modal-close').forEach(btn => {
        const modal = btn.closest('.modal-overlay');
        if (modal && modal.id !== 'instagram-modal') {
            btn.addEventListener('click', () => {
                const iframe = modal.querySelector('iframe');
                if (iframe) iframe.src = "";
                closeAnyModal(modal);
            });
        }
    });
});



