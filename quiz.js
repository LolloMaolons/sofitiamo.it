document.addEventListener('DOMContentLoaded', () => {
    // Logic for menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
        });
    }

    // --- Full Quiz Section ---
    const quizContainer = document.getElementById('quiz-section');
    const allQuizzes = [
        // I primi 3 sono gli stessi della home
        { question: "🤔 Quanto puzza il culo di Sofia?", answer: "tanto" },
        { question: "📚 In che anno ha iniziato l'università?", answer: "1856" },
        { question: "💭 Qual è il suo soprannome più comune?", answer: "Soffocotto" },
        // Aggiungi qui altre domande
        { question: "🌈 Qual è il suo colore preferito?", answer: "Verde" },
        { question: "🐱 Come si chiama il suo gatto?", answer: "Pippo" },
        { question: "🎵 Qual è il suo genere musicale preferito?", answer: "Pubblicità di Spotify" },
        { question: "🍕 Qual è il suo cibo preferito?", answer: "Cacca" }
    ];

    const completedHomeQuizzes = sessionStorage.getItem('completedHomeQuizzes') === 'true';
    const quizzesToShow = completedHomeQuizzes ? allQuizzes.slice(3) : allQuizzes;
    
    let currentFullQuizIndex = 0;

    function showFullQuiz(index) {
        if (index < quizzesToShow.length) {
            const quiz = quizzesToShow[index];
            quizContainer.innerHTML = `
                <h1 class="gold-text">Quanto ne sai su Sofia?</h1>
                <div class="quiz-progress">
                    <p>Domanda ${index + 1} di ${quizzesToShow.length}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((index + 1) / quizzesToShow.length) * 100}%"></div>
                    </div>
                </div>
                <div class="quiz-question">
                    <p>${quiz.question}</p>
                    <input type="text" id="full-quiz-answer-${index}" placeholder="Inserisci la tua risposta...">
                    <button onclick="checkFullAnswer(${index})">Invia Risposta</button>
                    <p id="full-feedback-${index}"></p>
                </div>
            `;
            
            // Add Enter key listener to the input field
            const inputField = document.getElementById(`full-quiz-answer-${index}`);
            inputField.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    checkFullAnswer(index);
                }
            });
            
            // Focus on input field for better UX
            inputField.focus();
        } else {
            quizContainer.innerHTML = `
                <div class="quiz-completion">
                    <h1 class="gold-text">🏆 Congratulazioni!</h1>
                    <div class="quiz-question">
                        <p>🎉 Hai completato tutti i quiz su Sofia!</p>
                        <p>Grazie per aver giocato! Ora conosci Sofia ancora meglio!</p>
                        <button onclick="window.location.href='home.html'" style="background: linear-gradient(145deg, var(--verde-sx), var(--verde-dx)); margin-top: 1rem;">Torna alla Home 🏠</button>
                    </div>
                </div>
            `;
        }
    }

    window.checkFullAnswer = function(index) {
        const quiz = quizzesToShow[index];
        const userAnswer = document.getElementById(`full-quiz-answer-${index}`).value.trim();
        const feedback = document.getElementById(`full-feedback-${index}`);
        const inputField = document.getElementById(`full-quiz-answer-${index}`);
        const button = inputField.nextElementSibling;

        if (userAnswer.toLowerCase() === quiz.answer.toLowerCase()) {
            feedback.textContent = "🎉 Perfetto! Risposta corretta!";
            feedback.style.color = "green";
            inputField.style.borderColor = "#28a745";
            button.disabled = true;
            button.textContent = "Corretto! ✓";
            button.style.background = "linear-gradient(145deg, #28a745, #20c997)";
        } else {
            feedback.textContent = `❌ Non proprio! La risposta corretta era: "${quiz.answer}"`;
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
        }
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const newWidth = Math.min(((index + 1) / quizzesToShow.length) * 100, 100);
            progressFill.style.width = `${newWidth}%`;
        }
        
        // Show next quiz after a delay
        setTimeout(() => {
            currentFullQuizIndex++;
            showFullQuiz(currentFullQuizIndex);
        }, 2500);
    }

    showFullQuiz(currentFullQuizIndex);
});