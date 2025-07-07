// --- START OF FILE js/home-script.js ---

document.addEventListener('DOMContentLoaded', () => {
    /* 
    AVISO: A lógica da animação da logo foi intencionalmente removida deste arquivo.
    Ela agora é carregada de forma isolada através do `<iframe>` no arquivo HTML,
    o que torna este script mais leve, rápido e focado apenas na interatividade da página.
    */

    // --- 1. MANIPULAÇÃO DE ELEMENTOS DO DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const infoModal = document.getElementById('info-modal');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');

    // MUDANÇA: Base de dados de eventos foi REMOVIDA daqui.
    // O script `calendario.js` agora centraliza todos os dados.

    // --- 2. LÓGICA DO MENU HAMBÚRGUER ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('modal-open', navLinks.classList.contains('active'));
        });
    }

    // --- 3. LÓGICA DOS MODAIS (Ministérios, etc) ---
    function openAnyModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }
    function closeAnyModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            // Verifica se o modal do calendário ou do menu ainda estão ativos
            if (!document.querySelector('.modal-overlay.active') && !navLinks.classList.contains('active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', e => closeAnyModal(e.target.closest('.modal-overlay')));
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

    // --- 4. LÓGICA DO WIDGET DE PRÓXIMOS EVENTOS ---
    function populateNextEvents() {
        const listContainer = document.getElementById('next-events-list');
        if (!listContainer || !window.IBCT_EVENTS_API) return;

        // MUDANÇA: Busca eventos da API central, com filtro 'igreja' e para 'widget'.
        const allChurchEvents = window.IBCT_EVENTS_API.getEvents({ filter: 'igreja', displayIn: 'widget' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureEvents = allChurchEvents
            .map(event => ({ ...event, dateObj: new Date(event.date + 'T00:00:00') }))
            .filter(event => event.dateObj >= today)
            .sort((a, b) => a.dateObj - b.dateObj);
            
        const next4Events = futureEvents.slice(0, 4);

        if(next4Events.length === 0) {
            listContainer.innerHTML = '<p>Nenhum evento agendado em breve.</p>';
            return;
        }

        listContainer.innerHTML = next4Events.map(event => {
            const day = String(event.dateObj.getDate()).padStart(2, '0');
            const month = event.dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            return `
                <div class="event-item-widget">
                    <div class="date">
                        <span>${day}</span>
                        <small>${month}</small>
                    </div>
                    <div class="info">
                        <strong>${event.title}</strong>
                        <span>${event.time}</span>
                    </div>
                </div>`;
        }).join('');
    }
    // MUDANÇA: Espera a API carregar antes de popular o widget
    if (window.IBCT_EVENTS_API) {
        populateNextEvents();
    } else {
        window.addEventListener('load', populateNextEvents); // Fallback
    }
    
    // --- 5. BOTÃO VOLTAR AO TOPO & ANIMAÇÃO DE SCROLL ---
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

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
});