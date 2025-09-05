document.addEventListener('DOMContentLoaded', () => {
    // Logic for menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
        });
    }

    // --- Home Quiz ---
    const homeQuizContainer = document.getElementById('home-quiz-section');
    const quizzes = [
        { question: "🤔 Quanto puzza il culo di Sofia", answer: "tanto" },
        { question: "📚 In che anno ha iniziato l'università?", answer: "1856" },
        { question: "💭 Qual è il suo soprannome più comune?", answer: "Soffocotto" },
    ];

    let currentQuizIndex = 0;

    function showQuiz(index) {
        if (index < quizzes.length) {
            const quiz = quizzes[index];
            homeQuizContainer.innerHTML = `
                <div class="quiz-question">
                    <p>${quiz.question}</p>
                    <input type="text" id="quiz-answer-${index}" placeholder="Inserisci la tua risposta...">
                    <button onclick="checkAnswer(${index}, '${quiz.answer}')">Invia Risposta</button>
                    <p id="feedback-${index}"></p>
                </div>
            `;
            
            // Add Enter key listener to the input field
            const inputField = document.getElementById(`quiz-answer-${index}`);
            inputField.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    checkAnswer(index, quiz.answer);
                }
            });
            
            // Focus on input field for better UX
            inputField.focus();
        } else {
            homeQuizContainer.innerHTML = `
                <div class="quiz-question">
                    <p>🎉 Complimenti! Hai completato tutti i quiz della home!</p>
                    <p>Vuoi continuare con il quiz completo?</p>
                    <button onclick="goToQuizPage()" style="background: linear-gradient(145deg, var(--verde-sx), var(--verde-dx)); margin-top: 1rem;">Sì, andiamo! 🚀</button>
                </div>
            `;
        }
    }

    window.checkAnswer = function(index, correctAnswer) {
        const userAnswer = document.getElementById(`quiz-answer-${index}`).value.trim();
        const feedback = document.getElementById(`feedback-${index}`);
        const inputField = document.getElementById(`quiz-answer-${index}`);
        const button = inputField.nextElementSibling;
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback.textContent = "🎉 Perfetto! Risposta corretta!";
            feedback.style.color = "green";
            inputField.style.borderColor = "#28a745";
            button.disabled = true;
            button.textContent = "Corretto! ✓";
            button.style.background = "linear-gradient(145deg, #28a745, #20c997)";
            
            setTimeout(() => {
                currentQuizIndex++;
                showQuiz(currentQuizIndex);
            }, 1500);
        } else {
            feedback.textContent = `❌ Non proprio! La risposta corretta era: "${correctAnswer}"`;
            feedback.style.color = "red";
            inputField.style.borderColor = "#dc3545";
            button.disabled = true;
            button.textContent = "Sbagliato ✗";
            button.style.background = "linear-gradient(145deg, #dc3545, #c82333)";
            
            // Shake animation effect
            inputField.style.animation = "shake 0.5s";
            setTimeout(() => {
                inputField.style.animation = "";
            }, 500);
            
            // Passa alla domanda successiva dopo aver mostrato la soluzione
            setTimeout(() => {
                currentQuizIndex++;
                showQuiz(currentQuizIndex);
            }, 2500);
        }
    }
    
    window.goToQuizPage = function() {
        // Salva i quiz già fatti per non ripeterli
        sessionStorage.setItem('completedHomeQuizzes', 'true');
        window.location.href = 'quiz.html';
    }

    showQuiz(currentQuizIndex);


    // --- Iconic Moments Gallery ---
    const homeGallery = document.getElementById('home-gallery');

    // Crea un file 'media-list.json' nella cartella 'media' con questo formato:
    // { "files": ["foto1.jpg", "video1.mp4", "foto2.png"] }
    fetch('media/media-list.json')
        .then(response => response.json())
        .then(data => {
            const mediaFiles = data.files;
            const shuffled = mediaFiles.sort(() => 0.5 - Math.random());
            const selectedMedia = shuffled.slice(0, 4); // Mostra 4 elementi a caso

            selectedMedia.forEach(file => {
                const extension = file.split('.').pop().toLowerCase();
                let mediaElement;
                if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                    mediaElement = document.createElement('img');
                    mediaElement.src = `media/${file}`;
                } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    mediaElement = document.createElement('video');
                    mediaElement.src = `media/${file}`;
                    mediaElement.autoplay = true;
                    mediaElement.loop = true;
                    mediaElement.muted = true;
                }
                if(mediaElement) {
                    // Crea un link che avvolge l'elemento media
                    const linkElement = document.createElement('a');
                    linkElement.href = 'photos.html';
                    linkElement.appendChild(mediaElement);
                    homeGallery.appendChild(linkElement);
                }
            });
        })
        .catch(error => console.error('Errore nel caricare la galleria:', error));
});