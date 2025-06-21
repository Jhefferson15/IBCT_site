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
        path: [[39.9575, 26.2386], [40.475, 25.510], [24.411, 40.938]], // Trôade -> Samotrácia -> Neápolis
        cities: [
            { ancientName: 'Trôade', modernName: 'Dalyan', coords: [39.9575, 26.2386] },
            { ancientName: 'Samotrácia', modernName: 'Samothrace', coords: [40.475, 25.510] },
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
        name: 'Via Ápia (Original)',
        color: '#FDD835', // Amarelo
        path: [[12.4923, 41.8902], [12.671, 41.767], [13.243, 41.285], [13.426, 41.356], [13.606, 41.258], [13.766, 41.241], [13.883, 41.100], [14.253, 41.106], [14.777, 41.131], [15.811, 40.973], [17.240, 40.471], [17.633, 40.500], [17.942, 40.632]],
        cities: [
            { ancientName: 'Roma', modernName: 'Roma', coords: [12.4923, 41.8902] },
            { ancientName: 'Capua', modernName: 'S. M. Capua Vetere', coords: [14.253, 41.106] },
            { ancientName: 'Beneventum', modernName: 'Benevento', coords: [14.777, 41.131] },
            { ancientName: 'Tarentum', modernName: 'Taranto', coords: [17.240, 40.471] },
            { ancientName: 'Brundisium', modernName: 'Brindisi', coords: [17.942, 40.632] }
        ]
    },
     via_apia_traiana: {
        name: 'Via Ápia Traiana',
        color: '#FFA726', // Laranja
        path: [[14.777, 41.131], [15.300, 41.366], [15.716, 41.316], [16.066, 41.216], [16.866, 41.116], [17.383, 40.883], [17.942, 40.632]],
        cities: [
            { ancientName: 'Beneventum', modernName: 'Benevento', coords: [14.777, 41.131] },
            { ancientName: 'Canusium', modernName: 'Canosa di Puglia', coords: [16.066, 41.216] },
            { ancientName: 'Barium', modernName: 'Bari', coords: [16.866, 41.116] },
            { ancientName: 'Brundisium', modernName: 'Brindisi', coords: [17.942, 40.632] }
        ]
    },
    via_claudia_augusta: {
        name: 'Via Cláudia Augusta',
        color: '#8E24AA', // Roxo
        path: [[12.385, 45.508], [11.9059, 46.019], [11.1211, 46.0679], [11.4323, 46.8929], [10.8978, 48.3707], [10.784, 48.710]],
        cities: [
            { ancientName: 'Altinum', modernName: 'Altino', coords: [12.385, 45.508] },
            { ancientName: 'Tridentum', modernName: 'Trento', coords: [11.1211, 46.0679] },
            { ancientName: 'Augusta Vindelicorum', modernName: 'Augsburg', coords: [10.8978, 48.3707] }
        ]
    }
};

