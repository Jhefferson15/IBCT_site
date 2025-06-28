// js/quiz_atos_16_data.js

const romanRoadsData = {
    via_sebaste: {
        name: 'Via Sebaste',
        color: '#E53935', // Vermelho
        path: [[30.8533, 36.9583], [30.4939, 37.2411], [30.496, 37.510], [31.1894, 38.3072]],
        cities: [
            { ancientName: 'Perge', modernName: 'Aksu/Antalya', coords: [30.8533, 36.9583] },
            { ancientName: 'Comama', modernName: 'Ürkütlü', coords: [30.4939, 37.2411] },
            { ancientName: 'Cremna', modernName: 'Çamlık', coords: [30.496, 37.510] },
            { ancientName: 'Antiochia Pisidia', modernName: 'Yalvaç', coords: [31.1894, 38.3072] }
        ]
    },
    maritime_route: {
        name: 'Rota Marítima (Trôade a Neápolis)',
        color: '#1E88E5', // Azul
        path: [[26.2386, 39.9575], [25.510, 40.475], [24.411, 40.938]], // Trôade -> Samotrácia -> Neápolis (Corrigido para [lon, lat])
        cities: [
            { ancientName: 'Trôade', modernName: 'Dalyan', coords: [26.2386, 39.9575] },
            { ancientName: 'Samotrácia', modernName: 'Samothrace', coords: [25.510, 40.475] },
            { ancientName: 'Neápolis', modernName: 'Kavala', coords: [24.411, 40.938] }
        ]
    },
    via_egnatia: {
        name: 'Via Egnácia',
        color: '#43A047', // Verde
        path: [[19.4544, 41.3139], [20.8021, 41.1231], [21.3323, 41.0287], [22.9444, 40.6401], [23.8436, 40.8236], [24.2858, 41.0128], [24.411, 40.938], [28.9784, 41.0082]],
        cities: [
            { ancientName: 'Dyrrachium', modernName: 'Durrës', coords: [19.4544, 41.3139] },
            { ancientName: 'Lychnidos', modernName: 'Ohrid', coords: [20.8021, 41.1231] },
            { ancientName: 'Heraclea Lyncestis', modernName: 'Bitola', coords: [21.3323, 41.0287] },
            { ancientName: 'Thessalonica', modernName: 'Tessalônica', coords: [22.9444, 40.6401] },
            { ancientName: 'Amphipolis', modernName: 'Anfípolis', coords: [23.8436, 40.8236] },
            { ancientName: 'Philippi', modernName: 'Filipos', coords: [24.2858, 41.0128] },
            { ancientName: 'Neapolis', modernName: 'Kavala', coords: [24.411, 40.938] },
            { ancientName: 'Byzantium', modernName: 'Istambul', coords: [28.9784, 41.0082] }
        ]
    },
    via_apia_original: {
        name: 'Via Ápia (Original)', color: '#FDD835', // Amarelo
        path: [[12.4923, 41.8902], [14.253, 41.106], [14.777, 41.131], [17.240, 40.471], [17.942, 40.632]],
        cities: [ { ancientName: 'Roma', modernName: 'Roma', coords: [12.4923, 41.8902] }, { ancientName: 'Capua', modernName: 'S. M. Capua Vetere', coords: [14.253, 41.106] }, { ancientName: 'Beneventum', modernName: 'Benevento', coords: [14.777, 41.131] }, { ancientName: 'Tarentum', modernName: 'Taranto', coords: [17.240, 40.471] }, { ancientName: 'Brundisium', modernName: 'Brindisi', coords: [17.942, 40.632] } ]
    },
    via_apia_traiana: {
        name: 'Via Ápia Traiana', color: '#FFA726', // Laranja
        path: [[14.777, 41.131], [16.066, 41.216], [16.866, 41.116], [17.942, 40.632]],
        cities: [ { ancientName: 'Beneventum', modernName: 'Benevento', coords: [14.777, 41.131] }, { ancientName: 'Canusium', modernName: 'Canosa di Puglia', coords: [16.066, 41.216] }, { ancientName: 'Barium', modernName: 'Bari', coords: [16.866, 41.116] }, { ancientName: 'Brundisium', modernName: 'Brindisi', coords: [17.942, 40.632] } ]
    },
    via_claudia_augusta: {
        name: 'Via Cláudia Augusta', color: '#8E24AA', // Roxo
        path: [[12.385, 45.508], [11.1211, 46.0679], [10.8978, 48.3707]],
        cities: [ { ancientName: 'Altinum', modernName: 'Altino', coords: [12.385, 45.508] }, { ancientName: 'Tridentum', modernName: 'Trento', coords: [11.1211, 46.0679] }, { ancientName: 'Augusta Vindelicorum', modernName: 'Augsburg', coords: [10.8978, 48.3707] } ]
    }
};

