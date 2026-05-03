import { FirebaseEventsRepository } from '../../../home/infrastructure/FirebaseEventsRepository.js';
import { GetEventsUseCase } from '../../../home/domain/use_cases/GetEventsUseCase.js';
import { initSharedUI, openAnyModal, closeAnyModal } from '../../../../../core/utils/SharedScript.js';

export function initDepartmentPage(departmentId) {
    const eventsRepo = new FirebaseEventsRepository();
    const getEventsUseCase = new GetEventsUseCase(eventsRepo);

    document.addEventListener('DOMContentLoaded', () => {
        initSharedUI();

        // --- CARROSSEL DE EVENTOS ---
        const lessonsScroller = document.querySelector('.lessons-scroller');
        const toggleBtn = document.getElementById('toggle-events-btn');
        const eventsTitle = document.getElementById('events-title');
        let showingFutureEvents = true;

        async function renderEventsCarousel(filterType = 'future') {
            if (!lessonsScroller) return;
            lessonsScroller.innerHTML = '<p style="padding: 20px; text-align: center; width: 100%;">Carregando eventos...</p>';

            const allEvents = await getEventsUseCase.execute(20, departmentId);
            const today = new Date().toISOString().split('T')[0];
            
            const filteredEvents = allEvents.filter(event => {
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

            // Listeners para modais de eventos
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

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                showingFutureEvents = !showingFutureEvents;
                if (eventsTitle) eventsTitle.textContent = showingFutureEvents ? 'Nossos Próximos Encontros' : 'Eventos que já Aconteceram';
                toggleBtn.textContent = showingFutureEvents ? 'Ver Eventos Passados' : 'Ver Próximos Eventos';
                renderEventsCarousel(showingFutureEvents ? 'future' : 'past');
            });
        }

        // --- WIDGET DE PRÓXIMOS EVENTOS ---
        async function populateNextEventsWidget() {
            const listContainer = document.getElementById('next-events-list');
            if (!listContainer) return;

            const nextEvents = await getEventsUseCase.execute(4, departmentId);

            if (nextEvents.length === 0) {
                listContainer.innerHTML = '<p>Nenhum evento agendado em breve.</p>';
                return;
            }

            listContainer.innerHTML = nextEvents.map(event => `
                <div class="event-item-widget">
                    <div class="date"><span>${event.formattedDay}</span><small>${event.formattedMonth}</small></div>
                    <div class="info"><strong>${event.title}</strong><span>${event.location || ''}</span></div>
                </div>`).join('');
        }

        // --- CONTROLES DE SCROLL ---
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn && nextBtn && lessonsScroller) {
            prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -330, behavior: 'smooth' }));
            nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: 330, behavior: 'smooth' }));
        }

        // --- MODAIS GENÉRICOS ---
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

        // Inicialização
        renderEventsCarousel('future');
        populateNextEventsWidget();
    });
}



