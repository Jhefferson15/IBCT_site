document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMPARTILHADA (Padrão HODOS) ---

    // 1. Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // 2. Funções de Modal Genéricas
    function openAnyModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    function closeAnyModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            const iframe = modal.querySelector('iframe');
            if (iframe) iframe.src = ""; // Limpa o iframe ao fechar
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            closeAnyModal(e.target.closest('.modal-overlay'));
        }
    });

    // 3. Botão "Scroll to Top"
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Efeito de "Fade-in" ao rolar a página
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observerFadeIn = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeElements.forEach(el => observerFadeIn.observe(el));
    }

    // --- LÓGICA ESPECÍFICA DA PÁGINA EBD ---

    // 1. DADOS DAS AULAS
    const filipensesData = [
        { date: '13 de Abril, 2025', title: 'Material de Apoio', teacher: 'Pr. Juliano Santos', scripture: 'Filipenses 1:1-2', description: 'Iniciamos nossa jornada por Filipenses com um material de apoio especial preparado pelo Pr. Juliano Santos, estabelecendo as bases para nosso estudo.', imageText: 'Lição 01' },
        { date: '27 de Abril, 2025', title: 'Filipenses - Aula 5/14', teacher: 'Pr. Matheus Guerra', scripture: 'Filipenses 2', description: 'Continuamos nosso estudo aprofundado, chegando à quinta aula da série sobre a carta aos Filipenses.', imageText: 'Lição 02' },
        { date: '18 de Maio, 2025', title: 'Filipenses 3:12-16', teacher: 'Pr. Matheus Guerra', scripture: 'Filipenses 3:12-16', description: 'Nesta aula, exploramos o chamado à maturidade cristã, prosseguindo para o alvo sem olhar para trás, conforme descrito por Paulo.', imageText: 'Lição 03' },
        { date: '25 de Maio, 2025', title: 'Filipenses 3:17-21', teacher: 'Pr. Alexandre Coelho', scripture: 'Filipenses 3:20', description: 'O Pastor Alexandre nos guiou por uma reflexão sobre nossa cidadania celestial e a esperança da vinda de Cristo.', imageText: 'Lição 04' },
        { date: '01 de Junho, 2025', title: 'No Jardim com Jesus', teacher: 'Ministério Infantil', scripture: 'João 20:15-17', description: 'Uma aula temática especial que nos levou a uma jornada com Jesus no jardim, trazendo uma pausa revigorante no estudo de Filipenses.', imageText: 'TEMÁTICA' },
        { date: '08 de Junho, 2025', title: 'Filipenses 4:1-5', teacher: 'Pr. Matheus Guerra', scripture: 'Filipenses 4:1', description: 'Retomamos nosso estudo com foco na unidade da igreja, na alegria constante e na moderação que deve ser conhecida por todos.', imageText: 'Lição 05' },
        { date: '15 de Junho, 2025', title: 'Recapitulação (Parte 1)', teacher: 'Professores da EBD', scripture: 'Filipenses 1-2', description: 'Iniciamos a revisão dos principais pontos estudados nos capítulos 1 e 2 de Filipenses, nos preparando para a avaliação final.', imageText: 'REVISÃO' },
        { date: '22 de Junho, 2025', title: 'Recapitulação (Parte 2)', teacher: 'Professores da EBD', scripture: 'Filipenses 3', description: 'Segunda parte da nossa recapitulação, com foco nos temas do capítulo 3. Contaremos com um material de apoio especial do Jhefferson.', imageText: 'REVISÃO', externalPage: 'quiz/quiz_atos_16.html' },
        { date: '29 de Junho, 2025', title: 'Recapitulação (Parte 3)', teacher: 'Professores da EBD', scripture: 'Filipenses 4', description: 'Concluímos nossa revisão com os ensinamentos do capítulo 4, focando na paz de Deus e no contentamento em todas as circunstâncias.', imageText: 'REVISÃO' },
        { date: '06 de Julho, 2025', title: 'Prova Final do Trimestre', teacher: 'Todos os Professores', scripture: '2 Timóteo 2:15', description: 'Chegou o dia de celebrarmos o conhecimento! A prova cobrirá todos os tópicos estudados neste trimestre sobre o livro de Filipenses.', imageText: 'AVALIAÇÃO', imageClass: 'prova-final' }
    ];

    const colossensesData = [
        { date: '31 de Agosto, 2025', title: 'Colossenses: Introdução', teacher: 'Pr. Matheus Guerra', scripture: 'Colossenses 1:1-2', description: 'Uma visão panorâmica da carta aos Colossenses, seu autor, contexto e principais temas que serão abordados no trimestre.', imageText: 'Lição 01' },
        { date: '07 de Setembro, 2025', title: 'A Supremacia de Cristo', teacher: 'Pr. Alexandre Coelho', scripture: 'Colossenses 1:15-23', description: 'Estudo sobre a preeminência de Cristo sobre toda a criação e seu papel como cabeça da Igreja.', imageText: 'Lição 02' },
        { date: '14 de Setembro, 2025', title: 'O Mistério Revelado', teacher: 'Pr. Juliano Santos', scripture: 'Colossenses 1:24-29', description: 'Explorando o "mistério que esteve oculto durante séculos e gerações, mas que agora foi manifestado aos seus santos".', imageText: 'Lição 03' },
        { date: '21 de Setembro, 2025', title: 'Vivendo em Cristo', teacher: 'Pr. Matheus Guerra', scripture: 'Colossenses 2:6-7', description: 'Uma aula prática sobre como viver de maneira digna do Senhor, fortalecidos na fé e transbordando de gratidão.', imageText: 'Lição 04' }
    ];

    // 2. Lógica de Countdown
    const countdownTimer = document.querySelector('.countdown-timer');
    if (countdownTimer) {
        const finalExamDate = new Date('2025-10-26T09:00:00');
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
    
    // 3. Funções de Renderização e Modais
    let showingFutureLessons = true;
    const lessonsScroller = document.querySelector('.lessons-scroller');

    function parseDate(dateString) {
        if (!dateString || typeof dateString !== 'string') return null;
        const monthMap = { 'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11 };
        const parts = dateString.toLowerCase().replace(',', '').split(' ');
        if (parts.length < 4) return null;
        const day = parseInt(parts[0], 10), month = monthMap[parts[2]], year = parseInt(parts[3], 10);
        return (!isNaN(day) && month !== undefined && !isNaN(year)) ? new Date(year, month, day) : null;
    }

    function renderLessons() {
        if (!lessonsScroller) return;
        lessonsScroller.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const summaryCard = createFilipensesSummaryCard();
        lessonsScroller.appendChild(summaryCard);

        const currentLessons = colossensesData.filter(lesson => {
            const lessonDate = parseDate(lesson.date);
            if (!lessonDate) return false;
            return showingFutureLessons ? lessonDate >= today : lessonDate < today;
        });

        if (currentLessons.length === 0) {
            const noLessonsMessage = document.createElement('p');
            noLessonsMessage.textContent = `Nenhuma aula ${showingFutureLessons ? 'futura' : 'passada'} de Colossenses encontrada.`;
            noLessonsMessage.style.padding = '20px';
            noLessonsMessage.style.textAlign = 'center';
            noLessonsMessage.style.width = '100%';
            lessonsScroller.appendChild(noLessonsMessage);
        }

        currentLessons.forEach(lesson => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            Object.keys(lesson).forEach(key => { if(lesson[key] !== undefined) card.dataset[key] = lesson[key]; });
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

    function createFilipensesSummaryCard() {
        const card = document.createElement('div');
        card.className = 'lesson-card summary-card';
        card.id = 'filipenses-summary-card';
        card.innerHTML = `
            <div class="lesson-card-image summary-image"><i class="fas fa-book-open"></i></div>
            <div class="lesson-card-content">
                <span class="date-value">Estudo Concluído</span>
                <h3>Livro de Filipenses</h3>
                <p>Clique para ver o resumo completo do trimestre anterior.</p>
            </div>`;
        return card;
    }

    function addEventListeners() {
        document.getElementById('filipenses-summary-card').addEventListener('click', openFilipensesSummaryModal);

        document.querySelectorAll('.lesson-card:not(.summary-card)').forEach(card => {
            card.addEventListener('click', () => openLessonDetailsModal(card.dataset));
        });
    }

    function openLessonDetailsModal(lessonData) {
        if (lessonData.externalPage) {
            const externalPageModal = document.getElementById('external-page-modal');
            document.getElementById('modal-iframe').src = lessonData.externalPage;
            openAnyModal(externalPageModal);
        } else {
            const lessonModal = document.getElementById('lesson-modal');
            document.getElementById('modal-title').innerText = lessonData.title;
            document.getElementById('modal-teacher').innerText = `com ${lessonData.teacher}`;
            document.getElementById('modal-description').innerText = lessonData.description;
            document.getElementById('modal-scripture').innerText = `"${lessonData.scripture}"`;
            openAnyModal(lessonModal);
        }
    }

    function openFilipensesSummaryModal() {
        const summaryModal = document.getElementById('summary-modal');
        const titleEl = document.getElementById('summary-modal-title');
        const contentEl = document.getElementById('summary-modal-content');

        titleEl.textContent = 'Resumo: Estudo sobre Filipenses';
        
        let contentHTML = '<ul class="summary-lesson-list">';
        filipensesData.forEach((lesson, index) => {
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
                const lesson = filipensesData[lessonIndex];
                if (lesson) {
                    closeAnyModal(summaryModal);
                    setTimeout(() => openLessonDetailsModal(lesson), 300);
                }
            });
        });

        openAnyModal(summaryModal);
    }

    // 4. Lógica da Seção de Aulas (Botões, etc)
    const toggleBtn = document.getElementById('toggle-lessons-btn');
    const lessonsTitle = document.getElementById('lessons-title');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (toggleBtn && lessonsTitle) {
        toggleBtn.addEventListener('click', () => {
            showingFutureLessons = !showingFutureLessons;
            lessonsTitle.textContent = showingFutureLessons ? 'Próximas Aulas: Colossenses' : 'Aulas Passadas: Colossenses';
            toggleBtn.textContent = showingFutureLessons ? 'Ver Aulas Passadas' : 'Ver Próximas Aulas';
            renderLessons();
        });
    }

    if (prevBtn && nextBtn && lessonsScroller) {
        prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -330, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: 330, behavior: 'smooth' }));
    }
    
    // Renderização inicial
    lessonsTitle.textContent = 'Próximas Aulas: Colossenses';
    renderLessons();
    
    // 5. Geração de Eventos e Abertura do Calendário
    // CORREÇÃO: Espera o componente do calendário estar pronto
    document.addEventListener('ibct-api-ready', () => {
        document.querySelectorAll('[data-action="open-calendar"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.openCalendarComponent) {
                    window.openCalendarComponent();
                } else {
                    console.error('Componente do calendário não pôde ser aberto.');
                }
            });
        });
    });

    function generateCalendarEvents() {
        const calendarEvents = {};
        const allLessons = [...filipensesData, ...colossensesData];
        allLessons.forEach(lesson => {
            const eventDate = parseDate(lesson.date);
            if (eventDate) {
                const dateStr = eventDate.toISOString().slice(0, 10);
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
});