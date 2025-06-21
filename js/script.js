// --- DADOS PARA EVENTOS DO CALENDÁRIO ---
const eventData = {
    // Formato: "AAAA-MM-DD": [{ time: 'HH:MM', title: 'Nome do Evento' }]
    "2025-06-28": [ { time: '09:00', title: 'Prova Final da EBD' }, { time: '19:00', title: 'Culto de Jovens' } ],
    "2025-07-05": [ { time: '19:30', title: 'Vigília de Oração' } ],
    "2025-07-12": [ { time: '08:00', title: 'Mutirão de Limpeza' }, { time: '20:00', title: 'Noite de Louvor' } ],
    "2025-07-20": [ { time: '10:00', title: 'Culto de Missões' } ],
    "2025-08-03": [ { time: '18:30', title: 'Reunião de Líderes' } ]
};

// --- 1. LÓGICA DO MENU HAMBÚRGUER ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
    // Bloqueia/desbloqueia o scroll do body quando o menu mobile está ativo
    document.body.classList.toggle('modal-open'); 
});

// --- 2. LÓGICA DO COUNTDOWN ---
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secsEl = document.getElementById('secs');

// Data da prova final: 28 de Junho de 2025, às 09:00
const finalExamDate = new Date('2025-06-28T09:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = finalExamDate - now;

    if (diff <= 0) {
        document.querySelector('.countdown-timer').innerHTML = "<h4>A Prova já aconteceu!</h4>";
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minsEl.innerText = String(mins).padStart(2, '0');
    secsEl.innerText = String(secs).padStart(2, '0');
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Chama uma vez para exibir imediatamente

// --- 3. LÓGICA DO CARROSSEL DE AULAS ---
const lessonsScroller = document.querySelector('.lessons-scroller');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

if (lessonsScroller) { // Verifica se o scroller existe (para evitar erros em pages sem ele)
    const scrollAmount = 330; // Largura do card + gap (300px + 30px)
    prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
}

// --- 4. LÓGICA DOS MODAIS (Detalhamento da Aula e Calendário) ---
const lessonModal = document.getElementById('lesson-modal');
const calendarModal = document.getElementById('calendar-modal');

// Abre o modal de aula
document.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('modal-title').innerText = card.dataset.title;
        document.getElementById('modal-teacher').innerText = `com ${card.dataset.teacher}`;
        document.getElementById('modal-description').innerText = card.dataset.description;
        document.getElementById('modal-scripture').innerText = `"${card.dataset.scripture}"`;
        openAnyModal(lessonModal);
    });
});

// Abre o modal do calendário
document.getElementById('open-calendar-link').addEventListener('click', () => {
    currentDateCalendar = new Date(); // Reinicia para o mês atual ao abrir
    renderCalendar();
    openAnyModal(calendarModal);
});

// Fecha qualquer modal
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalToClose = e.target.closest('.modal-overlay');
        closeAnyModal(modalToClose);
    });
});

// Funções auxiliares para abrir/fechar modais e controlar o scroll do body
function openAnyModal(modalElement) {
    modalElement.classList.add('active');
    document.body.classList.add('modal-open'); // Bloqueia o scroll do body
}

function closeAnyModal(modalElement) {
    modalElement.classList.remove('active');
    // Desbloqueia o scroll do body APENAS se o menu mobile não estiver aberto
    if (!navLinks.classList.contains('active')) {
        document.body.classList.remove('modal-open');
    }
}

// --- 5. LÓGICA DO CALENDÁRIO ---
let currentDateCalendar = new Date(); // Variável dedicada ao calendário
const monthYearEl = document.getElementById('month-year');
const calendarDaysEl = document.getElementById('calendar-days');
const eventDetailsEl = document.getElementById('event-details');

function renderCalendar() {
    const month = currentDateCalendar.getMonth();
    const year = currentDateCalendar.getFullYear();
    monthYearEl.textContent = `${currentDateCalendar.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
    calendarDaysEl.innerHTML = ''; // Limpa os dias anteriores
    eventDetailsEl.innerHTML = '<p>Selecione um dia para ver os eventos.</p>'; // Limpa detalhes de eventos

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Dia da semana do 1º dia (0=Dom, 6=Sáb)
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); // Último dia do mês atual
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate(); // Último dia do mês anterior

    // Preenche dias do mês anterior
    for (let i = firstDayOfMonth; i > 0; i--) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell prev-next-month-day';
        dayCell.textContent = lastDateOfPrevMonth - i + 1;
        calendarDaysEl.appendChild(dayCell);
    }

    // Preenche dias do mês atual
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = i;
        
        const today = new Date();
        // Adiciona classe para o dia atual
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add('current-day');
        }

        // Formata a data para buscar eventos (YYYY-MM-DD)
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (eventData[dateStr]) {
            dayCell.classList.add('event-day'); // Marca dias com eventos
        }

        dayCell.addEventListener('click', () => showEvents(dateStr, dayCell));
        calendarDaysEl.appendChild(dayCell);
    }
}

function showEvents(dateStr, cell) {
    // Remove seleção de dias anteriores e adiciona ao dia clicado
    document.querySelectorAll('.day-cell.selected-day').forEach(c => c.classList.remove('selected-day'));
    cell.classList.add('selected-day');

    const events = eventData[dateStr];
    if (events && events.length > 0) {
        eventDetailsEl.innerHTML = `<h4>Eventos para ${new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}:</h4>`;
        events.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event-item';
            eventEl.innerHTML = `<strong>${event.time}</strong> - ${event.title}`;
            eventDetailsEl.appendChild(eventEl);
        });
    } else {
        eventDetailsEl.innerHTML = '<p>Nenhum evento agendado para este dia.</p>';
    }
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDateCalendar.setMonth(currentDateCalendar.getMonth() - 1);
    renderCalendar();
});
document.getElementById('next-month').addEventListener('click', () => {
    currentDateCalendar.setMonth(currentDateCalendar.getMonth() + 1);
    renderCalendar();
});

// --- 6. LÓGICA DO BOTÃO "VOLTAR AO TOPO" ---
const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    // Adiciona/remove a classe 'visible' baseada na posição do scroll
    scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
});

scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll suave para o topo
});

// --- 7. LÓGICA DA ANIMAÇÃO AO ROLAR (FADE IN ÚNICO) ---
const fadeElements = document.querySelectorAll('.fade-in');
const observerFadeIn = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Deixa de observar após a animação (executa apenas uma vez)
        }
    });
}, {
    threshold: 0.1 // A animação começa quando 10% do elemento está visível
});

fadeElements.forEach(el => observerFadeIn.observe(el));
