import { FirebaseAdminRepository } from '../infrastructure/FirebaseAdminRepository.js';
import { ManageCollectionUseCase } from '../../../../core/domain/use_cases/ManageCollectionUseCase.js';

const adminRepo = new FirebaseAdminRepository();
const manageEventsUseCase = new ManageCollectionUseCase(adminRepo, 'events');

const eventModal = document.getElementById('event-modal');
const eventForm = document.getElementById('event-form');
const modalTitle = document.getElementById('modal-title');
const calendarBody = document.getElementById('calendar-body');
const monthEventList = document.getElementById('month-event-list');

let currentDate = new Date();
let eventsList = [];

async function loadEvents() {
    eventsList = await manageEventsUseCase.list('date');
    renderCalendar();
    renderEventList();
}

function renderCalendar() {
    if (!calendarBody) return;
    calendarBody.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                // Células vazias
            } else if (date > daysInMonth) {
                // Células vazias
            } else {
                const daySpan = document.createElement('span');
                daySpan.className = 'day-number';
                daySpan.textContent = date;
                cell.appendChild(daySpan);

                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const dayEvents = eventsList.filter(e => e.date === dateString);

                dayEvents.forEach(event => {
                    const tag = document.createElement('div');
                    tag.className = `event-tag ${event.department || 'geral'}`;
                    tag.textContent = event.title;
                    tag.title = `${event.time || ''} - ${event.location || ''}`;
                    tag.onclick = (e) => {
                        e.stopPropagation();
                        openModal(event);
                    };
                    cell.appendChild(tag);
                });

                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        if (date > daysInMonth) break;
    }

    // Atualiza título do mês no HTML
    const monthYearTitle = document.querySelector('.calendar-header h2');
    if (monthYearTitle) {
        monthYearTitle.textContent = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    }
}

function renderEventList() {
    if (!monthEventList) return;
    monthEventList.innerHTML = '';

    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
    const yearStr = currentDate.getFullYear();

    const filtered = eventsList.filter(e => e.date.startsWith(`${yearStr}-${monthStr}`))
                               .sort((a, b) => a.date.localeCompare(b.date));

    if (filtered.length === 0) {
        monthEventList.innerHTML = '<li>Nenhum evento este mês.</li>';
        return;
    }

    monthEventList.innerHTML = filtered.map(event => `
        <li>
            <strong>${event.date.split('-')[2]}/${event.date.split('-')[1]}:</strong> ${event.title}
            <div style="font-size: 11px; color: #888;">${event.time || ''} ${event.location ? ' - ' + event.location : ''}</div>
        </li>
    `).join('');
}

function openModal(event = null) {
    if (event) {
        modalTitle.textContent = "Editar Evento";
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-title').value = event.title || '';
        document.getElementById('event-date').value = event.date || '';
        document.getElementById('event-time').value = event.time || '';
        document.getElementById('event-department').value = event.department || 'geral';
        document.getElementById('event-location').value = event.location || '';
    } else {
        modalTitle.textContent = "Adicionar Evento";
        eventForm.reset();
        document.getElementById('event-id').value = '';
    }
    eventModal.classList.add('active');
}

function closeModal() {
    eventModal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();

    const addBtn = document.querySelector('.btn-primary');
    if (addBtn) addBtn.addEventListener('click', () => openModal());

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    const prevMonthBtn = document.querySelector('.calendar-nav:first-child');
    const nextMonthBtn = document.querySelector('.calendar-nav:last-child');

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
            renderEventList();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
            renderEventList();
        });
    }

    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('event-id').value;
            const eventData = {
                title: document.getElementById('event-title').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                department: document.getElementById('event-department').value,
                location: document.getElementById('event-location').value
            };

            let result;
            if (id) {
                result = await manageEventsUseCase.update(id, eventData);
            } else {
                result = await manageEventsUseCase.add(eventData);
            }

            if (result.success) {
                closeModal();
                loadEvents();
            } else {
                alert("Erro ao salvar evento: " + result.error);
            }
        });
    }
});



