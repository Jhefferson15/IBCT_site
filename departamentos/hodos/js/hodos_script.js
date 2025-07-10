document.addEventListener('ibct-api-ready', () => {

    // --- LÓGICA COMPARTILHADA (Menu, Modais, Scroll, Fade) - sem mudanças ---
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

    let plyrPlayer = null;
    function openAnyModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }
    
    function closeAnyModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            if (modal.id === 'instagram-modal') {
                resetInstaModalState(); // Garante a limpeza do modal do insta
            } else {
                const iframe = modal.querySelector('iframe');
                if (iframe) iframe.src = "";
            }
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay')));
    });
    
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


    // --- LÓGICA ESPECÍFICA DA PÁGINA HODOS (sem mudanças) ---
    function parseDate(dateString) { if (!dateString || typeof dateString !== 'string' || !dateString.includes('-')) return null; return new Date(dateString + "T00:00:00"); }
    let showingFutureEvents = true;
    function renderEventsCarousel(filter) { const lessonsScroller = document.querySelector('.lessons-scroller'); if (!lessonsScroller) return; lessonsScroller.innerHTML = ''; const allHodosEvents = window.IBCT_EVENTS_API.getEvents({ filter: 'hodos', displayIn: 'carousel' }); const today = new Date(); today.setHours(0, 0, 0, 0); const filteredEvents = allHodosEvents.filter(event => { if (event.recurring) return filter === 'future'; const eventDate = parseDate(event.date); if (!eventDate) return false; return filter === 'future' ? eventDate >= today : eventDate < today; }); if (filteredEvents.length === 0) { lessonsScroller.innerHTML = `<p style="padding: 20px; text-align: center; width: 100%;">Nenhum evento ${filter === 'future' ? 'futuro' : 'passado'} encontrado.</p>`; return; } filteredEvents.forEach(event => { const card = document.createElement('div'); card.className = 'event-card'; if (event.cardClass) card.classList.add(event.cardClass); Object.keys(event).forEach(key => { if(event[key] !== undefined && typeof event[key] !== 'object') card.dataset[key] = event[key]; }); const cardImageContent = event.cardContentHTML || event.type.toUpperCase(); const imageContainerClass = event.cardContentHTML ? "lesson-card-image special-content-container" : "lesson-card-image"; card.innerHTML = `<div class="${imageContainerClass}">${cardImageContent}</div><div class="lesson-card-content"><span class="date-value">${event.date}</span><h3>${event.title}</h3></div>`; lessonsScroller.appendChild(card); }); addModalListeners(); }
    function addModalListeners() { document.querySelectorAll('.event-card').forEach(card => { if (card.dataset.externalPage) { card.addEventListener('click', () => openEventModal(card.dataset)); } }); }
    function openEventModal(dataset) { if (dataset.externalPage) { const externalPageModal = document.getElementById('external-page-modal'); const iframe = document.getElementById('modal-iframe'); if(externalPageModal && iframe) { iframe.src = dataset.externalPage; openAnyModal(externalPageModal); } } }

    // --- LÓGICA DO INSTAGRAM PROFISSIONAL (REFEITA) ---

    let currentCarousel = { baseName: '', imageCount: 0, currentIndex: 0 };
    const modalElements = {
        modal: document.getElementById('instagram-modal'),
        image: document.getElementById('insta-modal-image'),
        video: document.getElementById('insta-modal-video'),
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

    function resetInstaModalState() {
        if (plyrPlayer) {
            plyrPlayer.destroy();
            plyrPlayer = null;
        }
        modalElements.video.style.display = 'none';
        modalElements.image.style.display = 'none';
        modalElements.video.src = '';
        modalElements.image.src = '';
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
        const imagePath = `img/instagram/posts/${currentCarousel.baseName}_${currentCarousel.currentIndex + 1}.jpg`;
        modalElements.image.src = imagePath;
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
        if (!modalElements.modal) return;

        const { 'Media ID': mediaId, 'User ID': userId, 'Is Video': isVideo, 'Is Carousel': isCarousel } = post;
        
        if (isCarousel === 'YES' && mediaId && userId) {
            currentCarousel = {
                baseName: `${mediaId}_${userId}`,
                currentIndex: 0,
                imageCount: (post['Image URLs'] || '').split('\n').filter(url => url.trim() !== '').length || 10
            };
            modalElements.image.style.display = 'block';
            modalElements.dotsContainer.innerHTML = Array.from({ length: currentCarousel.imageCount }, () => `<div class="insta-modal__dot"></div>`).join('');
            modalElements.dotsContainer.style.display = 'flex';
            displayCarouselImage();
        } else if (mediaId && userId) {
            currentCarousel.imageCount = 0; // Não é carrossel
            modalElements.prevBtn.style.display = 'none';
            modalElements.nextBtn.style.display = 'none';
            modalElements.dotsContainer.style.display = 'none';
            const baseFilename = `${mediaId}_${userId}`;
            if (isVideo === 'YES') {
                modalElements.video.src = `img/instagram/posts/${baseFilename}.mp4`;
                modalElements.video.style.display = 'block';
                plyrPlayer = new Plyr('#insta-modal-video', {
                    autoplay: true, muted: true,
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
                });
            } else {
                modalElements.image.src = `img/instagram/posts/${baseFilename}.jpg`;
                modalElements.image.style.display = 'block';
            }
        }
        
        modalElements.caption.innerHTML = post.Caption ? post.Caption.replace(/\n/g, '<br>') : '';
        modalElements.likes.textContent = post.Likes.toLocaleString('pt-BR');
        modalElements.comments.textContent = post.Comments.toLocaleString('pt-BR');
        modalElements.date.textContent = new Date(post['Date(GMT)']).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        modalElements.link.href = post['Post URL'];
        openAnyModal(modalElements.modal);
    }
    
    // Controles do carrossel e Swipe
    modalElements.nextBtn.addEventListener('click', () => changeCarousel('next'));
    modalElements.prevBtn.addEventListener('click', () => changeCarousel('prev'));
    
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // min pixels para ser um swipe

    modalElements.mediaWrapper.addEventListener('touchstart', e => {
        if (currentCarousel.imageCount > 1) touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modalElements.mediaWrapper.addEventListener('touchend', e => {
        if (currentCarousel.imageCount > 1) {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance < 0) changeCarousel('next');
                else changeCarousel('prev');
            }
        }
    });

    // --- LÓGICA DE CARREGAMENTO DINÂMICO DO INSTAGRAM ---
    let allInstagramPosts = [], currentPostIndex = 0, isLoadingPosts = false;
    const postsPerBatch = 10;
    let instaObserver;

    // =============================================================
    // ========= INÍCIO DA SEÇÃO CORRIGIDA =========================
    // =============================================================
    function renderPostBatch() {
        const scroller = document.querySelector('.instagram-scroller');
        if (!scroller || isLoadingPosts) return;
        isLoadingPosts = true;

        const batch = allInstagramPosts.slice(currentPostIndex, currentPostIndex + postsPerBatch);
        const loader = scroller.querySelector('.loader-card');
        if (loader) loader.remove();
        
        batch.forEach(post => {
            const card = document.createElement('a');
            card.href = "#";
            card.className = 'insta-card';
            
            const img = document.createElement('img');
            const mediaId = post['Media ID'], userId = post['User ID'];
            const isVideo = post['Is Video'] === 'YES';
            const isCarousel = post['Is Carousel'] === 'YES';
            const remoteThumbnail = post['Thumbnail URL'];

            let finalImgSrc;

            if (isVideo) {
                // Para vídeos, SEMPRE usar a thumbnail remota.
                finalImgSrc = remoteThumbnail;
            } else if (mediaId && userId) {
                // Para imagens e carrosséis, tentar a versão local primeiro.
                const baseFilename = `${mediaId}_${userId}`;
                finalImgSrc = `img/instagram/posts/${isCarousel ? `${baseFilename}_1.jpg` : `${baseFilename}.jpg`}`;
            } else {
                // Fallback final se não houver IDs.
                finalImgSrc = remoteThumbnail;
            }

            img.src = finalImgSrc;
            img.alt = post.Caption ? post.Caption.substring(0, 100) + '...' : 'Post do Instagram Hodos';
            img.loading = 'lazy';
            
            // Validação de Mídia Melhorada
            img.onerror = function() {
                // Se a tentativa atual (local ou remota) falhar...
                if (this.src !== remoteThumbnail) {
                    // ...e não for a thumbnail remota, tente a thumbnail remota como fallback.
                    this.src = remoteThumbnail;
                } else {
                    // Se até a thumbnail remota falhar, o post é inválido. Oculte e registre.
                    console.error(`Falha ao carregar thumbnail local e remoto para o post ID ${mediaId}. Ocultando card. URL: ${this.src}`);
                    card.style.display = 'none';
                }
            };

            card.appendChild(img);
            card.addEventListener('click', e => { e.preventDefault(); openCustomInstaModal(post); });
            if (isVideo) card.insertAdjacentHTML('beforeend', '<i class="fas fa-play insta-card-icon"></i>');
            else if (isCarousel) card.insertAdjacentHTML('beforeend', '<i class="fas fa-clone insta-card-icon"></i>');
            scroller.appendChild(card);
        });
        
        currentPostIndex += batch.length;
        if (currentPostIndex < allInstagramPosts.length) {
            const newLoader = document.createElement('div');
            newLoader.className = 'loader-card';
            newLoader.innerHTML = '<div class="spinner"></div>';
            scroller.appendChild(newLoader);
            if (instaObserver) instaObserver.observe(newLoader);
        } else {
            if (instaObserver) instaObserver.disconnect();
        }
        isLoadingPosts = false;
    }
    // =============================================================
    // ========= FIM DA SEÇÃO CORRIGIDA ============================
    // =============================================================

    function setupIntersectionObserver() {
        const loader = document.querySelector('.loader-card');
        if (!loader) return;
        instaObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoadingPosts) {
                renderPostBatch();
            }
        }, { root: document.querySelector('.instagram-scroller'), threshold: 0.1 });
        instaObserver.observe(loader);
    }

    function populateInstagramFeed() {
        const scroller = document.querySelector('.instagram-scroller');
        if (!scroller) return;
        fetch('./tools/posts_instagram.json')
            .then(response => { if (!response.ok) throw new Error(`Erro: ${response.statusText}`); return response.json(); })
            .then(posts => {
                scroller.innerHTML = '';
                if (!posts || posts.length === 0) {
                    scroller.innerHTML = `<p class="insta-loading-message">Nenhum post encontrado.</p>`;
                    return;
                }
                allInstagramPosts = posts;
                currentPostIndex = 0;
                
                const loader = document.createElement('div');
                loader.className = 'loader-card';
                loader.innerHTML = '<div class="spinner"></div>';
                scroller.appendChild(loader);
                
                renderPostBatch();
                if(window.innerWidth > 768) { // Observador só faz sentido no scroll horizontal
                    setupIntersectionObserver();
                }
            })
            .catch(error => {
                console.error("Falha ao carregar posts do Instagram:", error);
                if(scroller) scroller.innerHTML = `<p class="insta-loading-message">Não foi possível carregar os posts.</p>`;
            });
    }

    // --- INICIALIZAÇÃO ---
    const lessonsWrapper = document.querySelector('.lessons-wrapper');
    if (lessonsWrapper) {
        const toggleBtn = document.getElementById('toggle-events-btn'); const eventsTitle = document.getElementById('events-title'); const prevBtn = document.getElementById('prev-btn'); const nextBtn = document.getElementById('next-btn'); const scroller = lessonsWrapper.querySelector('.lessons-scroller');
        toggleBtn.addEventListener('click', () => { showingFutureEvents = !showingFutureEvents; eventsTitle.textContent = showingFutureEvents ? 'Nossos Próximos Encontros' : 'Eventos que já Aconteceram'; toggleBtn.textContent = showingFutureEvents ? 'Ver Eventos Passados' : 'Ver Próximos Eventos'; renderEventsCarousel(showingFutureEvents ? 'future' : 'past'); });
        prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -330, behavior: 'smooth' })); nextBtn.addEventListener('click', () => scroller.scrollBy({ left: 330, behavior: 'smooth' }));
        renderEventsCarousel('future');
    }
    const instaScroller = document.querySelector('.instagram-scroller');
    if (instaScroller) {
        const prevInstaBtn = document.getElementById('prev-insta-btn'); const nextInstaBtn = document.getElementById('next-insta-btn'); const scrollAmount = 280 + 20;
        prevInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' })); nextInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
        populateInstagramFeed();
    }
    function populateNextHodosEvents() {
        const listContainer = document.getElementById('next-events-list'); if (!listContainer) return;
        const hodosWidgetEvents = window.IBCT_EVENTS_API.getEvents({ filter: 'hodos', displayIn: 'widget' }); const today = new Date(); today.setHours(0, 0, 0, 0); const futureEvents = hodosWidgetEvents .map(event => ({ ...event, dateObj: parseDate(event.date) })) .filter(event => event.dateObj && event.dateObj >= today) .sort((a, b) => a.dateObj - b.dateObj); const next4Events = futureEvents.slice(0, 4); if(next4Events.length === 0) { listContainer.innerHTML = '<p>Nenhum evento do Hodos agendado em breve.</p>'; return; }
        listContainer.innerHTML = next4Events.map(event => { const day = String(event.dateObj.getDate()).padStart(2, '0'); const month = event.dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''); return ` <div class="event-item-widget"> <div class="date"> <span>${day}</span> <small>${month}</small> </div> <div class="info"> <strong>${event.title}</strong> <span>${event.location}</span> </div> </div>`; }).join('');
    }
    populateNextHodosEvents();

});