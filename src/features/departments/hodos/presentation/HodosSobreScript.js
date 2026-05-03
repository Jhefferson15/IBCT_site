import { initSharedUI, openAnyModal } from '../../../../../core/utils/SharedScript.js';

document.addEventListener('DOMContentLoaded', () => {
    initSharedUI();

    // --- LÓGICA ESPECÍFICA DA PÁGINA SOBRE ---

    // 1. Lógica dos Pilares (Modal)
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
                if (pillarModalTitle) pillarModalTitle.innerText = details.title;
                if (pillarModalDescription) pillarModalDescription.innerText = details.description;
                openAnyModal(pillarModal);
            }
        });
    });

    // 2. Lógica da Linha do Tempo
    document.querySelectorAll('.timeline-event-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content && content.classList.contains('timeline-event-content')) {
                header.classList.toggle('active');
                content.classList.toggle('active');
            }
        });
    });
});



