// --- DADOS PARA EVENTOS DO CALENDÁRIO ---
const eventData = {
    // Aulas de Filipenses
    "2025-04-13": [ { time: '09:00', title: 'EBD: Material de Apoio (Filipenses)' } ],
    "2025-04-27": [ { time: '09:00', title: 'EBD: Aula 5/14 de Filipenses' } ],
    "2025-05-18": [ { time: '09:00', title: 'EBD: Estudo de Filipenses 3:12-16' } ],
    "2025-05-25": [ { time: '09:00', title: 'EBD: Estudo de Filipenses 3:17-21' } ],
    "2025-06-01": [ { time: '09:00', title: 'EBD: Aula Temática "No Jardim com Jesus"' } ],
    "2025-06-08": [ { time: '09:00', title: 'EBD: Estudo de Filipenses 4:1-5' } ],
    "2025-06-15": [ { time: '09:00', title: 'EBD: Recapitulação para Prova (Parte 1)' } ],
    "2025-06-22": [ { time: '09:00', title: 'EBD: Recapitulação para Prova (Parte 2)' } ],
    "2025-06-29": [ { time: '09:00', title: 'EBD: Recapitulação para Prova (Parte 3)' } ],
    // Prova e outros eventos
    "2025-07-06": [ { time: '09:00', title: 'Prova Final da EBD (Filipenses)' } ],
};

// --- 1. LÓGICA DO MENU HAMBÚRGUER ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
    document.body.classList.toggle('modal-open'); 
});

// --- 2. LÓGICA DO COUNTDOWN ---
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secsEl = document.getElementById('secs');

// Data da prova final: 06 de Julho de 2025, às 09:00
const finalExamDate = new Date('2025-07-06T09:00:00');

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
updateCountdown();

// --- 3. LÓGICA DO CARROSSEL DE AULAS ---
const lessonsScroller = document.querySelector('.lessons-scroller');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

if (lessonsScroller) {
    const scrollAmount = 330;
    prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
}

// --- 4. LÓGICA DOS MODAIS (Detalhamento da Aula e Calendário) ---
const lessonModal = document.getElementById('lesson-modal');
const calendarModal = document.getElementById('calendar-modal');
const externalContentModal = document.getElementById('external-content-modal');
const modalExtraContent = document.getElementById('modal-extra-content');

async function loadExternalContent(url, targetElement) {
    targetElement.innerHTML = '<p>Carregando material...</p>';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar o arquivo: ${response.statusText}`);
        }
        const content = await response.text();
        targetElement.innerHTML = content;
    } catch (error) {
        console.error("Falha ao carregar conteúdo externo:", error);
        targetElement.innerHTML = `<p style="color:red;">Não foi possível carregar o material. Por favor, tente novamente mais tarde.</p>`;
    }
}

document.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('modal-title').innerText = card.dataset.title;
        document.getElementById('modal-teacher').innerText = `com ${card.dataset.teacher}`;
        document.getElementById('modal-description').innerText = card.dataset.description;
        document.getElementById('modal-scripture').innerText = `"${card.dataset.scripture}"`;
        
        modalExtraContent.innerHTML = ''; 

        const externalContentUrl = card.dataset.externalContent;
        if (externalContentUrl) {
            const materialButton = document.createElement('button');
            materialButton.className = 'material-button';
            materialButton.textContent = 'Ver Material de Apoio';
            materialButton.onclick = () => {
                closeAnyModal(lessonModal);
                openAnyModal(externalContentModal);
                loadExternalContent(externalContentUrl, document.getElementById('external-content-body'));
            };
            modalExtraContent.appendChild(materialButton);
        }

        openAnyModal(lessonModal);
    });
});

document.getElementById('open-calendar-link').addEventListener('click', () => {
    currentDateCalendar = new Date();
    renderCalendar();
    openAnyModal(calendarModal);
});

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalToClose = e.target.closest('.modal-overlay');
        closeAnyModal(modalToClose);
    });
});

function openAnyModal(modalElement) {
    modalElement.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeAnyModal(modalElement) {
    modalElement.classList.remove('active');
    if (!navLinks.classList.contains('active')) {
        document.body.classList.remove('modal-open');
    }
}

// --- 5. LÓGICA DO CALENDÁRIO ---
let currentDateCalendar = new Date();
const monthYearEl = document.getElementById('month-year');
const calendarDaysEl = document.getElementById('calendar-days');
const eventDetailsEl = document.getElementById('event-details');

function renderCalendar() {
    const month = currentDateCalendar.getMonth();
    const year = currentDateCalendar.getFullYear();
    monthYearEl.textContent = `${currentDateCalendar.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
    calendarDaysEl.innerHTML = '';
    eventDetailsEl.innerHTML = '<p>Selecione um dia para ver os eventos.</p>';

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    for (let i = firstDayOfMonth; i > 0; i--) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell prev-next-month-day';
        dayCell.textContent = lastDateOfPrevMonth - i + 1;
        calendarDaysEl.appendChild(dayCell);
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = i;
        
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add('current-day');
        }

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (eventData[dateStr]) {
            dayCell.classList.add('event-day');
        }

        dayCell.addEventListener('click', () => showEvents(dateStr, dayCell));
        calendarDaysEl.appendChild(dayCell);
    }
}

function showEvents(dateStr, cell) {
    document.querySelectorAll('.day-cell.selected-day').forEach(c => c.classList.remove('selected-day'));
    if (cell.classList.contains('prev-next-month-day')) return; // Não seleciona dias de outros meses
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
    scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
});

scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 7. LÓGICA DA ANIMAÇÃO AO ROLAR (FADE IN ÚNICO) ---
const fadeElements = document.querySelectorAll('.fade-in');
const observerFadeIn = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(el => observerFadeIn.observe(el));
