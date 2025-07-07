document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMPARTILHADA (Menu, Scroll-to-top, Fade-in) ---

    // 1. Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    }

    // 2. Botão "Scroll to Top"
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
    
    // 3. Efeito de "Fade-in" ao rolar a página
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


    // --- LÓGICA ESPECÍFICA DA PÁGINA "SOBRE IBCT" ---

    // 1. Funções de Modal Genéricas
    function openAnyModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    function closeAnyModal(modal) {
        if (modal) {
            modal.classList.remove('active');
             // Só remove a classe do body se nenhum outro modal estiver ativo
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay')));
    });

    // 2. Lógica do Modal da Universidade da Família
    const courseDetails = {
        homem: {
            title: "Curso: Homem ao Máximo",
            description: "O que é ser um homem de verdade? Este curso, baseado na Palavra de Deus, ajuda a desenvolver a masculinidade em Cristo, conformando o comportamento à Sua maravilhosa palavra. O participante também aprenderá a se fortalecer mutuamente com outros homens de seu convívio, como diz Provérbios 27:17: 'Assim como o ferro afia o ferro, um amigo afia seu amigo'."
        },
        mulher: {
            title: "Curso: Mulher Única",
            description: "Dirigido a mulheres, este curso aborda temas como autoestima, valor, feminilidade e responsabilidade. Nosso desejo é que Deus a liberte e dê vida abundante em toda a sua plenitude, causando grande impacto na família e na sociedade, através de sua originalidade, identidade e singularidade."
        },
        crown: {
            title: "Curso: Finanças Crown",
            description: "Os princípios financeiros de Deus vão muito além de livrar-se de dívidas e viver dentro de um orçamento. Seu desejo é que cada um de nós cresça em nossa compreensão de Seu propósito para tudo o que somos e tudo o que temos. Nossos recursos nunca foram destinados a ser sobre nós. Cremos que só experimentaremos o verdadeiro propósito e a verdadeira liberdade financeira quando entendermos que Ele é o dono de tudo e que somos simplesmente os administradores de tudo o que Ele nos confiou."
        }
    };

    const courseModal = document.getElementById('course-modal');
    const courseModalTitle = document.getElementById('course-modal-title');
    const courseModalDescription = document.getElementById('course-modal-description');

    document.querySelectorAll('#universidade-familia .uf-card').forEach(card => {
        card.addEventListener('click', () => {
            const courseId = card.dataset.courseId;
            const details = courseDetails[courseId];

            if (details && courseModal) {
                courseModalTitle.innerText = details.title;
                courseModalDescription.innerText = details.description;
                openAnyModal(courseModal);
            }
        });
    });

    // 3. Lógica da Linha do Tempo (Acordeão) - CORRIGIDA
    document.querySelectorAll('.timeline-event-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content && content.classList.contains('timeline-event-content')) {
                
                // Fecha outros itens abertos para funcionar como um acordeão (opcional)
                const allContents = document.querySelectorAll('.timeline-event-content.active');
                allContents.forEach(item => {
                    if (item !== content) {
                        item.classList.remove('active');
                        item.style.maxHeight = null; // Reseta a altura
                        item.previousElementSibling.classList.remove('active');
                    }
                });

                // Alterna o estado do item clicado
                header.classList.toggle('active');
                content.classList.toggle('active');
                
                // CORREÇÃO: A lógica da animação foi melhorada.
                // Se o conteúdo estiver ativo, definimos a altura máxima para sua altura real de rolagem.
                // Se não, definimos a altura máxima como nula (ou '0'), permitindo a transição de fechamento.
                // Isso é mais robusto que uma altura fixa, pois se adapta a qualquer tamanho de conteúdo.
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });
});