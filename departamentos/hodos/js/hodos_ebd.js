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
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay')));
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

    // 1. Dados das Aulas (Centralizados)
    const lessonsData = [
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

    // 2. Lógica de Countdown
    const countdownTimer = document.querySelector('.countdown-timer');
    if (countdownTimer) {
        const finalExamDate = new Date('2025-07-06T09:00:00');
        const updateCountdown = () => {
            const diff = finalExamDate - new Date();
            if (diff <= 0) {
                countdownTimer.innerHTML = "<h4 style='color: white;'>A Prova já aconteceu!</h4>";
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
    
    // 3. Funções de Renderização das Aulas
    let showingFutureLessons = true;
    const lessonsScroller = document.querySelector('.lessons-scroller');

    function parseDate(dateString) {
        if (!dateString || typeof dateString !== 'string') return null;
        const monthMap = { 'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11 };
        const parts = dateString.toLowerCase().replace(',', '').split(' ');
        if (parts.length < 3) return null;
        const day = parseInt(parts[0], 10), month = monthMap[parts[2]], year = parseInt(parts[3], 10);
        return (!isNaN(day) && month !== undefined && !isNaN(year)) ? new Date(year, month, day) : null;
    }

    function renderLessons(filter) {
        if (!lessonsScroller) return;
        lessonsScroller.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredLessons = lessonsData.filter(lesson => {
            const lessonDate = parseDate(lesson.date);
            if (!lessonDate) return false;
            return filter === 'future' ? lessonDate >= today : lessonDate < today;
        });

        if (filteredLessons.length === 0) {
            lessonsScroller.innerHTML = `<p style="padding: 20px; text-align: center; width: 100%;">Nenhuma aula ${filter === 'future' ? 'futura' : 'passada'} encontrada.</p>`;
            return;
        }

        filteredLessons.forEach(lesson => {
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
        addModalListeners();
    }

    function addModalListeners() {
        document.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.dataset.externalPage) {
                    const externalPageModal = document.getElementById('external-page-modal');
                    document.getElementById('modal-iframe').src = card.dataset.externalPage;
                    openAnyModal(externalPageModal);
                } else {
                    const lessonModal = document.getElementById('lesson-modal');
                    document.getElementById('modal-title').innerText = card.dataset.title;
                    document.getElementById('modal-teacher').innerText = `com ${card.dataset.teacher}`;
                    document.getElementById('modal-description').innerText = card.dataset.description;
                    document.getElementById('modal-scripture').innerText = `"${card.dataset.scripture}"`;
                    openAnyModal(lessonModal);
                }
            });
        });
    }

    // 4. Lógica da Seção de Aulas (Botões, etc)
    const toggleBtn = document.getElementById('toggle-lessons-btn');
    const lessonsTitle = document.getElementById('lessons-title');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            showingFutureLessons = !showingFutureLessons;
            lessonsTitle.textContent = showingFutureLessons ? 'Próximas Aulas do Trimestre' : 'Aulas que já Aconteceram';
            toggleBtn.textContent = showingFutureLessons ? 'Ver Aulas Passadas' : 'Ver Próximas Aulas';
            renderLessons(showingFutureLessons ? 'future' : 'past');
        });
    }

    if (prevBtn && nextBtn && lessonsScroller) {
        prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -330, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: 330, behavior: 'smooth' }));
    }
    
    renderLessons('future'); // Renderização inicial
    
    // 5. Geração de Eventos e Abertura do Calendário
    // CORREÇÃO: Adicionada a lógica para abrir o modal do calendário
    const calendarModal = document.getElementById('calendar-modal');
    document.querySelectorAll('[data-action="open-calendar"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openAnyModal(calendarModal);
        });
    });

    function generateCalendarEvents() {
        const calendarEvents = {};
        lessonsData.forEach(lesson => {
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
    // Expõe os eventos para o script do componente de calendário
    window.CALENDAR_EVENTS = generateCalendarEvents();
});