document.addEventListener('DOMContentLoaded', () => {
    // Cache elementi DOM per evitare query multiple
    const elements = {
        menuToggle: document.getElementById('menu-toggle'),
        menuLinks: document.getElementById('menu-links'),
        quizContainer: document.getElementById('quiz-section')
    };

    function getMultiQuizzes() {
        const lang = window.languageManager ? window.languageManager.currentLanguage : 'it';
        const t = window.languageManager ? translations[lang] : translations.it;
        const quizzes = [];
        for (let i = 1; i <= 15; i++) {
            if (t[`quiz_multi_${i}_q`] && Array.isArray(t[`quiz_multi_${i}_opts`]) && Array.isArray(t[`quiz_multi_${i}_ans`])) {
                quizzes.push({
                    question: t[`quiz_multi_${i}_q`],
                    options: t[`quiz_multi_${i}_opts`],
                    correct: t[`quiz_multi_${i}_ans`]
                });
            }
        }
        return quizzes;
    }

    let currentFullQuizIndex = 0;
    window.currentFullQuizIndex = currentFullQuizIndex;

    window.updateQuizDisplay = function() {
        showFullQuiz(window.currentFullQuizIndex);
    }

    function showFullQuiz(index) {
        const quizzes = getMultiQuizzes();
        if (index < quizzes.length) {
            const quiz = quizzes[index];
            const questionNumber = index + 1;
            const totalQuestions = quizzes.length;
            const quizTitle = window.languageManager ? window.languageManager.translate('quiz_title') : 'Quanto ne sai su Sofia?';
            const questionText = window.languageManager ? window.languageManager.translate('domanda') : 'Domanda';
            const ofText = window.languageManager ? window.languageManager.translate('di') : 'di';
            const submitText = window.languageManager ? window.languageManager.translate('invia_risposta') : "Invia Risposta";

            let optionsHtml = '';
            quiz.options.forEach((opt, i) => {
                optionsHtml += `<label class="multi-answer-label"><input type="checkbox" class="multi-answer" value="${i}"> ${opt}</label><br>`;
            });

            elements.quizContainer.innerHTML = `
                <h1 class="gold-text">${quizTitle}</h1>
                <div class="quiz-progress">
                    <p>${questionText} ${questionNumber} ${ofText} ${totalQuestions}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((index + 1) / quizzes.length) * 100}%"></div>
                    </div>
                </div>
                <div class="quiz-question">
                    <p>${quiz.question}</p>
                    <form id="multi-answer-form-${index}">
                        ${optionsHtml}
                        <button type="button" id="multi-submit-${index}">${submitText}</button>
                    </form>
                    <p id="full-feedback-${index}"></p>
                </div>
            `;

            document.getElementById(`multi-submit-${index}`).addEventListener('click', function() {
                checkFullAnswer(index);
            });
        } else {
            const congratsTitle = window.languageManager ? window.languageManager.translate('complimenti') : '🏆 Congratulazioni!';
            elements.quizContainer.innerHTML = `
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
        const quizzes = getMultiQuizzes();
        const quiz = quizzes[index];
        const correctAnswers = quiz.correct.sort();
        const checked = Array.from(document.querySelectorAll(`#multi-answer-form-${index} .multi-answer:checked`)).map(el => parseInt(el.value)).sort();
        const feedback = document.getElementById(`full-feedback-${index}`);
        const submitBtn = document.getElementById(`multi-submit-${index}`);

        const correctText = window.languageManager ? window.languageManager.translate('risposta_corretta') : "🎉 Perfetto! Risposta corretta!";
        const wrongText = window.languageManager ? window.languageManager.translate('risposta_sbagliata') : "❌ Non proprio! La risposta corretta era:";

        if (JSON.stringify(checked) === JSON.stringify(correctAnswers)) {
            feedback.textContent = correctText;
            feedback.style.color = "green";
            submitBtn.disabled = true;
            submitBtn.textContent = window.languageManager ? window.languageManager.translate('corretto') : "Corretto! ✓";
            submitBtn.style.background = "linear-gradient(145deg, #28a745, #20c997)";
        } else {
            let correctLabels = quiz.correct.map(i => quiz.options[i]).join(', ');
            feedback.textContent = `${wrongText} ${correctLabels}`;
            feedback.style.color = "red";
            submitBtn.disabled = true;
            submitBtn.textContent = window.languageManager ? window.languageManager.translate('sbagliato') : "Sbagliato ✗";
            submitBtn.style.background = "linear-gradient(145deg, #dc3545, #c82333)";
        }

        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const newWidth = Math.min(((index + 1) / quizzes.length) * 100, 100);
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