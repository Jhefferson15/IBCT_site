document.addEventListener('DOMContentLoaded', () => {
    const instaSection = document.getElementById('instagram-feed');
    if (!instaSection) return;

    // --- 1. VARIÁVEIS E ELEMENTOS DO MÓDULO ---
    let allInstagramPosts = [], currentPostIndex = 0, isLoadingPosts = false;
    const postsPerBatch = 10;
    let instaObserver;
    let plyrPlayer = null;
    let currentCarousel = { baseName: '', imageCount: 0, currentIndex: 0 };

    const scroller = document.querySelector('.instagram-scroller');
    const prevInstaBtn = document.getElementById('prev-insta-btn');
    const nextInstaBtn = document.getElementById('next-insta-btn');

    const modalElements = {
        modal: document.getElementById('instagram-modal'),
        closeBtn: document.querySelector('#instagram-modal .modal-close'),
        mediaWrapper: document.querySelector('.insta-modal__media-wrapper'),
        caption: document.getElementById('insta-modal-caption'),
        likes: document.getElementById('insta-modal-likes'),
        comments: document.getElementById('insta-modal-comments'),
        date: document.getElementById('insta-modal-date'),
        link: document.getElementById('insta-modal-link'),
        prevBtn: document.getElementById('insta-modal-prev'),
        nextBtn: document.getElementById('insta-modal-next'),
        dotsContainer: document.querySelector('.insta-modal__dots')
    };


    // --- 2. SETUP DA ARQUITETURA: CONTÊINERES ISOLADOS ---
    const imageContainer = document.createElement('div');
    imageContainer.id = 'insta-modal-image-container';
    imageContainer.style.cssText = 'width:100%; height:100%; display:none; align-items:center; justify-content:center;';

    const videoContainer = document.createElement('div');
    videoContainer.id = 'insta-modal-video-container';
    // CORREÇÃO 1: Adicionado display flex para centralizar o vídeo
    videoContainer.style.cssText = 'width:100%; height:100%; display:none; align-items:center; justify-content:center;';
    
    const originalImage = document.getElementById('insta-modal-image');
    if (originalImage) imageContainer.appendChild(originalImage);

    const originalVideo = document.getElementById('insta-modal-video');
    if (originalVideo) originalVideo.parentNode.removeChild(originalVideo);

    modalElements.mediaWrapper.appendChild(imageContainer);
    modalElements.mediaWrapper.appendChild(videoContainer);

    // --- 3. DEFINIÇÃO DAS FUNÇÕES ---
    function openInstaModal() {
        modalElements.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeInstaModal() {
        modalElements.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        resetInstaModalState();
    }

    function resetInstaModalState() {
        if (plyrPlayer) {
            plyrPlayer.destroy();
            plyrPlayer = null;
        }
        videoContainer.innerHTML = '';
        const img = imageContainer.querySelector('img');
        if (img) {
            img.removeAttribute('src');
            img.style.display = 'none'; // CORREÇÃO 2: Garante que a imagem comece escondida
        }
        imageContainer.style.display = 'none';
        videoContainer.style.display = 'none';
    }
    
    function ensureCorrectMediaState(mediaToShow) {
        imageContainer.style.display = mediaToShow === 'image' ? 'flex' : 'none';
        videoContainer.style.display = mediaToShow === 'video' ? 'flex' : 'none';
    }

    function updateCarouselUI() {
        const { currentIndex, imageCount } = currentCarousel;
        modalElements.prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
        modalElements.nextBtn.style.display = currentIndex < imageCount - 1 ? 'block' : 'none';
        const dots = modalElements.dotsContainer.querySelectorAll('.insta-modal__dot');
        dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
    }

    function preloadCarouselImages() {
        const { baseName, currentIndex, imageCount } = currentCarousel;
        if (currentIndex + 1 < imageCount) {
            const nextImage = new Image();
            nextImage.src = `img/instagram/posts/${baseName}_${currentIndex + 2}.jpg`;
        }
    }

    function displayCarouselImage() {
        const img = imageContainer.querySelector('img');
        if (!img) return;
        img.style.display = 'block'; // CORREÇÃO 2: Garante que a imagem seja visível
        const imagePath = `img/instagram/posts/${currentCarousel.baseName}_${currentCarousel.currentIndex + 1}.jpg`;
        img.src = imagePath;
        updateCarouselUI();
        preloadCarouselImages();
    }
    
    function changeCarousel(direction) {
        const { currentIndex, imageCount } = currentCarousel;
        if (direction === 'next' && currentIndex < imageCount - 1) {
            currentCarousel.currentIndex++;
            displayCarouselImage();
        } else if (direction === 'prev' && currentIndex > 0) {
            currentCarousel.currentIndex--;
            displayCarouselImage();
        }
    }
    
    function openCustomInstaModal(post) {
        resetInstaModalState(); 
        
        const { 'Media ID': mediaId, 'User ID': userId, 'Is Video': isVideo, 'Is Carousel': isCarousel } = post;
        
        if (isCarousel === 'YES' && mediaId && userId) {
            currentCarousel = {
                baseName: `${mediaId}_${userId}`, currentIndex: 0,
                imageCount: (post['Image URLs'] || '').split('\n').filter(url => url.trim() !== '').length || 10
            };
            modalElements.dotsContainer.innerHTML = Array.from({ length: currentCarousel.imageCount }, () => `<div class="insta-modal__dot"></div>`).join('');
            modalElements.dotsContainer.style.display = 'flex';
            displayCarouselImage();
            ensureCorrectMediaState('image');
        
        } else if (mediaId && userId) {
            currentCarousel.imageCount = 0;
            modalElements.prevBtn.style.display = 'none';
            modalElements.nextBtn.style.display = 'none';
            modalElements.dotsContainer.style.display = 'none';
            const baseFilename = `${mediaId}_${userId}`;
            
            if (isVideo === 'YES') {
                const newVideo = document.createElement('video');
                newVideo.playsinline = true;
                newVideo.controls = true;
                newVideo.src = `img/instagram/posts/${baseFilename}.mp4`;
                videoContainer.appendChild(newVideo);
                plyrPlayer = new Plyr(newVideo, {
                    autoplay: true, muted: false,
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
                });
                ensureCorrectMediaState('video');
            } else { // Post de imagem única
                const img = imageContainer.querySelector('img');
                if (img) {
                    img.style.display = 'block'; // CORREÇÃO 2: Torna a imagem visível
                    img.src = `img/instagram/posts/${baseFilename}.jpg`;
                }
                ensureCorrectMediaState('image');
            }
        }
        
        modalElements.caption.innerHTML = post.Caption ? post.Caption.replace(/\n/g, '<br>') : '';
        modalElements.likes.textContent = post.Likes.toLocaleString('pt-BR');
        modalElements.comments.textContent = post.Comments.toLocaleString('pt-BR');
        modalElements.date.textContent = new Date(post['Date(GMT)']).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        modalElements.link.href = post['Post URL'];
        openInstaModal();
    }
    
    // --- 4. LÓGICA DE CARREGAMENTO DO FEED E EVENTOS (sem alterações) ---
    function renderPostBatch() {
        if (!scroller || isLoadingPosts) return;
        isLoadingPosts = true;
        const batch = allInstagramPosts.slice(currentPostIndex, currentPostIndex + postsPerBatch);
        const loader = scroller.querySelector('.loader-card');
        if (loader) loader.remove();
        batch.forEach(post => {
            const card = document.createElement('a');
            card.href = "#"; card.className = 'insta-card';
            const img = document.createElement('img');
            const mediaId = post['Media ID'], userId = post['User ID'];
            const isVideo = post['Is Video'] === 'YES', isCarousel = post['Is Carousel'] === 'YES';
            const remoteThumbnail = post['Thumbnail URL'];
            let finalImgSrc;
            if (isVideo) { finalImgSrc = remoteThumbnail; }
            else if (mediaId && userId) { finalImgSrc = `img/instagram/posts/${isCarousel ? `${mediaId}_${userId}_1.jpg` : `${mediaId}_${userId}.jpg`}`; }
            else { finalImgSrc = remoteThumbnail; }
            img.src = finalImgSrc;
            img.alt = post.Caption ? post.Caption.substring(0, 100) + '...' : 'Post do Instagram Hodos';
            img.loading = 'lazy';
            img.onerror = function() { if (this.src !== remoteThumbnail) { this.src = remoteThumbnail; } else { card.style.display = 'none'; } };
            card.appendChild(img);
            card.addEventListener('click', e => { e.preventDefault(); openCustomInstaModal(post); });
            if (isVideo) card.insertAdjacentHTML('beforeend', '<i class="fas fa-play insta-card-icon"></i>');
            else if (isCarousel) card.insertAdjacentHTML('beforeend', '<i class="fas fa-clone insta-card-icon"></i>');
            scroller.appendChild(card);
        });
        currentPostIndex += batch.length;
        if (currentPostIndex < allInstagramPosts.length) {
            const newLoader = document.createElement('div');
            newLoader.className = 'loader-card'; newLoader.innerHTML = '<div class="spinner"></div>';
            scroller.appendChild(newLoader);
            if (instaObserver) instaObserver.observe(newLoader);
        } else { if (instaObserver) instaObserver.disconnect(); }
        isLoadingPosts = false;
    }

    function setupIntersectionObserver() {
        const loader = document.querySelector('.loader-card');
        if (!loader) return;
        instaObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoadingPosts) renderPostBatch();
        }, { root: scroller, rootMargin: '0px 200px 0px 0px', threshold: 0.1 });
        instaObserver.observe(loader);
    }

    function populateInstagramFeed() {
        fetch('./tools/posts_instagram.json')
            .then(response => { if (!response.ok) throw new Error(`Erro: ${response.statusText}`); return response.json(); })
            .then(posts => {
                if(scroller) scroller.innerHTML = '';
                if (!posts || posts.length === 0) { if(scroller) scroller.innerHTML = `<p class="insta-loading-message">Nenhum post encontrado.</p>`; return; }
                allInstagramPosts = posts;
                currentPostIndex = 0;
                const loader = document.createElement('div');
                loader.className = 'loader-card'; loader.innerHTML = '<div class="spinner"></div>';
                if(scroller) scroller.appendChild(loader);
                renderPostBatch();
                setupIntersectionObserver();
            })
            .catch(error => { console.error("Falha ao carregar posts do Instagram:", error); if(scroller) scroller.innerHTML = `<p class="insta-loading-message">Não foi possível carregar os posts.</p>`; });
    }

    if (prevInstaBtn && nextInstaBtn && scroller) {
        const scrollAmount = (280 + 20) * 2;
        prevInstaBtn.addEventListener('click', () => scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        nextInstaBtn.addEventListener('click', () => scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    }
    if(modalElements.closeBtn) modalElements.closeBtn.addEventListener('click', closeInstaModal);
    if(modalElements.nextBtn) modalElements.nextBtn.addEventListener('click', () => changeCarousel('next'));
    if(modalElements.prevBtn) modalElements.prevBtn.addEventListener('click', () => changeCarousel('prev'));
    
    let touchStartX = 0, touchEndX = 0;
    const swipeThreshold = 50; 
    if(modalElements.mediaWrapper) {
        modalElements.mediaWrapper.addEventListener('touchstart', e => { if (currentCarousel.imageCount > 1) touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        modalElements.mediaWrapper.addEventListener('touchend', e => {
            if (currentCarousel.imageCount > 1) {
                touchEndX = e.changedTouches[0].screenX;
                if (Math.abs(touchEndX - touchStartX) > swipeThreshold) { if (touchEndX < touchStartX) changeCarousel('next'); else changeCarousel('prev'); }
            }
        });
    }

    populateInstagramFeed();
});