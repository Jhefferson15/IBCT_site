document.addEventListener('DOMContentLoaded', () => {

    // --- 0. LÓGICA DO CALENDÁRIO ---
    // (Esta seção permanece inalterada)
    const specificEvents = {
        "2025-04-13": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-04-27": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-05-18": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-05-25": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-01": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-08": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-15": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-22": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-29": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-07-06": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
    };
    function generateRecurringEvents(year) {
        const recurringEvents = {};
        const addEvent = (date, event) => {
            const dateStr = date.toISOString().slice(0, 10);
            if (!recurringEvents[dateStr]) recurringEvents[dateStr] = [];
            recurringEvents[dateStr].push(event);
        };
        for (let m = 0; m < 12; m++) {
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const currentDate = new Date(year, m, d);
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek === 0) { addEvent(currentDate, { type: 'culto', time: '10:30', title: 'Culto Matutino' }); addEvent(currentDate, { type: 'culto', time: '18:00', title: 'Culto Noturno' }); }
                if (dayOfWeek === 3) { addEvent(currentDate, { type: 'oracao', time: '20:00', title: 'Culto de Oração' }); }
            }
        }
        return recurringEvents;
    }
    const allEvents = { ...generateRecurringEvents(2025) };
    Object.keys(specificEvents).forEach(date => {
        if (!allEvents[date]) allEvents[date] = [];
        allEvents[date].push(...specificEvents[date]);
    });
    
    // --- LÓGICA DA LOGO ANIMADA (CORRIGIDA PARA USAR VALORES ORIGINAIS EM PIXELS) ---
    function initializeAnimatedLogo() {
        const logoLayer = document.getElementById('animated-logo-container');
        if (!logoLayer) return;
        
        logoLayer.innerHTML = `
            <div id="logo-animation-wrapper">
                <span class="top-text text-element animatable">IGREJA BATISTA</span>
                <span class="bottom-text text-element animatable">DE TAGUATINGA</span>
                <div class="central-word">
                    <span class="letter-c text-element animatable" data-group="left">C</span><span class="letter-e text-element animatable" data-group="left">E</span><span class="letter-n text-element animatable" data-group="left">N</span>
                    <span class="letter-r text-element animatable" data-group="right">R</span><span class="letter-a text-element animatable" data-group="right">A</span><span class="letter-l text-element animatable" data-group="right">L</span>
                </div>
                <div class="cross animatable"><div class="cross-h"></div><div class="cross-v"></div></div>
                <svg class="shape-svg" id="logo-svg" preserveAspectRatio="xMidYMid meet"><path id="variable-ellipse" class="animatable"></path></svg>
            </div>
        `;

        const logoWrapper = document.getElementById('logo-animation-wrapper');

        // --- MUDANÇA CRÍTICA: Configuração revertida para os valores originais em PIXELS ---
        const finalConfig = {
            global: { mainColor: '#FFFFFF', width: 980, height: 580 }, // Cor alterada para branco
            animations: {
                ellipse:    { type: 'zoom-in', duration: 1.2, delay: 0.2 },
                cross:      { type: 'zoom-in', duration: 1.0, delay: 0.6 },
                topText:    { type: 'slide-in-down', duration: 0.8, delay: 1.1 },
                centralText:{ duration: 0.8, delay: 1.4, stagger: 0.1 },
                bottomText: { type: 'slide-in-up', duration: 0.8, delay: 1.1 },
                loop: {
                    cross:   { enabled: true,  duration: 4.0, delay: 3.2, distance: 25 },
                }
            },
            ellipse: { rx: 336, ry: 154, rotation: -23, minThickness: 3, maxThickness: 29, numPoints: 85 },
            cross: { left: 369, top: 67, width: 270, height: 363, v_thick: 35, h_thick: 35, h_pos: 25 }, // h_pos é %, o resto é px
            central: { fontSize: 190, letterSpacing: 21, gap: 59, top: 177, left: 35, letterOffsets: [0, 130, 240, 435, 545, 660] },
            topText: { fontSize: 36, letterSpacing: 2, top: 156, left: 19 },
            bottomText: { fontSize: 35, letterSpacing: 1, bottom: 145, right: 41 },
        };
        
        const animatableElements = Array.from(logoWrapper.querySelectorAll('.animatable'));
        
        function playAnimations() {
            animatableElements.forEach(el => { el.style.animation = 'none'; el.style.opacity = '0'; el.style.transform = ''; });
            void logoWrapper.offsetWidth;
            const a = finalConfig.animations;
            
            applyAnimation(logoWrapper.querySelector('#variable-ellipse'), a.ellipse, true);
            applyAnimation(logoWrapper.querySelector('.cross'), a.cross);
            applyAnimation(logoWrapper.querySelector('.top-text'), a.topText);
            applyAnimation(logoWrapper.querySelector('.bottom-text'), a.bottomText);

            const centralConfig = a.centralText;
            logoWrapper.querySelectorAll('.central-word .text-element[data-group="left"]').forEach((letter, i) => {
                applyAnimation(letter, { ...centralConfig, type: 'slide-out-left', delay: centralConfig.delay + i * centralConfig.stagger });
            });
            logoWrapper.querySelectorAll('.central-word .text-element[data-group="right"]').forEach((letter, i) => {
                applyAnimation(letter, { ...centralConfig, type: 'slide-out-right', delay: centralConfig.delay + i * centralConfig.stagger });
            });
            
            if (a.loop.cross.enabled) {
                const cross = logoWrapper.querySelector('.cross');
                setTimeout(() => {
                    cross.style.opacity = '1';
                    cross.style.animation = `anim-cross-bob ${a.loop.cross.duration}s ease-in-out infinite`;
                }, a.loop.cross.delay * 1000);
            }
        }
        
        function applyAnimation(element, animConfig, isEllipse = false) {
            if (!element) return;
            let animationShorthand = `anim-${animConfig.type} ${animConfig.duration}s ease-out ${animConfig.delay}s forwards`;
            if (isEllipse) {
                const fillAnimation = `anim-fill 0.5s ease-out ${animConfig.delay + animConfig.duration}s forwards`;
                animationShorthand += `, ${fillAnimation}`;
            }
            element.style.animation = animationShorthand;
        }

        // --- MUDANÇA CRÍTICA: Lógica de estilos revertida para aplicar PX corretamente ---
        function updateStaticStyles() {
            const cfg = finalConfig;
            const applyStyles = (selector, styles) => { const el = logoWrapper.querySelector(selector); if (el) Object.assign(el.style, styles); };
            
            applyStyles('.top-text', { fontSize: cfg.topText.fontSize + 'px', letterSpacing: cfg.topText.letterSpacing + 'px', top: cfg.topText.top + 'px', left: cfg.topText.left + 'px' });
            applyStyles('.bottom-text', { fontSize: cfg.bottomText.fontSize + 'px', letterSpacing: cfg.bottomText.letterSpacing + 'px', bottom: cfg.bottomText.bottom + 'px', right: cfg.bottomText.right + 'px' });
            
            const { fontSize, letterSpacing, top, left, letterOffsets, gap } = cfg.central;
            logoWrapper.querySelectorAll('.central-word span').forEach((letter, i) => {
                const group = letter.dataset.group;
                const baseOffset = group === 'left' ? i : i - 3;
                let finalLeft = left + letterOffsets[i] + (baseOffset * letterSpacing);
                if (group === 'right') finalLeft += gap;
                
                Object.assign(letter.style, { left: finalLeft + 'px', fontSize: fontSize + 'px', top: top + 'px' });
                letter.style.transformOrigin = group === 'left' ? 'right center' : 'left center';
            });

            const c = cfg.cross;
            applyStyles('.cross', { top: c.top + 'px', left: c.left + 'px', width: c.width + 'px', height: c.height + 'px' });
            applyStyles('.cross-h', { height: c.h_thick + 'px', top: c.h_pos + '%', width: '100%' });
            applyStyles('.cross-v', { width: c.v_thick + 'px', left: `calc(50% - ${c.v_thick / 2}px)`, height: '100%' });
            
            createVariableEllipse();
        }

        function createVariableEllipse() {
            const pathElement = logoWrapper.querySelector('#variable-ellipse');
            const svgElement = logoWrapper.querySelector('#logo-svg');
            const { global, ellipse } = finalConfig;
            svgElement.setAttribute('viewBox', `0 0 ${global.width} ${global.height}`);
            const { rx, ry, rotation, minThickness, maxThickness, numPoints } = ellipse;
            const CX = global.width / 2, CY = global.height / 2;
            const rotationRad = rotation * (Math.PI / 180), outerPoints = [], innerPoints = [];
            for (let i = 0; i <= numPoints; i++) {
                const angle = (i / numPoints) * 2 * Math.PI, baseX = rx * Math.cos(angle), baseY = ry * Math.sin(angle);
                const rotatedX = baseX * Math.cos(rotationRad) - baseY * Math.sin(rotationRad), rotatedY = baseX * Math.sin(rotationRad) + baseY * Math.cos(rotationRad);
                const finalX = CX + rotatedX, finalY = CY + rotatedY;
                const thickness = minThickness + (finalY / global.height) * (maxThickness - minThickness);
                let normalX = ry * Math.cos(angle), normalY = rx * Math.sin(angle);
                const len = Math.sqrt(normalX*normalX + normalY*normalY) || 1;
                normalX /= len; normalY /= len;
                const rotatedNormalX = normalX * Math.cos(rotationRad) - normalY * Math.sin(rotationRad), rotatedNormalY = normalX * Math.sin(rotationRad) + normalY * Math.cos(rotationRad);
                outerPoints.push({ x: finalX + rotatedNormalX * thickness / 2, y: finalY + rotatedNormalY * thickness / 2 });
                innerPoints.push({ x: finalX - rotatedNormalX * thickness / 2, y: finalY - rotatedNormalY * thickness / 2 });
            }
            pathElement.setAttribute('d', `M ${outerPoints.map(p => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')} L ${innerPoints.reverse().map(p => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')} Z`);
        }
        
        updateStaticStyles();
        playAnimations();
    }
    initializeAnimatedLogo();


    // --- 1. LÓGICA DO MENU HAMBÚRGUER ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
        document.body.classList.toggle('modal-open');
    });

    // --- 2. LÓGICA DOS MODAIS ---
    const infoModal = document.getElementById('info-modal');
    const calendarModal = document.getElementById('calendar-modal');
    function openAnyModal(modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
    function closeAnyModal(modal) { modal.classList.remove('active'); if (!navLinks.classList.contains('active')) document.body.classList.remove('modal-open'); }
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', e => closeAnyModal(e.target.closest('.modal-overlay'))));

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

    // --- 3. LÓGICA DO WIDGET DE PRÓXIMOS EVENTOS ---
    function populateNextEvents() {
        const listContainer = document.getElementById('next-events-list');
        if (!listContainer) return;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const futureEvents = Object.entries(allEvents)
            .filter(([dateStr]) => new Date(dateStr + 'T00:00:00') >= today)
            .flatMap(([dateStr, events]) => events.map(event => ({ ...event, date: new Date(dateStr + 'T00:00:00') })))
            .sort((a, b) => a.date - b.date);
        const next4Events = futureEvents.slice(0, 4);
        if(next4Events.length === 0) {
            listContainer.innerHTML = '<p>Nenhum evento agendado em breve.</p>'; return;
        }
        listContainer.innerHTML = next4Events.map(event => {
            const day = event.date.getDate();
            const month = event.date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            return `<div class="event-item-widget"><div class="date"><span>${String(day).padStart(2, '0')}</span><small>${month}</small></div><div class="info"><strong>${event.title}</strong><span>${event.time}</span></div></div>`;
        }).join('');
    }
    populateNextEvents();

    // --- 4. LÓGICA DO CALENDÁRIO COMPLETO (MODAL) ---
    document.getElementById('open-calendar-btn').addEventListener('click', () => {
        currentDateCalendar = new Date(); renderCalendar(); openAnyModal(calendarModal);
    });
    let currentDateCalendar = new Date();
    const monthYearEl = document.getElementById('month-year'),
          calendarDaysEl = document.getElementById('calendar-days'),
          eventDetailsEl = document.getElementById('event-details'),
          eventDetailsTitle = document.getElementById('event-details-title');
    const eventIcons = { ebd: 'fa-solid fa-book-open', culto: 'fa-solid fa-cross', curso: 'fa-solid fa-graduation-cap', oracao: 'fa-solid fa-hands-praying', evento: 'fa-solid fa-star' };
    function renderCalendar() {
        const month = currentDateCalendar.getMonth(), year = currentDateCalendar.getFullYear();
        monthYearEl.textContent = `${currentDateCalendar.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
        calendarDaysEl.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();
        for (let i = firstDay; i > 0; i--) calendarDaysEl.innerHTML += `<div class="day-cell prev-next-month-day">${prevLastDate - i + 1}</div>`;
        for (let i = 1; i <= lastDate; i++) {
            const today = new Date();
            let classes = 'day-cell';
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) classes += ' current-day';
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (allEvents[dateStr]) classes += ' event-day';
            const dayCell = document.createElement('div');
            dayCell.className = classes;
            dayCell.textContent = i;
            dayCell.onclick = () => showEventsForDate(dateStr, dayCell);
            calendarDaysEl.appendChild(dayCell);
        }
        const today = new Date();
        if (month === today.getMonth() && year === today.getFullYear()) {
            const todayCell = calendarDaysEl.querySelector('.current-day');
            if (todayCell) setTimeout(() => todayCell.click(), 100);
        } else {
             eventDetailsTitle.textContent = 'Eventos do Dia';
             eventDetailsEl.innerHTML = '<p>Selecione um dia para ver os eventos.</p>';
        }
    }
    function showEventsForDate(dateStr, cell) {
        document.querySelectorAll('.day-cell.selected-day').forEach(c => c.classList.remove('selected-day'));
        cell.classList.add('selected-day');
        const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        eventDetailsTitle.textContent = `Eventos de ${formattedDate}`;
        const events = allEvents[dateStr];
        if (events && events.length > 0) {
            eventDetailsEl.innerHTML = events.sort((a,b) => a.time.localeCompare(b.time)).map(event => `
                <div class="event-item"><div class="event-icon"><i class="${eventIcons[event.type] || 'fa-solid fa-calendar-day'}"></i></div><div class="event-info"><strong>${event.title}</strong><span>${event.time}</span></div></div>`).join('');
        } else {
            eventDetailsEl.innerHTML = '<p>Nenhum evento agendado para este dia.</p>';
        }
    }
    document.getElementById('prev-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() - 1); renderCalendar(); });
    document.getElementById('next-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() + 1); renderCalendar(); });

    // --- 5. BOTÃO VOLTAR AO TOPO & ANIMAÇÃO DE SCROLL ---
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    const observerFadeIn = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observerFadeIn.observe(el));
});
