document.addEventListener('DOMContentLoaded', () => {
    const instaSection = document.getElementById('instagram-feed');
    if (!instaSection) return;

    // --- 1. VARIÁVEIS E ELEMENTOS DO MÓDULO ---
    let allInstagramPosts = [], currentPostIndex = 0, isLoadingPosts = false;
    const postsPerBatch = 10;
    let instaObserver;
    let plyrPlayer = null;
    let currentCarousel = { post: null, imageUrls: [], currentIndex: 0, imageCount: 0 };

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
    videoContainer.style.cssText = 'width:100%; height:100%; display:none; align-items:center; justify-content:center;';
    
    const originalImage = document.getElementById('insta-modal-image');
    if (originalImage) imageContainer.appendChild(originalImage);

    const originalVideo = document.getElementById('insta-modal-video');
    if (originalVideo && originalVideo.parentNode) {
        originalVideo.parentNode.removeChild(originalVideo);
    }

    modalElements.mediaWrapper.appendChild(imageContainer);
    modalElements.mediaWrapper.appendChild(videoContainer);

    // --- 3. DEFINIÇÃO DAS FUNÇÕES ---

    function getLocalMediaPath(post, forVideo = false, carouselIndex = -1) {
        const userName = post['User Name'];
        let remoteUrl;

        if (carouselIndex > -1) {
            const urls = post['Image URLs'].split('\n').filter(u => u.trim() !== '');
            remoteUrl = urls[carouselIndex] || post['Thumbnail URL'];
        } else if (forVideo) {
            remoteUrl = post['Video URL'];
        } else {
            remoteUrl = post['Thumbnail URL'];
        }

        if (!remoteUrl) {
            return 'img/instagram/posts/placeholder.jpg';
        }

        try {
            const url = new URL(remoteUrl);
            const filename = url.pathname.split('/').pop();
            return `img/instagram/posts/${userName}_${filename}`;
        } catch (e) {
            console.error("Error parsing URL:", remoteUrl, e);
            return 'img/instagram/posts/placeholder.jpg';
        }
    }


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
            img.style.display = 'none';
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
        const { post, currentIndex, imageCount } = currentCarousel;
        if (currentIndex + 1 < imageCount) {
            const nextImage = new Image();
            nextImage.src = getLocalMediaPath(post, false, currentIndex + 1);
        }
    }

    function displayCarouselImage() {
        const img = imageContainer.querySelector('img');
        if (!img) return;

        const { post, currentIndex } = currentCarousel;
        const imagePath = getLocalMediaPath(post, false, currentIndex);

        img.style.display = 'block';
        img.src = imagePath;
        img.onerror = () => {
            const urls = post['Image URLs'].split('\n').filter(u => u.trim() !== '');
            img.src = urls[currentIndex] || post['Thumbnail URL'];
        };
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
        
        const { 'Is Video': isVideo, 'Is Carousel': isCarousel } = post;
        
        if (isCarousel === 'YES') {
            const imageUrls = (post['Image URLs'] || '').split('\n').filter(url => url.trim() !== '');
            currentCarousel = {
                post: post,
                imageUrls: imageUrls,
                currentIndex: 0,
                imageCount: imageUrls.length
            };

            modalElements.dotsContainer.innerHTML = Array.from({ length: currentCarousel.imageCount }, () => `<div class="insta-modal__dot"></div>`).join('');
            modalElements.dotsContainer.style.display = 'flex';
            displayCarouselImage();
            ensureCorrectMediaState('image');
        
        } else { 
            currentCarousel.imageCount = 0;
            modalElements.prevBtn.style.display = 'none';
            modalElements.nextBtn.style.display = 'none';
            modalElements.dotsContainer.style.display = 'none';
            
            if (isVideo === 'YES') {
                const videoSrc = getLocalMediaPath(post, true);
                const newVideo = document.createElement('video');
                newVideo.playsinline = true;
                newVideo.controls = true;
                newVideo.src = videoSrc;
                newVideo.onerror = () => { newVideo.src = post['Video URL']; };
                videoContainer.appendChild(newVideo);
                plyrPlayer = new Plyr(newVideo, {
                    autoplay: true, muted: false,
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
                });
                ensureCorrectMediaState('video');
            } else { 
                const img = imageContainer.querySelector('img');
                if (img) {
                    img.style.display = 'block';
                    const imgSrc = getLocalMediaPath(post, false);
                    img.src = imgSrc;
                    img.onerror = () => { img.src = post['Thumbnail URL']; };
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
    
    // --- 4. LÓGICA DE CARREGAMENTO DO FEED E EVENTOS ---
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
            const { 'User Name': userName, 'Is Video': isVideo, 'Is Carousel': isCarousel, 'Thumbnail URL': remoteThumbnail } = post;
            
            const finalImgSrc = getLocalMediaPath(post, false);

            img.src = finalImgSrc;
            img.alt = post.Caption ? post.Caption.substring(0, 100) + '...' : `Post do Instagram ${userName}`;
            img.loading = 'lazy';
            img.onerror = function() { 
                if (this.src !== remoteThumbnail) { 
                    this.src = remoteThumbnail; 
                } else { 
                    card.style.display = 'none'; 
                } 
            };
            card.appendChild(img);
            card.addEventListener('click', e => { e.preventDefault(); openCustomInstaModal(post); });
            if (isVideo === 'YES') card.insertAdjacentHTML('beforeend', '<i class="fas fa-play insta-card-icon"></i>');
            else if (isCarousel === 'YES') card.insertAdjacentHTML('beforeend', '<i class="fas fa-clone insta-card-icon"></i>');
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
