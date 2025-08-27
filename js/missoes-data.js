
const missoesData = [
    {
        id: "badalona",
        title: "Igreja Batista de Badalona - Espanha",
        subtitle: "Um farol de fé na Catalunha",
        image: "https://scontent.fbsb4-1.fna.fbcdn.net/v/t39.30808-6/481765224_1779997519208138_7472684503529784857_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGUoRqTb9aesgDtMIFS53-zTvcvCXq6IyFO9y8JerojITMm-hxBCo_kmkP5p3tf7qXs5nWV6gMfmsqWQeT1RKuR&_nc_ohc=6q58WNlLXDEQ7kNvwFIbCJw&_nc_oc=Adm0FRUcZUJJVNh7dLr6wYz1NCMrZhrLuotrG_DA_dz7puUa_kXtUjoIUpCC87cpVD8&_nc_zt=23&_nc_ht=scontent.fbsb4-1.fna&_nc_gid=BY6pB10hcQd2zaX-n-pZEQ&oh=00_AfWCMe05x41WObupv_lF6M19VU5YZnd22w5VM5V9pohwZw&oe=68B4E332", // Placeholder, idealmente uma imagem da igreja
        shortDescription: "Apoiamos a revitalização de uma igreja centenária em Badalona, Espanha, liderada pelo Pr. Cláudio Ferreira, missionário enviado pela IBCT.",
        detailedDescription: `
            <p>A Igreja Batista de Badalona, localizada na Catalunha, Espanha, é um projeto missionário de grande importância para a IBCT. Liderada pelo Pastor Cláudio Ferreira, missionário brasileiro enviado por nossa igreja, e sua esposa Érica Ferreira (que trabalhou por 18 anos na administração da IBCT), esta igreja centenária tem passado por um notável processo de revitalização.</p>
            <h3>Histórico e Revitalização:</h3>
            <ul>
                <li><strong>Igreja Centenária:</strong> Recentemente celebrou 100 anos de existência.</li>
                <li><strong>Templo:</strong> Construído há 70 anos por missionários americanos, com capacidade para cerca de 300 pessoas.</li>
                <li><strong>Situação Anterior (2019):</strong> Quando o Pr. Cláudio chegou, a igreja estava em declínio, com apenas 18 membros (a maioria idosos) e sem batismos há 8 anos.</li>
                <li><strong>Situação Atual (Após 5 anos):</strong> A frequência cresceu para 65-70 pessoas aos domingos. Foram realizados 11 batismos nos últimos 4 anos, e mais 3 candidatos já foram aprovados.</li>
                <li><strong>Multiculturalidade:</strong> A congregação é hoje multicultural, com membros de diversas nacionalidades, incluindo catalães, espanhóis, hondurenhos, peruanos, colombianos, salvadorenhos e letões.</li>
            </ul>
            <h3>Contexto e Desafios:</h3>
            <ul>
                <li><strong>Bilinguismo e Identidade Cultural:</strong> A igreja atua na Catalunha, onde se fala espanhol e catalão, em meio a um forte movimento de independência. O pastor enfatiza que "a nossa bandeira é Cristo".</li>
                <li><strong>Secularismo Europeu:</strong> A Europa é um campo missionário desafiador, com grande ceticismo e rejeição direta ao Evangelho. O trabalho exige equilíbrio entre o estudo da Palavra e a fé no poder de Deus.</li>
            </ul>
            <h3>Reconhecimento e Visão:</h3>
            <ul>
                <li><strong>Reconhecimento Oficial:</strong> A igreja recebeu uma placa da prefeitura de Badalona em reconhecimento aos seus 100 anos de contribuição à cidade.</li>
                <li><strong>Visão:</strong> O Pr. Cláudio ora para que a igreja seja um "farol" para o bairro e a cidade, onde Cristo seja claramente reconhecido.</li>
            </ul>
            <p>A IBCT se orgulha de apoiar esta obra, sabendo que cada oferta e oração contribuem para o avanço do Reino de Deus em um dos campos mais desafiadores do mundo.</p>
        `,
        stats: [
            { number: "100+", label: "Anos de História" },
            { number: "11", label: "Batismos (últimos 4 anos)" },
            { number: "65-70", label: "Membros Ativos" }
        ],
        link: "https://www.facebook.com/esglesiabaptistabadalona", // Exemplo de link externo
        linkText: "Visitar Facebook da Igreja"
    },
    {
        id: "projeto-viver",
        title: "Projeto Viver",
        subtitle: "Ação social que serve nossa comunidade",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1740",
        shortDescription: "Iniciativa da IBCT que distribui cestas básicas, roupas e oferece apoio espiritual a famílias em vulnerabilidade em Taguatinga.",
        detailedDescription: `
            <p>O Projeto Viver é uma iniciativa de ação social da IBCT que visa servir a comunidade local em Taguatinga e arredores. Regularmente, distribuímos cestas básicas, roupas e oferecemos apoio espiritual e emocional para famílias em situação de vulnerabilidade. Nosso objetivo é ser as mãos e os pés de Jesus, demonstrando o amor de Deus de forma prática.</p>
            <p>Através de doações e do trabalho voluntário de nossos membros, conseguimos alcançar centenas de famílias, levando não apenas auxílio material, mas também esperança e a mensagem do Evangelho.</p>
            <h3>Como Você Pode Ajudar:</h3>
            <ul>
                <li><strong>Doações:</strong> Aceitamos alimentos não perecíveis, roupas em bom estado, produtos de higiene pessoal e brinquedos.</li>
                <li><strong>Voluntariado:</strong> Junte-se à nossa equipe para ajudar na organização, distribuição e no contato com as famílias.</li>
                <li><strong>Oração:</strong> Ore por este projeto, pelas famílias atendidas e pelos voluntários.</li>
            </ul>
            <p>Sua contribuição faz a diferença na vida de muitas pessoas!</p>
        `,
        stats: [
            { number: "120+", label: "Famílias Atendidas" },
            { number: "50+", label: "Voluntários" },
            { number: "R$ 15.000+", label: "Arrecadados em 2024" }
        ],
        link: null, // Sem link externo específico
        linkText: null
    },
    {
        id: "ibct-em-acao",
        title: "IBCT em Ação - Rio Grande do Sul",
        subtitle: "Solidariedade e apoio às vítimas das enchentes",
        image: "../img/sobre/ibct_em_acao.jpg",
        shortDescription: "Campanha de mobilização da IBCT para arrecadar doações e enviar equipes de voluntários para auxiliar as vítimas das enchentes no Rio Grande do Sul.",
        detailedDescription: `
            <p>Em resposta às enchentes que devastaram o estado do Rio Grande do Sul, a IBCT mobilizou a campanha 'IBCT em Ação'. Arrecadamos toneladas de doações, incluindo alimentos, água, roupas e produtos de higiene, que foram enviados para as áreas mais afetadas. Além disso, enviamos equipes de voluntários para ajudar na limpeza, reconstrução e para oferecer apoio e aconselhamento às vítimas.</p>
            <p>Esta iniciativa demonstrou o poder da união e da solidariedade da nossa comunidade em momentos de crise. Agradecemos a todos que contribuíram com doações, tempo e orações para fazer a diferença na vida de nossos irmãos gaúchos.</p>
            <h3>Resultados da Campanha:</h3>
            <ul>
                <li><strong>Doações:</strong> Mais de X toneladas de alimentos, água e suprimentos.</li>
                <li><strong>Voluntários:</strong> Y equipes enviadas para apoio direto.</li>
                <li><strong>Impacto:</strong> Ajuda direta a Z comunidades afetadas.</li>
            </ul>
            <p>Continuamos orando pelo Rio Grande do Sul e buscando formas de oferecer suporte contínuo.</p>
        `,
        stats: [], // Sem estatísticas específicas para este exemplo
        link: "https://www.instagram.com/p/C7dIBaZJDbw/?img_index=1",
        linkText: "Ver no Instagram"
    }
];
