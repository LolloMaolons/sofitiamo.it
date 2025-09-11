document.addEventListener('DOMContentLoaded', () => {
    // Logic for menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (menuLinks && menuToggle) {
            const isClickInsideMenu = menuLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && menuLinks.classList.contains('active')) {
                menuLinks.classList.remove('active');
            }
        }
    });

    // --- Full Quiz Section ---
    const quizContainer = document.getElementById('quiz-section');
    const allQuizzes = [
        // I primi 3 sono gli stessi della home
        { questionKey: "quiz_question_1", answerKey: "quiz_answer_1" },
        { questionKey: "quiz_question_2", answerKey: "quiz_answer_2" },
        { questionKey: "quiz_question_3", answerKey: "quiz_answer_3" },
        // Aggiungi qui altre domande
        { questionKey: "quiz_full_question_4", answerKey: "quiz_full_answer_4" },
        { questionKey: "quiz_full_question_5", answerKey: "quiz_full_answer_5" },
        { questionKey: "quiz_full_question_6", answerKey: "quiz_full_answer_6" },
        { questionKey: "quiz_full_question_7", answerKey: "quiz_full_answer_7" }
    ];

    const completedHomeQuizzes = sessionStorage.getItem('completedHomeQuizzes') === 'true';
    const quizzesToShow = completedHomeQuizzes ? allQuizzes.slice(3) : allQuizzes;
    
    let currentFullQuizIndex = 0;
    // Make it globally accessible for language changes
    window.currentFullQuizIndex = currentFullQuizIndex;

    // NUOVA FUNZIONE: Questa verrà chiamata da translations.js
    // per forzare l'aggiornamento del quiz con la nuova lingua.
    window.updateQuizDisplay = function() {
        showFullQuiz(window.currentFullQuizIndex);
    }

    function showFullQuiz(index) {
        if (index < quizzesToShow.length) {
            const quiz = quizzesToShow[index];
            // Calcola il numero della domanda basandosi su se i quiz della home sono stati completati
            const questionNumber = completedHomeQuizzes ? index + 4 : index + 1;
            const totalQuestions = completedHomeQuizzes ? allQuizzes.length : quizzesToShow.length;
            
            const quizTitle = window.languageManager ? window.languageManager.translate('quiz_title') : 'Quanto ne sai su Sofia?';
            const questionText = window.languageManager ? window.languageManager.translate('domanda') : 'Domanda';
            const ofText = window.languageManager ? window.languageManager.translate('di') : 'di';
            const questionContent = window.languageManager ? window.languageManager.translate(quiz.questionKey) : "🤔 Quanto puzza il culo di Sofia?";
            const placeholderText = window.languageManager ? window.languageManager.translate('inserisci_risposta') : "Inserisci la tua risposta...";
            const submitText = window.languageManager ? window.languageManager.translate('invia_risposta') : "Invia Risposta";
            
            quizContainer.innerHTML = `
                <h1 class="gold-text">${quizTitle}</h1>
                <div class="quiz-progress">
                    <p>${questionText} ${questionNumber} ${ofText} ${totalQuestions}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((index + 1) / quizzesToShow.length) * 100}%"></div>
                    </div>
                </div>
                <div class="quiz-question">
                    <p>${questionContent}</p>
                    <input type="text" id="full-quiz-answer-${index}" placeholder="${placeholderText}">
                    <button onclick="checkFullAnswer(${index})">${submitText}</button>
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
            const congratsTitle = window.languageManager ? window.languageManager.translate('complimenti') : '🏆 Congratulazioni!';
            
            quizContainer.innerHTML = `
                <div class="quiz-completion">
                    <h1 class="gold-text">${congratsTitle}</h1>
                    <div class="quiz-question">
                        <p>${window.languageManager ? window.languageManager.translate('completato_tutti_quiz') : '🎉 Hai completato tutti i quiz su Sofia!'}</p>
                        <p>${window.languageManager ? window.languageManager.translate('grazie_per_aver_giocato') : 'Grazie per aver giocato! Ora conosci Sofia ancora meglio!'}</p>
                        <button onclick="window.location.href='home.html'">${window.languageManager ? window.languageManager.translate('torna_alla_home') : 'Torna alla Home 🏠'}</button>
                    </div>
                </div>
            `;
        }
    }

    window.checkFullAnswer = function(index) {
        const quiz = quizzesToShow[index];
        const correctAnswer = window.languageManager ? window.languageManager.translate(quiz.answerKey) : "tanto";
        const userAnswer = document.getElementById(`full-quiz-answer-${index}`).value.trim();
        const feedback = document.getElementById(`full-feedback-${index}`);
        const inputField = document.getElementById(`full-quiz-answer-${index}`);
        const button = inputField.nextElementSibling;

        const correctText = window.languageManager ? window.languageManager.translate('risposta_corretta') : "🎉 Perfetto! Risposta corretta!";
        const wrongText = window.languageManager ? window.languageManager.translate('risposta_sbagliata') : "❌ Non proprio! La risposta corretta era:";

        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback.textContent = correctText;
            feedback.style.color = "green";
            inputField.style.borderColor = "#28a745";
            button.disabled = true;
            button.textContent = window.languageManager ? window.languageManager.translate('corretto') : "Corretto! ✓";
            button.style.background = "linear-gradient(145deg, #28a745, #20c997)";
        } else {
            feedback.textContent = `${wrongText} "${correctAnswer}"`;
            feedback.style.color = "red";
            inputField.style.borderColor = "#dc3545";
            button.disabled = true;
            button.textContent = window.languageManager ? window.languageManager.translate('sbagliato') : "Sbagliato ✗";
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
            window.currentFullQuizIndex = currentFullQuizIndex;
            showFullQuiz(currentFullQuizIndex);
        }, 2500);
    }

    showFullQuiz(currentFullQuizIndex);
});