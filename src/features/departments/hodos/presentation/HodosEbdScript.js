import { initSharedUI, openAnyModal, closeAnyModal } from '../../../../../../core/utils/SharedScript.js';
import { FirebaseLessonRepository } from '../infrastructure/FirebaseLessonRepository.js';
import { FirebaseDepartmentNoticeRepository } from '../../common/infrastructure/FirebaseDepartmentNoticeRepository.js';
import { FirebaseDepartmentConfigRepository } from '../../common/infrastructure/FirebaseDepartmentConfigRepository.js';
import { GetLessonsUseCase } from '../domain/use_cases/GetLessonsUseCase.js';
import { GetDepartmentNoticesUseCase } from '../../common/domain/use_cases/GetDepartmentNoticesUseCase.js';

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();

    const DEPT_ID = 'hodos';
    const lessonsScroller = document.querySelector('.lessons-scroller');
    
    // Dados de fallback para testes/offline
    let allLessons = [
        { id: 'fallback-1', title: 'Lição de Exemplo (Offline)', teacher: 'Professor', date: '2029-01-01', description: 'Carregando...', scripture: 'João 3:16', imageText: '1', imageClass: 'color-1' }
    ];
    let currentTrimestreLessons = [...allLessons];
    let previousTrimestreLessons = [];
    let showingFutureLessons = true;

    const lessonRepo = new FirebaseLessonRepository();
    const noticeRepo = new FirebaseDepartmentNoticeRepository();
    const configRepo = new FirebaseDepartmentConfigRepository();

    const getLessonsUseCase = new GetLessonsUseCase(lessonRepo);
    const getNoticesUseCase = new GetDepartmentNoticesUseCase(noticeRepo);

    // Funções de UI (definidas antes para serem usadas na carga inicial e no Firestore)

    function createSummaryCard() {
        const card = document.createElement('div');
        card.className = 'lesson-card summary-card';
        card.id = 'trimestre-summary-card';
        card.innerHTML = `
            <div class="lesson-card-image summary-image"><i class="fas fa-book-open"></i></div>
            <div class="lesson-card-content">
                <span class="date-value">Estudo Concluído</span>
                <h3>Trimestre Anterior</h3>
                <p>Clique para ver o resumo completo.</p>
            </div>`;
        return card;
    }

    function renderLessons() {
        if (!lessonsScroller) return;
        lessonsScroller.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];

        const summaryCard = createSummaryCard();
        lessonsScroller.appendChild(summaryCard);

        const currentLessons = currentTrimestreLessons.filter(lesson => {
            return showingFutureLessons ? lesson.date >= today : lesson.date < today;
        });

        if (currentLessons.length === 0) {
            const noLessonsMessage = document.createElement('p');
            noLessonsMessage.textContent = `Nenhuma aula ${showingFutureLessons ? 'futura' : 'passada'} encontrada.`;
            noLessonsMessage.style.padding = '20px';
            noLessonsMessage.style.textAlign = 'center';
            noLessonsMessage.style.width = '100%';
            lessonsScroller.appendChild(noLessonsMessage);
        }

        currentLessons.forEach(lesson => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            card.dataset.lessonJson = JSON.stringify(lesson);
            
            card.innerHTML = `
                <div class="lesson-card-image ${lesson.imageClass || ''}">${lesson.imageText}</div>
                <div class="lesson-card-content">
                    <span class="date-value">${lesson.date}</span>
                    <h3>${lesson.title}</h3>
                </div>`;
            lessonsScroller.appendChild(card);
        });

        addEventListeners();
    }

    function addEventListeners() {
        const summaryCard = document.getElementById('trimestre-summary-card');
        if (summaryCard) summaryCard.addEventListener('click', openSummaryModal);

        document.querySelectorAll('.lesson-card:not(.summary-card)').forEach(card => {
            card.addEventListener('click', () => {
                const lessonData = JSON.parse(card.dataset.lessonJson);
                openLessonDetailsModal(lessonData);
            });
        });
    }

    function openLessonDetailsModal(lesson) {
        if (lesson.externalPage) {
            const externalPageModal = document.getElementById('external-page-modal');
            const iframe = document.getElementById('modal-iframe');
            if (iframe) iframe.src = lesson.externalPage;
            openAnyModal(externalPageModal);
        } else {
            const lessonModal = document.getElementById('lesson-modal');
            document.getElementById('modal-title').innerText = lesson.title;
            document.getElementById('modal-teacher').innerText = `com ${lesson.teacher}`;
            document.getElementById('modal-description').innerText = lesson.description;
            document.getElementById('modal-scripture').innerText = `"${lesson.scripture}"`;
            openAnyModal(lessonModal);
        }
    }

    function openSummaryModal() {
        const summaryModal = document.getElementById('summary-modal');
        const titleEl = document.getElementById('summary-modal-title');
        const contentEl = document.getElementById('summary-modal-content');

        titleEl.textContent = 'Resumo: Trimestre Anterior';
        
        let contentHTML = '<ul class="summary-lesson-list">';
        previousTrimestreLessons.forEach((lesson, index) => {
            contentHTML += `
                <li class="summary-lesson-item" data-lesson-index="${index}">
                    <h4>${lesson.title}</h4>
                    <p>${lesson.date} - com ${lesson.teacher}</p>
                    <p class="summary-scripture">"${lesson.scripture}"</p>
                </li>`;
        });
        contentHTML += '</ul>';
        contentEl.innerHTML = contentHTML;

        contentEl.querySelectorAll('.summary-lesson-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const lessonIndex = e.currentTarget.dataset.lessonIndex;
                const lesson = previousTrimestreLessons[lessonIndex];
                if (lesson) {
                    closeAnyModal(summaryModal);
                    setTimeout(() => openLessonDetailsModal(lesson), 300);
                }
            });
        });

        openAnyModal(summaryModal);
    }

    function renderNotices(notices) {
        const container = document.getElementById('avisos-container');
        if (!container) return;

        if (notices.length === 0) {
            container.innerHTML = '<p>Nenhum aviso no momento.</p>';
            return;
        }

        container.innerHTML = notices.map(notice => `
            <div class="aviso-card">
                <div class="aviso-header">
                   <i class="${notice.icon} aviso-icon"></i><h3>${notice.title}</h3>
                </div>
                <p>${notice.content}</p>
            </div>
        `).join('');
    }

    function initCountdown(finalExamDateStr) {
        const countdownTimer = document.querySelector('.countdown-timer');
        if (!countdownTimer || !finalExamDateStr) return;

        const finalExamDate = new Date(finalExamDateStr);
        const updateCountdown = () => {
            const diff = finalExamDate - new Date();
            if (diff <= 0) {
                countdownTimer.innerHTML = "<h4 style='color: white;'>O Trimestre chegou ao fim!</h4>";
                clearInterval(countdownInterval); return;
            }
            document.getElementById('days').innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
            document.getElementById('hours').innerText = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
            document.getElementById('mins').innerText = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
            document.getElementById('secs').innerText = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        };
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    function initCalendar(lessons) {
        function generateCalendarEvents() {
            const calendarEvents = {};
            lessons.forEach(lesson => {
                const dateStr = lesson.date;
                if (dateStr) {
                    if (!calendarEvents[dateStr]) calendarEvents[dateStr] = [];
                    calendarEvents[dateStr].push({ 
                        type: 'ebd',
                        title: `EBD: ${lesson.title}`,
                        location: 'IBCT'
                    });
                }
            });
            return calendarEvents;
        }
        window.CALENDAR_EVENTS = generateCalendarEvents();

        document.addEventListener('ibct-api-ready', () => {
            document.querySelectorAll('[data-action="open-calendar"]').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.openCalendarComponent) {
                        window.openCalendarComponent();
                    }
                });
            });
        });
    }

    // Inicialização síncrona
    renderLessons();

    // Carga assíncrona do Firestore
    (async () => {
        try {
            const [lessons, notices, config] = await Promise.all([
                getLessonsUseCase.execute(DEPT_ID),
                getNoticesUseCase.execute(DEPT_ID),
                configRepo.getConfig(DEPT_ID)
            ]);

            allLessons = lessons.length > 0 ? lessons : allLessons;
            const quarterStart = config?.ebd_quarter_start || '2025-08-01';
            previousTrimestreLessons = allLessons.filter(l => l.date < quarterStart);
            currentTrimestreLessons = allLessons.filter(l => l.date >= quarterStart);

            renderNotices(notices);
            initCountdown(config?.final_exam_date);
            initCalendar(allLessons);
        } catch (error) {
            console.error("Falha ao carregar dados do Firestore:", error);
        } finally {
            renderLessons();
        }
    })();

    // Event listeners para fechar modais
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) closeAnyModal(modal);
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAnyModal(modal);
        });
    });

    // Listeners fixos
    const toggleBtn = document.getElementById('toggle-lessons-btn');
    const lessonsTitle = document.getElementById('lessons-title');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (toggleBtn && lessonsTitle) {
        toggleBtn.addEventListener('click', () => {
            showingFutureLessons = !showingFutureLessons;
            lessonsTitle.textContent = showingFutureLessons ? 'Próximas Aulas' : 'Aulas Passadas';
            toggleBtn.textContent = showingFutureLessons ? 'Ver Aulas Passadas' : 'Ver Próximas Aulas';
            renderLessons();
        });
    }

    if (prevBtn && nextBtn && lessonsScroller) {
        prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -330, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: 330, behavior: 'smooth' }));
    }
});



