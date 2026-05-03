import { initSharedUI } from '../../../core/utils/SharedScript.js';
import { FirebaseAboutRepository } from '../../../core/infrastructure/repositories/FirebaseAboutRepository.js';
import { GetAboutDataUseCase } from '../../../core/domain/use_cases/GetAboutDataUseCase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // --- LÓGICA COMPARTILHADA (Menu, Tema, Scroll-to-top, Fade-in) ---
    initSharedUI();

    // --- LÓGICA ESPECÍFICA DA PÁGINA "SOBRE IBCT" ---
    const aboutRepository = new FirebaseAboutRepository();
    const getAboutDataUseCase = new GetAboutDataUseCase(aboutRepository);
    
    let aboutData = {
        courses: [],
        leadership: [],
        timeline: []
    };

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

    const courseModal = document.getElementById('course-modal');
    const courseModalTitle = document.getElementById('course-modal-title');
    const courseModalDescription = document.getElementById('course-modal-description');

    // 2. Lógica de Carregamento e Renderização
    try {
        aboutData = await getAboutDataUseCase.execute();
        
        // Se o repositório estiver vazio, podemos manter os placeholders do HTML ou logar
        if (aboutData.courses.length > 0) {
            renderCourses(aboutData.courses);
        }
        
        if (aboutData.timeline.length > 0) {
            renderTimeline(aboutData.timeline);
        }
        
        if (aboutData.leadership.length > 0) {
            renderLeadership(aboutData.leadership);
        }
    } catch (error) {
        console.error("Erro ao carregar dados 'Sobre':", error);
    }

    function renderCourses(courses) {
        const ufGrid = document.querySelector('.uf-grid');
        if (!ufGrid) return;
        
        ufGrid.innerHTML = '';
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'uf-card';
            card.dataset.courseId = course.id;
            card.innerHTML = `
                <i class="${course.icon} uf-icon"></i>
                <h3>${course.title}</h3>
                <p>${course.description.substring(0, 100)}...</p>
            `;
            card.addEventListener('click', () => {
                if (courseModal) {
                    courseModalTitle.innerText = course.title;
                    courseModalDescription.innerText = course.description;
                    openAnyModal(courseModal);
                }
            });
            ufGrid.appendChild(card);
        });
    }

    function renderLeadership(leadership) {
        const leadersGrid = document.querySelector('.lideres-grid');
        if (!leadersGrid) return;
        
        leadersGrid.innerHTML = '';
        leadership.forEach(leader => {
            const card = document.createElement('div');
            card.className = 'lider-card';
            card.innerHTML = `
                <img src="${leader.image}" alt="Foto de ${leader.name}">
                <h3>${leader.name}</h3>
                <p class="lider-role">${leader.role}</p>
                <p class="lider-bio">${leader.bio}</p>
            `;
            leadersGrid.appendChild(card);
        });
    }

    function renderTimeline(timeline) {
        const timelineContainer = document.querySelector('.timeline');
        if (!timelineContainer) return;
        
        timelineContainer.innerHTML = '';
        timeline.forEach(item => {
            const event = document.createElement('div');
            event.className = 'timeline-event';
            event.innerHTML = `
                <div class="timeline-event-header">
                    <h3>${item.title}</h3><span class="timeline-date">${item.date}</span>
                </div>
                <div class="timeline-event-content">
                    <p>${item.content}</p>
                </div>
            `;
            
            const header = event.querySelector('.timeline-event-header');
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                
                // Fecha outros itens abertos
                document.querySelectorAll('.timeline-event-content.active').forEach(openContent => {
                    if (openContent !== content) {
                        openContent.classList.remove('active');
                        openContent.style.maxHeight = null;
                        openContent.previousElementSibling.classList.remove('active');
                    }
                });

                header.classList.toggle('active');
                content.classList.toggle('active');
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
            
            timelineContainer.appendChild(event);
        });
    }
});



