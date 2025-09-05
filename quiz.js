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
        { question: "Qual è il secondo nome di Sofia?", answer: "Maria" },
        { question: "In che anno ha iniziato l'università?", answer: "2019" },
        { question: "Qual è il suo soprannome più comune?", answer: "Sofi" },
        // Aggiungi qui altre domande
        { question: "Qual è il suo colore preferito?", answer: "Verde" },
        { question: "Come si chiama il suo gatto?", answer: "Pippo" }
    ];

    const completedHomeQuizzes = sessionStorage.getItem('completedHomeQuizzes') === 'true';
    const quizzesToShow = completedHomeQuizzes ? allQuizzes.slice(3) : allQuizzes;
    
    let currentFullQuizIndex = 0;

    function showFullQuiz(index) {
        if (index < quizzesToShow.length) {
            const quiz = quizzesToShow[index];
            quizContainer.innerHTML = `
                <h1>Quanto ne sai su Sofia?</h1>
                <div class="quiz-question">
                    <p>${quiz.question}</p>
                    <input type="text" id="full-quiz-answer-${index}">
                    <button onclick="checkFullAnswer(${index})">Invia</button>
                    <p id="full-feedback-${index}"></p>
                </div>
            `;
        } else {
            quizContainer.innerHTML = `<h1>Hai finito tutti i quiz! Grazie per aver giocato!</h1>`;
        }
    }

    window.checkFullAnswer = function(index) {
        const quiz = quizzesToShow[index];
        const userAnswer = document.getElementById(`full-quiz-answer-${index}`).value.trim();
        const feedback = document.getElementById(`full-feedback-${index}`);

        if (userAnswer.toLowerCase() === quiz.answer.toLowerCase()) {
            feedback.textContent = "Corretto!";
            feedback.style.color = "green";
        } else {
            feedback.textContent = `Sbagliato! La risposta era: ${quiz.answer}`;
            feedback.style.color = "red";
        }
        
        // Mostra il prossimo quiz dopo un breve ritardo
        setTimeout(() => {
            currentFullQuizIndex++;
            showFullQuiz(currentFullQuizIndex);
        }, 2000);
    }

    showFullQuiz(currentFullQuizIndex);
});