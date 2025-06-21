// js/quiz_logic.js

document.addEventListener('DOMContentLoaded', () => {
    const quizBody = document.getElementById('quiz-body');
    const verseRefHeader = document.getElementById('verse-ref-header');
    const verseTextHeader = document.getElementById('verse-text-header');
    const mediaContainer = document.getElementById('media-container');
    const questionPrompt = document.getElementById('question-prompt');
    const alternativesList = document.getElementById('alternatives-list');
    const feedbackText = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('next-btn');
    const prevNavBtn = document.getElementById('prev-q-btn');
    const nextNavBtn = document.getElementById('next-q-btn');
    const resultsContainer = document.getElementById('quiz-results');
    const scoreText = document.getElementById('score-text');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');

    let currentQuestionIndex = 0;
    let score = 0;
    let answered = new Array(quizData.length).fill(null);
    let mapInstance = null; // Para manter a referência do mapa e destruí-lo

    function renderQuestion(index) {
        quizBody.style.opacity = '0';
        // Destrói a instância anterior do mapa antes de renderizar uma nova
        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }
        
        setTimeout(() => {
            const question = quizData[index];
            verseRefHeader.textContent = question.verseRef;
            verseTextHeader.innerHTML = `"${question.verseText}"`;
            mediaContainer.innerHTML = '';

            if (question.media.type === 'map') {
                mediaContainer.innerHTML = `<div id="map" style="width:100%; height:100%;"></div>`;
                initMap(question.media.config);
            } else if (question.media.type === 'image') {
                mediaContainer.innerHTML = `<img src="${question.media.src}" alt="${question.media.alt}">`;
            }

            questionPrompt.innerHTML = question.prompt;
            alternativesList.innerHTML = '';
            alternativesList.className = '';
            question.alternatives.forEach((alt, i) => {
                const li = document.createElement('li');
                li.innerHTML = alt.replace('...', ''); // Limpa placeholders
                li.dataset.index = i;
                li.addEventListener('click', () => selectAlternative(li));
                alternativesList.appendChild(li);
            });
            
            feedbackText.textContent = '';
            feedbackText.className = '';
            nextBtn.disabled = true;
            nextBtn.textContent = (index === quizData.length - 1) ? 'Ver Resultados' : 'Próxima';

            if (answered[index] !== null) {
                alternativesList.classList.add('answered');
                const correctLi = alternativesList.querySelector(`li[data-index="${question.correctAnswerIndex}"]`);
                correctLi.classList.add('correct');
                const selections = JSON.parse(localStorage.getItem('selections')) || {};
                const wrongSelectionIndex = selections[index];
                if (answered[index] === false && wrongSelectionIndex !== undefined) {
                    const wrongLi = alternativesList.querySelector(`li[data-index="${wrongSelectionIndex}"]`);
                    if(wrongLi) wrongLi.classList.add('incorrect');
                }
                nextBtn.disabled = false;
            }

            updateNavigationArrows();
            quizBody.style.opacity = '1';
        }, 300);
    }
    
    // Função para criar um ícone circular colorido usando SVG
    function createColoredCircleIcon(color) {
        const iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="8" fill="${color}" stroke="#FFFFFF" stroke-width="2.5"/>
        </svg>`;
        return L.divIcon({ html: iconHtml, className: 'custom-map-icon', iconSize: [20, 20], iconAnchor: [10, 10] });
    }

    // Função para criar um ícone de marcador colorido do Leaflet
    function createColoredMarkerIcon(color) {
        const colorMap = {
            '#E53935': 'red',     // Via Sebaste
            '#1E88E5': 'blue',    // Rota Marítima
            '#43A047': 'green',   // Via Egnácia
            '#FDD835': 'yellow',  // Via Ápia Original
            '#FFA726': 'orange',  // Via Ápia Traiana
            '#8E24AA': 'violet'   // Via Cláudia Augusta
        };
        const iconColor = colorMap[color] || 'grey'; // Fallback para cinza se a cor não for mapeada
        return L.icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });
    }

    function initMap(config) {
        let providerUrl = config.provider || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        mapInstance = L.map('map');
        L.tileLayer(providerUrl, { attribution: '© OpenStreetMap contributors' }).addTo(mapInstance);

        const allPointsForBounds = []; // Coordenadas para calcular os limites do mapa

        // 1. Desenha as rotas e os marcadores de cidades
        if (config.displayRoutes && typeof romanRoadsData !== 'undefined') {
            config.displayRoutes.forEach(routeId => {
                const routeInfo = romanRoadsData[routeId];
                if (routeInfo) {
                    // Inverte as coordenadas da rota para o Leaflet: [lon, lat] -> [lat, lon]
                    const leafletPath = routeInfo.path.map(c => [c[1], c[0]]);
                    allPointsForBounds.push(...leafletPath); // Adiciona ao array para cálculo de limites

                    L.polyline(leafletPath, { color: routeInfo.color, weight: 4, opacity: 0.8 }).addTo(mapInstance).bindPopup(routeInfo.name);

                    // Adiciona marcadores para cada cidade da rota
                    if(routeInfo.cities) {
                        routeInfo.cities.forEach(city => {
                            const popupContent = `<b>${city.ancientName}</b><br>${city.modernName}`;
                            // Inverte as coordenadas da cidade para o Leaflet: [lon, lat] -> [lat, lon]
                            L.marker([city.coords[1], city.coords[0]], { icon: createColoredCircleIcon(routeInfo.color) }).addTo(mapInstance).bindPopup(popupContent);
                            allPointsForBounds.push([city.coords[1], city.coords[0]]); // Adiciona ao array para cálculo de limites
                        });
                    }
                }
            });
        }
        
        // 2. Adiciona os marcadores especiais da pergunta (com popups explicativos)
        if(config.markers) {
            config.markers.forEach(markerInfo => {
                const routeColor = romanRoadsData[markerInfo.routeId]?.color || '#777777'; // Pega a cor da rota associada ou cinza
                // Inverte as coordenadas do marcador para o Leaflet: [lon, lat] -> [lat, lon]
                L.marker([markerInfo.coords[1], markerInfo.coords[0]], { icon: createColoredMarkerIcon(routeColor) }).addTo(mapInstance).bindPopup(markerInfo.popup);
                allPointsForBounds.push([markerInfo.coords[1], markerInfo.coords[0]]); // Adiciona ao array para cálculo de limites
            });
        }

        // Ajusta a visão do mapa para incluir todos os pontos e rotas
        if (allPointsForBounds.length > 0) {
            const bounds = L.latLngBounds(allPointsForBounds);
            mapInstance.fitBounds(bounds, { padding: [50, 50] }); // Adiciona um padding para que os elementos não fiquem na borda
        }
    }
    
    function selectAlternative(li) {
        if (alternativesList.classList.contains('answered')) return;
        alternativesList.classList.add('answered');
        const selectedIndex = parseInt(li.dataset.index);
        const question = quizData[currentQuestionIndex];
        
        let selections = JSON.parse(localStorage.getItem('selections')) || {};
        selections[currentQuestionIndex] = selectedIndex;
        localStorage.setItem('selections', JSON.stringify(selections));

        if (selectedIndex === question.correctAnswerIndex) {
            if(answered[currentQuestionIndex] === null) score++;
            answered[currentQuestionIndex] = true;
            li.classList.add('correct');
            feedbackText.textContent = 'Correto! Análise precisa.';
            feedbackText.className = 'correct';
        } else {
            answered[currentQuestionIndex] = false;
            li.classList.add('incorrect');
            const correctLi = alternativesList.querySelector(`li[data-index="${question.correctAnswerIndex}"]`);
            correctLi.classList.add('correct');
            feedbackText.textContent = 'Interessante, mas a outra opção é mais precisa.';
            feedbackText.className = 'incorrect';
        }
        nextBtn.disabled = false;
        nextNavBtn.classList.add('highlight');
    }

    function updateNavigationArrows() {
        prevNavBtn.classList.toggle('hidden', currentQuestionIndex === 0);
        const isLastQuestion = currentQuestionIndex === quizData.length - 1;
        const isLastQuestionAnswered = isLastQuestion && answered[currentQuestionIndex] !== null;
        nextNavBtn.classList.toggle('hidden', isLastQuestionAnswered);
        nextNavBtn.classList.remove('highlight');
    }

    function navigate(direction) {
        const newIndex = currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < quizData.length) {
            currentQuestionIndex = newIndex;
            renderQuestion(currentQuestionIndex);
        } else if (direction === 1 && newIndex === quizData.length) {
            showResults();
        }
    }

    function showResults() {
        quizBody.classList.add('hidden');
        prevNavBtn.classList.add('hidden');
        nextNavBtn.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        scoreText.textContent = `${score} de ${quizData.length}`;
        let message = "Continue estudando, a Palavra sempre tem mais a revelar!";
        if(score === quizData.length) message = "Excelente! Seu conhecimento histórico e teológico é notável!";
        else if (score >= quizData.length / 2) message = "Muito bom! Você tem uma ótima compreensão dos contextos.";
        resultMessage.textContent = message;
    }

    function restartQuiz() {
        localStorage.removeItem('selections');
        window.location.reload();
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => navigate(1));
    nextNavBtn.addEventListener('click', () => { if(!nextNavBtn.classList.contains('hidden')) navigate(1); });
    prevNavBtn.addEventListener('click', () => navigate(-1));
    restartBtn.addEventListener('click', restartQuiz);

    // Iniciar Quiz
    localStorage.removeItem('selections'); // Limpa seleções de um quiz anterior
    renderQuestion(currentQuestionIndex);
});