const quizData = [
    {
        verseRef: "Atos 16:6-12",
        verseText: "E, passando pela Frígia e pela província da Galácia, foram impedidos pelo Espírito Santo de anunciar a palavra na Ásia... E de noite apareceu a Paulo uma visão... E, logo depois desta visão, procuramos partir para a Macedônia... e dali para Filipos...",
        media: {
            type: 'map',
            config: {
                provider: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                // Chaves das rotas definidas em romanRoadsData que devem ser exibidas
                displayRoutes: ['via_sebaste', 'maritime_route', 'via_egnatia', 'via_apia_original', 'via_apia_traiana', 'via_claudia_augusta'],
                // Marcadores específicos para esta pergunta (serão coloridos com base na rota associada)
                markers: [
                    { coords: [31.1894, 38.3072], routeId: 'via_sebaste', popup: '<b>Antioquia da Pisídia:</b> Paulo percorre a região da Galácia (Via Sebaste).' },
                    { coords: [39.9575, 26.2386], routeId: 'maritime_route', popup: '<b>Trôade:</b> Ponto da visão e partida para a Europa.' },
                    { coords: [24.2858, 41.0128], routeId: 'via_egnatia', popup: '<b>Filipos:</b> Destino na Macedônia, sobre a Via Egnácia.' }
                ]
            }
        },
        prompt: "A jornada de Paulo em Atos 16:6-12 envolve duas fases distintas: uma terrestre frustrada na Ásia Menor e uma marítima/terrestre decisiva para a Europa. Com base no mapa e no conhecimento das rotas romanas, qual combinação descreve corretamente a infraestrutura usada?",
        alternatives: [
            "Ele usou a Via Ápia (amarela/laranja) para atravessar a Ásia e a Via Egnácia (verde) para chegar a Filipos.",
            "A jornada na Ásia foi pela Via Sebaste (vermelha), seguida pela rota marítima (azul) até Neápolis, e então um curto trajeto pela Via Egnácia (verde) até Filipos.",
            "Ele viajou pela Via Cláudia Augusta (roxa) até Trôade e depois pegou um barco direto para Filipos.",
            "A jornada inteira, tanto na Ásia quanto na Macedônia, foi feita pela Via Egnácia (verde)."
        ],
        correctAnswerIndex: 1,
        difficulty: "Avançado",
        explanation: "A Via Sebaste era a principal rede de estradas na província da Galácia, onde Paulo foi 'impedido de pregar'. A Via Egnácia era a grande artéria que ligava o Mar Adriático a Bizâncio, passando por Filipos. A resposta correta exige a identificação de ambas as vias em suas respectivas regiões geográficas, conectadas pela rota marítima."
    },
    {
        verseRef: "Atos 16:20-21",
        verseText: "E, apresentando-os aos magistrados, disseram: Estes homens, sendo judeus, perturbam a nossa cidade, e nos expõem costumes que não nos é lícito receber nem praticar, visto que somos romanos.",
        media: {
            type: 'image',
            src: 'https://i.imgur.com/gU9lX8q.jpg', // Ruínas do Fórum de Filipos
            alt: 'Ruínas do Fórum (Ágora) de Filipos, onde a acusação pública ocorreu.'
        },
        prompt: "A acusação contra Paulo e Silas é uma peça de retórica legal. Qual análise, baseada na lei e sociedade romana, explica melhor sua eficácia perante os magistrados de uma colônia?",
        alternatives: [
            "A acusação era fraca, pois o Judaísmo era uma 'religio licita' (religião permitida) e os magistrados sabiam disso.",
            "Ela habilmente conectou xenofobia ('sendo judeus'), com a ameaça à ordem pública ('perturbam a cidade') e a violação da identidade cívica ('costumes não lícitos a nós, romanos'), tornando a intervenção uma necessidade política.",
            "O problema principal era a falta de uma licença comercial para pregar, algo que os donos da escrava poderiam ter facilmente provado.",
            "A acusação focava na blasfêmia contra os deuses gregos, especialmente Apolo, o que era um crime capital em Filipos."
        ],
        correctAnswerIndex: 1,
        difficulty: "Avançado",
        explanation: "A força da acusação não estava em um único ponto, mas na fusão de preconceito, política e lei. Ao destacar a identidade 'judaica' (estrangeira) versus a 'romana' (cívica), e alegar perturbação da paz, os acusadores criaram um cenário onde os magistrados se sentiram pressionados a agir para afirmar a ordem e a identidade romana da colônia, independentemente dos méritos teológicos."
    },
    {
        verseRef: "Atos 16:14",
        verseText: "E uma certa mulher, chamada Lídia, vendedora de púrpura, da cidade de Tiatira...",
        media: {
            type: 'image',
            src: 'https://i.imgur.com/r6tM0J.jpg', // Molusco Murex
            alt: 'Molusco Murex, fonte do caríssimo corante púrpura.'
        },
        prompt: "Plínio, o Velho, em 'História Natural' (Livro 9), descreve o preço da púrpura de Tiro como 'valendo seu peso em prata'. Como essa informação extra-bíblica redefine nossa compreensão do papel de Lídia?",
        alternatives: [
            "Ela era provavelmente pobre, vendendo tecidos de baixa qualidade tingidos com imitações baratas de púrpura.",
            "Mostra que ela pertencia a uma guilda comercial que detinha o monopólio religioso da venda de púrpura na Macedônia.",
            "Confirma seu status como uma empresária de elite, com capital significativo e conexões comerciais internacionais, tornando sua casa uma base de operações formidável e estratégica para a missão de Paulo.",
            "Sugere que seu negócio era ilegal, pois o uso de púrpura era restrito por lei apenas a senadores e ao imperador."
        ],
        correctAnswerIndex: 2,
        difficulty: "Avançado",
        explanation: "Fontes como Plínio confirmam que o comércio de púrpura era um negócio de altíssimo luxo. Isso eleva Lídia de uma simples 'vendedora' para uma patrona rica e influente. Sua conversão não foi apenas espiritual; foi um ganho logístico e financeiro massivo para a igreja primitiva na Europa, oferecendo um local seguro e recursos."
    },
    {
        verseRef: "Atos 16:16",
        verseText: "...uma jovem, que tinha um espírito de Píton (pneuma pythona)...",
        media: {
            type: 'image',
            src: 'https://i.imgur.com/JzS1W1J.jpg',
            alt: 'Ruínas do Templo de Apolo em Delfos, centro do culto pítio.'
        },
        prompt: "Estudos como o de Kaefer (2024) enfatizam que 'pneuma pythona' é uma referência técnica ao culto de Apolo em Delfos. Se a libertação da jovem não é apenas um exorcismo genérico, mas uma confrontação direta com este culto específico, qual a implicação teológica mais profunda?",
        alternatives: [
            "Que Paulo estava tentando purificar o culto de Apolo, removendo seus elementos demoníacos.",
            "Que o poder de Cristo é apresentado como superior não a um 'demônio' qualquer, mas a uma das mais antigas, respeitadas e politicamente influentes instituições religiosas do mundo greco-romano.",
            "Que a jovem era uma sacerdotisa oficial enviada por Delfos para espionar as atividades de Paulo em Filipos.",
            "Que todos os casos de adivinhação no Novo Testamento estão, na verdade, ligados ao Oráculo de Delfos."
        ],
        correctAnswerIndex: 1,
        difficulty: "Especialista",
        explanation: "Ao usar uma terminologia tão específica, Lucas (o autor de Atos) enquadra o evento não como um incidente local, mas como uma batalha cósmica. O poder manifesto em Jesus, através de Paulo, não apenas cura um indivíduo, mas demonstra autoridade sobre as forças espirituais que sustentavam o próprio coração da religião e política grega. É uma declaração de soberania."
    },
    {
        verseRef: "Atos 16:37",
        verseText: "Mas Paulo replicou: Açoitaram-nos publicamente e, sem sermos condenados, sendo homens romanos...",
        media: {
            type: 'image',
            src: 'https://i.imgur.com/gK9pZkH.jpg',
            alt: 'Estrutura em Filipos tradicionalmente identificada como a prisão.'
        },
        prompt: "A revelação tardia da cidadania romana por Paulo é uma manobra jurídica. A Lex Valeria e a Lex Porcia eram pilares da lei romana que protegiam os cidadãos. Qual direito fundamental, articulado por Cícero em 'Contra Verres', os magistrados violaram, crime que poderia encerrar suas carreiras?",
        alternatives: [
            "O direito a um julgamento por um júri de seus pares.",
            "O direito de não ser preso dentro dos limites da cidade (pomerium).",
            "O direito de apelação ao imperador (provocatio ad populum) e a imunidade contra açoitamento sumário (verberatio) sem um julgamento formal.",
            "O direito a ter um advogado fornecido pelo estado."
        ],
        correctAnswerIndex: 2,
        difficulty: "Especialista",
        explanation: "Cícero famosamente bradou que as palavras 'Civis Romanus sum' ('Eu sou um cidadão romano') deveriam parar qualquer ação de um magistrado. O açoitamento (verberatio) de um cidadão sem julgamento e sem a chance de apelar (provocatio) era uma ofensa gravíssima. Ao revelar o fato depois, Paulo não só se protegeu, mas colocou os magistrados em uma posição de ilegalidade, forçando-os a uma retratação pública que legitimou a presença cristã."
    }
];