const quizData = [
    // --- NÍVEL FÁCIL ---
    {
        verseRef: "Atos 16:14",
        verseText: "E uma certa mulher, chamada Lídia, vendedora de púrpura, da cidade de Tiatira, e que servia a Deus, nos ouvia...",
        media: { type: 'image', src: 'https://i.imgur.com/r6tM0J.jpg', alt: 'Molusco Murex, fonte da púrpura.' },
        prompt: "Quem foi a primeira pessoa convertida na Europa, conforme o relato em Filipos?",
        alternatives: ["A jovem com espírito de Píton", "O carcereiro de Filipos", "Lídia, a vendedora de púrpura", "Silas, companheiro de Paulo"],
        correctAnswerIndex: 2,
        difficulty: "Fácil",
        explanation: "Lídia, uma mulher de negócios da cidade de Tiatira, foi a primeira convertida documentada na missão de Paulo na Europa. Sua casa se tornou a base para a igreja em Filipos."
    },
    {
        verseRef: "Atos 16:25-26",
        verseText: "Pela meia-noite, Paulo e Silas oravam e cantavam hinos a Deus... De repente, sobreveio um terremoto tão grande que os alicerces do cárcere se moveram...",
        media: { type: 'image', src: 'https://i.imgur.com/gK9pZkH.jpg', alt: 'Estrutura identificada como a prisão em Filipos.'},
        prompt: "O que aconteceu de extraordinário enquanto Paulo e Silas estavam na prisão?",
        alternatives: ["Um anjo apareceu e os libertou", "Houve um grande terremoto que abriu as portas", "Os outros prisioneiros se rebelaram", "Os magistrados se arrependeram e os soltaram"],
        correctAnswerIndex: 1,
        difficulty: "Fácil",
        explanation: "O texto descreve um terremoto milagroso que abalou a prisão, abrindo todas as portas e soltando as correntes de todos os prisioneiros, o que levou à conversão do carcereiro."
    },
    // --- NÍVEL NORMAL ---
    {
        verseRef: "Atos 16:12",
        verseText: "...e dali para Filipos, que é a primeira cidade daquela parte da Macedônia, e é uma colônia...",
        media: { type: 'image', src: 'https://i.imgur.com/gU9lX8q.jpg', alt: 'Ruínas do Fórum de Filipos.' },
        prompt: "Lucas destaca que Filipos era uma 'colônia' romana. Qual era a principal implicação desse status para seus habitantes?",
        alternatives: ["Eles eram obrigados a servir no exército romano.", "Eles possuíam cidadania romana e se orgulhavam de seus costumes latinos.", "Eles não pagavam impostos ao império.", "A cidade era governada diretamente por um parente do imperador."],
        correctAnswerIndex: 1,
        difficulty: "Normal",
        explanation: "Uma colônia romana era um posto avançado de cultura e lei romana. Seus cidadãos livres geralmente possuíam cidadania romana, o que lhes conferia direitos e privilégios especiais. Isso explica a acusação em 16:21 sobre 'costumes não lícitos a nós, romanos'."
    },
    {
        verseRef: "Atos 16:9-12",
        verseText: "E, de noite, apareceu a Paulo uma visão... E, logo depois desta visão, procuramos partir para a Macedônia... e dali para Filipos...",
        media: { type: 'map', config: { displayRoutes: ['via_sebaste', 'maritime_route', 'via_egnatia'], markers: [{ coords: [31.1894, 38.3072], routeId: 'via_sebaste', popup: 'Antioquia da Pisídia' }, { coords: [26.2386, 39.9575], routeId: 'maritime_route', popup: 'Trôade' }, { coords: [24.2858, 41.0128], routeId: 'via_egnatia', popup: 'Filipos' }] }},
        prompt: "A jornada de Paulo envolveu rotas terrestres e marítimas. Observando o mapa, qual via principal ele usou ao chegar na Macedônia e ir para Filipos?",
        alternatives: ["Via Sebaste (vermelha)", "Via Ápia (amarela)", "Via Egnácia (verde)", "Rota Marítima (azul)"],
        correctAnswerIndex: 2,
        difficulty: "Normal",
        explanation: "Após desembarcar em Neápolis, o porto da região, Paulo e seus companheiros viajaram pela Via Egnácia, a principal estrada romana que cruzava a Macedônia, para chegar a Filipos."
    },
    // --- NÍVEL AVANÇADO ---
    {
        verseRef: "Atos 16:20-21",
        verseText: "Estes homens, sendo judeus, perturbam a nossa cidade, e nos expõem costumes que não nos é lícito receber nem praticar, visto que somos romanos.",
        media: { type: 'image', src: 'https://i.imgur.com/gU9lX8q.jpg', alt: 'Ruínas do Fórum de Filipos.'},
        prompt: "A acusação contra Paulo e Silas é uma peça de retórica legal. Qual análise, baseada na lei e sociedade romana, explica melhor sua eficácia perante os magistrados?",
        alternatives: ["A acusação era fraca, pois o Judaísmo era uma 'religio licita' (religião permitida).", "Ela conectou xenofobia ('sendo judeus') à ameaça à ordem ('perturbam a cidade') e à violação da identidade cívica ('costumes não lícitos a nós, romanos').", "O problema principal era a falta de uma licença comercial para pregar.", "A acusação focava na blasfêmia contra os deuses gregos, um crime capital."],
        correctAnswerIndex: 1,
        difficulty: "Avançado",
        explanation: "A força da acusação não estava em um único ponto, mas na fusão de preconceito, política e lei. Ao destacar a identidade 'judaica' (estrangeira) versus a 'romana' (cívica), e alegar perturbação da paz, os acusadores criaram um cenário onde os magistrados se sentiram pressionados a agir."
    },
    {
        verseRef: "Atos 16:14",
        verseText: "E uma certa mulher, chamada Lídia, vendedora de púrpura, da cidade de Tiatira...",
        media: { type: 'image', src: 'https://i.imgur.com/r6tM0J.jpg', alt: 'Molusco Murex, fonte do corante púrpura.' },
        prompt: "Plínio, o Velho, em 'História Natural', descreve o preço da púrpura como 'valendo seu peso em prata'. Como essa informação extra-bíblica redefine nossa compreensão de Lídia?",
        alternatives: [ "Ela era pobre, vendendo imitações baratas de púrpura.", "Ela pertencia a uma guilda que detinha o monopólio religioso da venda de púrpura.", "Confirma seu status como uma empresária de elite, com capital e conexões internacionais, tornando sua casa uma base estratégica para a missão.", "Sugere que seu negócio era ilegal, pois o uso de púrpura era restrito por lei apenas a senadores e ao imperador."],
        correctAnswerIndex: 2,
        difficulty: "Avançado",
        explanation: "Fontes como Plínio confirmam que o comércio de púrpura era de altíssimo luxo. Isso eleva Lídia de 'vendedora' para uma patrona rica e influente. Sua conversão foi um ganho logístico e financeiro massivo para a igreja na Europa, oferecendo um local seguro e recursos."
    },
    // --- NÍVEL ESPECIALISTA ---
    {
        verseRef: "Atos 16:16",
        verseText: "...uma jovem, que tinha um espírito de Píton (pneuma pythona)...",
        media: { type: 'image', src: 'https://i.imgur.com/JzS1W1J.jpg', alt: 'Ruínas do Templo de Apolo em Delfos.'},
        prompt: "A expressão 'pneuma pythona' é uma referência técnica ao culto de Apolo em Delfos. Se a libertação da jovem é uma confrontação direta com este culto, qual a implicação teológica mais profunda?",
        alternatives: ["Paulo estava tentando purificar o culto de Apolo de seus elementos demoníacos.", "O poder de Cristo é superior não a um 'demônio' qualquer, mas a uma das mais influentes instituições religiosas do mundo greco-romano.", "A jovem era uma sacerdotisa oficial enviada por Delfos para espionar Paulo.", "Todos os casos de adivinhação no NT estão, na verdade, ligados a Delfos."],
        correctAnswerIndex: 1,
        difficulty: "Especialista",
        explanation: "Ao usar uma terminologia tão específica, Lucas enquadra o evento não como um incidente local, mas como uma batalha cósmica. O poder manifesto em Jesus demonstra autoridade sobre as forças espirituais que sustentavam o próprio coração da religião e política grega. É uma declaração de soberania."
    },
    {
        verseRef: "Atos 16:37",
        verseText: "Mas Paulo replicou: Açoitaram-nos publicamente e, sem sermos condenados, sendo homens romanos...",
        media: { type: 'image', src: 'https://i.imgur.com/gK9pZkH.jpg', alt: 'Prisão em Filipos.'},
        prompt: "A Lex Valeria e a Lex Porcia protegiam cidadãos romanos. Qual direito fundamental, articulado por Cícero em 'Contra Verres', os magistrados violaram, crime que poderia encerrar suas carreiras?",
        alternatives: ["O direito a um julgamento por um júri de seus pares.", "O direito de não ser preso dentro dos limites da cidade (pomerium).", "O direito de apelação ao imperador (provocatio) e a imunidade contra açoitamento sumário (verberatio).", "O direito a ter um advogado fornecido pelo estado."],
        correctAnswerIndex: 2,
        difficulty: "Especialista",
        explanation: "Cícero famosamente bradou que as palavras 'Civis Romanus sum' ('Eu sou um cidadão romano') deveriam parar qualquer ação. O açoitamento (verberatio) de um cidadão sem julgamento e sem a chance de apelar (provocatio) era uma ofensa gravíssima. Paulo usou isso para forçar uma retratação pública que legitimou a presença cristã."
    }
];
