// --- SCRIPT PARA A PÁGINA SOBRE (hodos_sobre.html) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMPARTILHADA (Copiar e Colar de hodos_script.js) ---

    // 1. Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
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

    // --- LÓGICA ESPECÍFICA DA PÁGINA SOBRE ---

    // 1. Lógica dos Pilares (Modal) - CONTEÚDO ATUALIZADO
    const pillarDetails = {
        palavra: {
            title: "Pilar: Palavra",
            description: "A Palavra de Deus é a nossa bússola. Aprofundamos nosso conhecimento bíblico em estudos como o da carta aos Filipenses na EBD, com desafios como a PRO.FI, e o aplicamos em nossos PGMs. Cremos que a Bíblia é viva e nos transforma para viver a verdade."
        },
        comunhao: {
            title: "Pilar: Comunhão",
            description: "Somos uma família em Cristo. Fortalecemos nossos laços no Hodos Day com churrasco e diversão, nos PGMs semanais e nos encontros informais. Acreditamos que a caminhada cristã é vivida em comunidade, com apoio, oração e amizade verdadeira."
        },
        adoracao: {
            title: "Pilar: Adoração",
            description: "Nossa adoração vai além da música. Nos Hodos Meet, nos unimos em louvor e celebração vibrante. Mas buscamos honrar a Deus em tudo: em nosso trabalho, estudos e relacionamentos, fazendo de toda a nossa vida um ato de adoração ao Criador."
        },
        servico: {
            title: "Pilar: Serviço",
            description: "O amor de Deus nos move a servir. Colocamos nossa fé em prática apoiando projetos missionários, como a recepção aos jovens da CRU, e servindo nossa comunidade local. Entendemos que somos as mãos e os pés de Jesus no mundo."
        }
    };

    const pillarModal = document.getElementById('pillar-modal');
    const pillarModalTitle = document.getElementById('pillar-modal-title');
    const pillarModalDescription = document.getElementById('pillar-modal-description');

    document.querySelectorAll('#sobre .aviso-card').forEach(card => {
        card.addEventListener('click', () => {
            const pillarId = card.dataset.pillarId;
            const details = pillarDetails[pillarId];

            if (details) {
                pillarModalTitle.innerText = details.title;
                pillarModalDescription.innerText = details.description;
                openAnyModal(pillarModal);
            }
        });
    });

    // 2. Lógica da Linha do Tempo
    document.querySelectorAll('.timeline-event-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling; // O próximo irmão é o .timeline-event-content
            if (content && content.classList.contains('timeline-event-content')) {
                header.classList.toggle('active'); // Adiciona/remove classe para o cabeçalho
                content.classList.toggle('active'); // Adiciona/remove classe para o conteúdo
            }
        });
    });
    
    // 3. Lógica do Calendário (se presente na página, mas não para hodos_sobre neste exemplo)
    // Para fins de compatibilidade, se o calendário precisar de eventos aqui, você os definiria.
    // window.CALENDAR_EVENTS = {}; 

});