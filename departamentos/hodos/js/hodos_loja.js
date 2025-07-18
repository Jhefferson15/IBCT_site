// --- SCRIPT PARA A PÁGINA DA LOJA (hodos_loja.html) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMPARTILHADA (Pode ser usada em várias páginas) ---

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


    // --- LÓGICA ESPECÍFICA DA PÁGINA DA LOJA ---

    const productCards = document.querySelectorAll('.product-card');
    const productModal = document.getElementById('product-modal');
    
    // MUDANÇA: Lógica do Toast
    const toast = document.getElementById('toast-notification');
    const formActionBtn = document.getElementById('form-action-btn');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000); // O toast some após 3 segundos
    }
    
    if(formActionBtn) {
        formActionBtn.addEventListener('click', () => {
            showToast('Funcionalidade em breve!');
        });
    }
    // FIM DA LÓGICA DO TOAST


    if (productCards.length > 0 && productModal) {
        const modalImg = document.getElementById('modal-product-img');
        const modalTitle = document.getElementById('modal-product-title');
        const modalDesc = document.getElementById('modal-product-desc');
        const modalPrice = document.getElementById('modal-product-price');
        const whatsappLink = document.getElementById('whatsapp-action-link');
        
        const pixBtn = document.getElementById('pix-action-btn');
        const pixInfo = document.getElementById('pix-info-details');
        const copyPixBtn = document.getElementById('copy-pix-key-btn');
        const pixKeySpan = document.getElementById('pix-key');

        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.dataset.title;
                const price = card.dataset.price;
                const imgSrc = card.dataset.img;
                const desc = card.dataset.desc;

                modalImg.src = imgSrc;
                modalTitle.innerText = title;
                modalDesc.innerText = desc;
                modalPrice.innerText = price;
                
                const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no produto: *${title}*. Poderia me passar mais informações?`);
                // SUBSTITUA O NÚMERO ABAIXO PELO NÚMERO DO RESPONSÁVEL
                whatsappLink.href = `https://wa.me/556196763258?text=${whatsappMessage}`;

                pixInfo.style.display = 'none';

                openAnyModal(productModal);
            });
        });

        if (pixBtn) {
            pixBtn.addEventListener('click', () => {
                const isVisible = pixInfo.style.display === 'block';
                pixInfo.style.display = isVisible ? 'none' : 'block';
            });
        }

        if (copyPixBtn) {
            copyPixBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(pixKeySpan.innerText).then(() => {
                    copyPixBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyPixBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                }).catch(err => {
                    console.error('Falha ao copiar a chave PIX: ', err);
                });
            });
        }
    }
});
    // --- LÓGICA DO BOTÃO DE COPIAR PIX NA PÁGINA PRINCIPAL ---
    const copyMainPixBtn = document.getElementById('copy-main-pix-btn');
    if (copyMainPixBtn) {
        const pixKeySpan = document.getElementById('main-page-pix-key');
        const originalText = copyMainPixBtn.querySelector('span').innerText;
        const originalIcon = copyMainPixBtn.querySelector('i').outerHTML;

        copyMainPixBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(pixKeySpan.innerText).then(() => {
                copyMainPixBtn.querySelector('i').className = 'fas fa-check';
                copyMainPixBtn.querySelector('span').innerText = 'Copiado!';
                
                setTimeout(() => {
                    copyMainPixBtn.querySelector('i').outerHTML = originalIcon;
                    copyMainPixBtn.querySelector('span').innerText = originalText;
                }, 2500); // Volta ao normal após 2.5 segundos
            }).catch(err => {
                console.error('Falha ao copiar a chave PIX da página: ', err);
                copyMainPixBtn.querySelector('span').innerText = 'Erro!';
            });
        });
    }