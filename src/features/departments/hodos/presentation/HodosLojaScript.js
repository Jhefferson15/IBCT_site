import { initSharedUI, openAnyModal } from '../../../../../core/utils/SharedScript.js';
import { FirebaseProductRepository } from '../infrastructure/FirebaseProductRepository.js';
import { GetProductsUseCase } from '../domain/use_cases/GetProductsUseCase.js';

document.addEventListener('DOMContentLoaded', async () => {
    initSharedUI();

    const productRepo = new FirebaseProductRepository();
    const getProductsUseCase = new GetProductsUseCase(productRepo);

    // --- LÓGICA ESPECÍFICA DA PÁGINA DA LOJA ---

    const productGrid = document.querySelector('.product-grid');
    const productModal = document.getElementById('product-modal');
    const toast = document.getElementById('toast-notification');
    const formActionBtn = document.getElementById('form-action-btn');

    async function renderProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = '<p style="padding: 20px; text-align: center; width: 100%;">Carregando produtos...</p>';

        const products = await getProductsUseCase.execute('hodos');

        if (products.length === 0) {
            productGrid.innerHTML = '<p style="padding: 20px; text-align: center; width: 100%;">Nenhum produto disponível no momento.</p>';
            return;
        }

        productGrid.innerHTML = products.map(product => `
            <div class="product-card" 
                 data-title="${product.title}" 
                 data-price="${product.formattedPrice}" 
                 data-img="${product.img}"
                 data-desc="${product.desc}"
                 data-whatsapp-message="${product.whatsappMessage}">
                <div class="product-image">
                    <img src="${product.img}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <div class="product-price">${product.formattedPrice}</div>
                </div>
            </div>
        `).join('');

        // Re-vincula os listeners após renderizar
        attachProductClickListeners();
    }

    function attachProductClickListeners() {
        const productCards = document.querySelectorAll('.product-card');
        if (productCards.length > 0 && productModal) {
            const modalImg = document.getElementById('modal-product-img');
            const modalTitle = document.getElementById('modal-product-title');
            const modalDesc = document.getElementById('modal-product-desc');
            const modalPrice = document.getElementById('modal-product-price');
            const whatsappLink = document.getElementById('whatsapp-action-link');
            
            const pixBtn = document.getElementById('pix-action-btn');
            const pixInfo = document.getElementById('pix-info-details');

            productCards.forEach(card => {
                card.addEventListener('click', () => {
                    if (modalImg) modalImg.src = card.dataset.img;
                    if (modalTitle) modalTitle.innerText = card.dataset.title;
                    if (modalDesc) modalDesc.innerText = card.dataset.desc;
                    if (modalPrice) modalPrice.innerText = card.dataset.price;
                    
                    if (whatsappLink) {
                        whatsappLink.href = `https://wa.me/556196763258?text=${card.dataset.whatsappMessage}`;
                    }

                    if (pixInfo) pixInfo.style.display = 'none';

                    openAnyModal(productModal);
                });
            });

            if (pixBtn && pixInfo) {
                pixBtn.onclick = () => {
                    const isVisible = pixInfo.style.display === 'block';
                    pixInfo.style.display = isVisible ? 'none' : 'block';
                };
            }
        }
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
    
    if (formActionBtn) {
        formActionBtn.addEventListener('click', () => {
            showToast('Funcionalidade em breve!');
        });
    }

    // Inicializa a renderização
    await renderProducts();

    // --- LÓGICA DO BOTÃO DE COPIAR PIX NA PÁGINA PRINCIPAL ---
    const copyMainPixBtn = document.getElementById('copy-main-pix-btn');
    if (copyMainPixBtn) {
        const pixKeySpan = document.getElementById('main-page-pix-key');
        const originalText = copyMainPixBtn.querySelector('span').innerText;
        const originalIcon = copyMainPixBtn.querySelector('i').outerHTML;

        copyMainPixBtn.addEventListener('click', () => {
            if (pixKeySpan) {
                navigator.clipboard.writeText(pixKeySpan.innerText).then(() => {
                    copyMainPixBtn.querySelector('i').className = 'fas fa-check';
                    copyMainPixBtn.querySelector('span').innerText = 'Copiado!';
                    
                    setTimeout(() => {
                        copyMainPixBtn.querySelector('i').outerHTML = originalIcon;
                        copyMainPixBtn.querySelector('span').innerText = originalText;
                    }, 2500);
                });
            }
        });
    }
});



