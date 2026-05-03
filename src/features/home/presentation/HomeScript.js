// js/home-script.js
import { FirebaseAuthRepository } from '../../auth/infrastructure/FirebaseAuthRepository.js';
import { FirebaseEventsRepository } from '../infrastructure/FirebaseEventsRepository.js';
import { LogoutUseCase } from '../../auth/domain/use_cases/LogoutUseCase.js';
import { GetEventsUseCase } from '../domain/use_cases/GetEventsUseCase.js';
import { initSharedUI, openAnyModal, closeAnyModal } from '../../../core/utils/SharedScript.js';
import { getVerseByDay } from '../../../core/utils/DailyVerses.js';

// --- INICIALIZAÇÃO DA CLEAN ARCHITECTURE ---
console.log("Inicializando Home Script...");
let authRepo, eventsRepo, logoutUseCase, getEventsUseCase;

try {
    authRepo = new FirebaseAuthRepository();
    eventsRepo = new FirebaseEventsRepository();
    logoutUseCase = new LogoutUseCase(authRepo);
    getEventsUseCase = new GetEventsUseCase(eventsRepo);
} catch (e) {
    console.error("Falha ao inicializar Repositórios (provavelmente Firebase Config ausente):", e);
}

// --- FUNÇÕES DE UI ---

function populateDailyVerse() {
    const verseContainer = document.querySelector('.verse-widget blockquote');
    const citeContainer = document.querySelector('.verse-widget cite');
    
    if (!verseContainer || !citeContainer) return;

    const verse = getVerseByDay();
    verseContainer.textContent = `"${verse.text}"`;
    citeContainer.textContent = verse.ref;
}

function updateUIForLoginState(user) {
    const userSessionContainer = document.getElementById('user-session-container');
    if (!userSessionContainer) return;

    if (user) {
        const userName = user.displayName || user.email.split('@')[0];
        userSessionContainer.innerHTML = `
            <a href="membros.html" class="welcome-link">Olá, ${userName}</a>
            <a id="logout-button" class="logout-button">Sair</a>
        `;
        document.getElementById('logout-button').addEventListener('click', async () => {
            await logoutUseCase.execute();
        });
    } else {
        userSessionContainer.innerHTML = `<a href="login.html" class="logout-button">Login</a>`;
    }
}

async function populateNextEvents() {
    const listContainer = document.getElementById('next-events-list');
    if (!listContainer || !getEventsUseCase) return;

    const next4Events = await getEventsUseCase.execute(4);

    if (next4Events.length === 0) {
        listContainer.innerHTML = '<p>Nenhum evento agendado em breve.</p>';
        return;
    }

    listContainer.innerHTML = next4Events.map(event => {
        const dateObj = new Date(event.date + 'T00:00:00');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
        return `
            <div class="event-item-widget">
                <div class="date"><span>${day}</span><small>${month}</small></div>
                <div class="info"><strong>${event.title}</strong><span>${event.time || ''}</span></div>
            </div>`;
    }).join('');
}

// --- ESCUTADORES E INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();
    
    updateUIForLoginState(null); 
    if (authRepo) {
        authRepo.onAuthStateChanged((user) => {
            updateUIForLoginState(user);
        });
    }

    populateNextEvents();
    populateDailyVerse();

    const infoModal = document.getElementById('info-modal');
    window.closeAnyModal = () => closeAnyModal(infoModal);

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => closeAnyModal(infoModal));
    });

    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalTitle = infoModal.querySelector('#modal-title');
            const modalDesc = infoModal.querySelector('#modal-description');
            const modalImg = infoModal.querySelector('#modal-image');
            const modalLinkContainer = infoModal.querySelector('#modal-link-container');

            modalTitle.textContent = card.dataset.title;
            modalDesc.textContent = card.dataset.description;
            modalImg.style.display = card.dataset.image ? 'block' : 'none';
            if (card.dataset.image) modalImg.src = card.dataset.image;
            
            modalLinkContainer.innerHTML = '';
            
            if (card.dataset.link2Url && card.dataset.link2Text) {
                const linkButton2 = document.createElement('a');
                linkButton2.href = card.dataset.link2Url;
                linkButton2.textContent = card.dataset.link2Text;
                linkButton2.className = 'modal-action-button';
                modalLinkContainer.appendChild(linkButton2);
            }
            
            if (card.dataset.linkUrl && card.dataset.linkText) {
                const linkButton = document.createElement('a');
                linkButton.href = card.dataset.linkUrl;
                linkButton.textContent = card.dataset.linkText;
                linkButton.className = 'modal-action-button discreet';
                modalLinkContainer.appendChild(linkButton);
            }
            
            openAnyModal(infoModal);
        });
    });
});



