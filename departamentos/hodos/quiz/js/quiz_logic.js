// js/quiz_logic.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências de Elementos DOM
    const quizBody = document.getElementById('quiz-body');
    const difficultySelection = document.getElementById('difficulty-selection');
    const verseRefHeader = document.getElementById('verse-ref-header');
    const verseTextHeader = document.getElementById('verse-text-header');
    const mediaContainer = document.getElementById('media-container');
    const questionPrompt = document.getElementById('question-prompt');
    const alternativesList = document.getElementById('alternatives-list');
    const feedbackText = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('next-btn');
    const prevNavBtn = document.getElementById('prev-q-btn');
    const nextNavBtn = document.getElementById('next-q-btn');
    const timerContainer = document.getElementById('timer-container');
    const timerText = document.getElementById('timer-text');
    const resultsContainer = document.getElementById('quiz-results');
    const scoreText = document.getElementById('score-text');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');

    // Estado do Quiz
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let questions = [];
    let mapInstance = null;
    let timerInterval = null;
    
    // --- ESTRUTURA DE DIFICULDADE ---
    const difficultySettings = {
        'Fácil': {
            levels: ['Fácil'],
            timeLimit: null,
            feedback: 'detailed',
            allowNav: true
        },
        'Normal': {
            levels: ['Fácil', 'Normal'],
            timeLimit: 45,
            feedback: 'simple',
            allowNav: true
        },
        'Especialista': {
            levels: ['Fácil', 'Normal', 'Avançado', 'Especialista'],
            timeLimit: 30,
            feedback: 'none',
            allowNav: false
        }
    };
    let currentDifficulty = {};

    function startQuiz(difficulty) {
        currentDifficulty = difficultySettings[difficulty];
        questions = quizData.filter(q => currentDifficulty.levels.includes(q.difficulty));
        
        if (questions.length === 0) {
            difficultySelection.innerHTML = '<h3>Nenhuma pergunta encontrada para esta dificuldade.</h3><button id="reload-btn" class="cta-button">Voltar</button>';
            document.getElementById('reload-btn').addEventListener('click', () => window.location.reload());
            return;
        }

        userAnswers = new Array(questions.length).fill(null);
        score = 0;
        currentQuestionIndex = 0;

        difficultySelection.classList.add('hidden');
        quizBody.classList.remove('hidden');
        
        if (!currentDifficulty.allowNav) {
            prevNavBtn.classList.add('hidden');
        }
        
        renderQuestion(currentQuestionIndex);
    }
    
    function renderQuestion(index) {
        if (index >= questions.length) {
            showResults();
            return;
        }

        stopTimer();
        quizBody.style.opacity = '0';
        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }

        setTimeout(() => {
            const question = questions[index];
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
                li.innerHTML = alt;
                li.dataset.index = i;
                li.addEventListener('click', () => selectAlternative(li));
                alternativesList.appendChild(li);
            });
            
            feedbackText.textContent = '';
            feedbackText.className = '';
            nextBtn.disabled = true;
            nextBtn.textContent = (index === questions.length - 1) ? 'Ver Resultados' : 'Próxima';

            if (userAnswers[index] !== null) {
                showAnswerState(userAnswers[index]);
            } else {
                 if (currentDifficulty.timeLimit) {
                    startTimer(currentDifficulty.timeLimit);
                }
            }

            updateNavigationArrows();
            quizBody.style.opacity = '1';
        }, 300);
    }

    function selectAlternative(li) {
        if (alternativesList.classList.contains('answered')) return;
        stopTimer();
        
        const selectedIndex = parseInt(li.dataset.index);
        const question = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctAnswerIndex;

        // A pontuação só é adicionada na primeira vez que a questão é respondida
        if (userAnswers[currentQuestionIndex] === null && isCorrect) {
            score++;
        }
        
        userAnswers[currentQuestionIndex] = { selected: selectedIndex, correct: question.correctAnswerIndex };
        
        showAnswerState(userAnswers[currentQuestionIndex]);
    }

    function showAnswerState(answer) {
        alternativesList.classList.add('answered');
        nextBtn.disabled = false;
        
        const correctLi = alternativesList.querySelector(`li[data-index="${answer.correct}"]`);
        const selectedLi = alternativesList.querySelector(`li[data-index="${answer.selected}"]`);

        switch(currentDifficulty.feedback) {
            case 'detailed':
                if (selectedLi) selectedLi.classList.add(answer.selected === answer.correct ? 'correct' : 'incorrect');
                if (correctLi) correctLi.classList.add('correct');
                feedbackText.className = answer.selected === answer.correct ? 'correct' : 'incorrect';
                feedbackText.innerHTML = (answer.selected === answer.correct ? 'Correto!' : 'Incorreto.') + 
                    `<span class="explanation">${questions[currentQuestionIndex].explanation}</span>`;
                break;
            case 'simple':
                if (selectedLi) selectedLi.classList.add(answer.selected === answer.correct ? 'correct' : 'incorrect');
                if (correctLi) correctLi.classList.add('correct');
                feedbackText.className = answer.selected === answer.correct ? 'correct' : 'incorrect';
                feedbackText.textContent = answer.selected === answer.correct ? 'Correto! Análise precisa.' : 'Interessante, mas a outra opção é mais precisa.';
                break;
            case 'none':
                if (selectedLi) selectedLi.classList.add('selected');
                feedbackText.className = 'info';
                feedbackText.textContent = 'Resposta registrada. O resultado será mostrado no final.';
                break;
        }

        nextNavBtn.classList.add('highlight');
    }

    function startTimer(duration) {
        timerContainer.classList.remove('hidden', 'warning');
        let timeLeft = duration;
        
        const update = () => {
            timerText.textContent = timeLeft;
            if (timeLeft <= 5) {
                timerContainer.classList.add('warning');
            }
            if (timeLeft < 0) { // Garante que o timeout só ocorra uma vez
                stopTimer();
                handleTimeOut();
            } else {
                timeLeft--;
            }
        };

        timerInterval = setInterval(update, 1000);
        update();
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerContainer.classList.add('hidden');
    }

    function handleTimeOut() {
        feedbackText.textContent = "Tempo esgotado!";
        feedbackText.className = "incorrect";
        userAnswers[currentQuestionIndex] = { selected: null, correct: questions[currentQuestionIndex].correctAnswerIndex };
        alternativesList.classList.add('answered');
        nextBtn.disabled = false;
        nextNavBtn.classList.add('highlight');
    }

    function navigate(direction) {
        const newIndex = currentQuestionIndex + direction;
        if (direction === 1 && newIndex === questions.length) {
            showResults();
        } else if (newIndex >= 0 && newIndex < questions.length) {
            currentQuestionIndex = newIndex;
            renderQuestion(currentQuestionIndex);
        }
    }

    function updateNavigationArrows() {
        const canGoBack = currentDifficulty.allowNav && currentQuestionIndex > 0;
        prevNavBtn.classList.toggle('hidden', !canGoBack);

        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        const isLastAnswered = isLastQuestion && userAnswers[currentQuestionIndex] !== null;
        nextNavBtn.classList.toggle('hidden', isLastAnswered);
        nextNavBtn.classList.remove('highlight');
    }

    function showResults() {
        stopTimer();
        quizBody.classList.add('hidden');
        prevNavBtn.classList.add('hidden');
        nextNavBtn.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        scoreText.textContent = `${score} de ${questions.length}`;
        
        let percentage = (score / questions.length) * 100;
        let message = "Continue estudando, a Palavra sempre tem mais a revelar!";
        if(percentage === 100) message = "Excelente! Seu conhecimento histórico e teológico é notável!";
        else if (percentage >= 60) message = "Muito bom! Você tem uma ótima compreensão dos contextos.";
        resultMessage.textContent = message;
    }

    function restartQuiz() {
        window.location.reload();
    }
    
    // --- FUNÇÕES DO MAPA (INCLUÍDAS COMPLETAMENTE) ---
    function createColoredCircleIcon(color) {
        const iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="8" fill="${color}" stroke="#FFFFFF" stroke-width="2.5"/>
        </svg>`;
        return L.divIcon({ html: iconHtml, className: 'custom-map-icon', iconSize: [20, 20], iconAnchor: [10, 10] });
    }

    function createColoredMarkerIcon(color) {
        const colorMap = {
            '#E53935': 'red', '#1E88E5': 'blue', '#43A047': 'green', '#FDD835': 'yellow',
            '#FFA726': 'orange', '#8E24AA': 'violet'
        };
        const iconColor = colorMap[color] || 'grey';
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

        const allPointsForBounds = [];

        if (config.displayRoutes && typeof romanRoadsData !== 'undefined') {
            config.displayRoutes.forEach(routeId => {
                const routeInfo = romanRoadsData[routeId];
                if (routeInfo && routeInfo.path) {
                    const leafletPath = routeInfo.path.map(c => [c[1], c[0]]);
                    allPointsForBounds.push(...leafletPath);
                    L.polyline(leafletPath, { color: routeInfo.color, weight: 4, opacity: 0.8 }).addTo(mapInstance).bindPopup(routeInfo.name);

                    if(routeInfo.cities) {
                        routeInfo.cities.forEach(city => {
                            const popupContent = `<b>${city.ancientName}</b><br>${city.modernName}`;
                            const cityCoords = [city.coords[1], city.coords[0]];
                            L.marker(cityCoords, { icon: createColoredCircleIcon(routeInfo.color) }).addTo(mapInstance).bindPopup(popupContent);
                            allPointsForBounds.push(cityCoords);
                        });
                    }
                }
            });
        }
        
        if(config.markers) {
            config.markers.forEach(markerInfo => {
                const routeColor = romanRoadsData[markerInfo.routeId]?.color || '#777777';
                const markerCoords = [markerInfo.coords[1], markerInfo.coords[0]];
                L.marker(markerCoords, { icon: createColoredMarkerIcon(routeColor) }).addTo(mapInstance).bindPopup(markerInfo.popup);
                allPointsForBounds.push(markerCoords);
            });
        }

        if (allPointsForBounds.length > 0) {
            const bounds = L.latLngBounds(allPointsForBounds);
            mapInstance.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    // Event Listeners
    difficultySelection.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => startQuiz(button.dataset.difficulty));
    });
    nextBtn.addEventListener('click', () => navigate(1));
    nextNavBtn.addEventListener('click', () => { if(!nextNavBtn.classList.contains('hidden')) navigate(1); });
    prevNavBtn.addEventListener('click', () => navigate(-1));
    restartBtn.addEventListener('click', restartQuiz);
});
