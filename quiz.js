document.addEventListener('DOMContentLoaded', () => {
    // === MENU-TOGGLE ===
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');
    if (menuToggle && menuLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuLinks.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!menuLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuLinks.classList.remove('active');
            }
        });
    }

    // Sincronizza la lingua selezionata da localStorage (se diversa), anche se languageManager non è ancora pronto
    function syncQuizLanguage() {
        const storedLang = localStorage.getItem('selectedLanguage');
        if (window.languageManager && storedLang && window.languageManager.currentLanguage !== storedLang) {
            window.languageManager.changeLanguage(storedLang);
            return true;
        }
        return false;
    }

    if (!syncQuizLanguage()) {
        // Se languageManager non è ancora pronto, osserva finché non lo è
        const interval = setInterval(() => {
            if (syncQuizLanguage()) {
                clearInterval(interval);
            }
        }, 50);
        // Timeout di sicurezza dopo 3 secondi
        setTimeout(() => clearInterval(interval), 3000);
    }
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


    // Gestione stato quiz: inizio da quiz.html o da home
    let homeQuizCount = parseInt(sessionStorage.getItem('homeQuizCount') || '0', 10);
    let completedHome = sessionStorage.getItem('completedHomeQuizzes') === 'true';
    let quizStartIndex = completedHome ? homeQuizCount : 0;
    let currentFullQuizIndex = quizStartIndex;
    window.currentFullQuizIndex = currentFullQuizIndex;
    let quizScore = completedHome ? parseInt(sessionStorage.getItem('homeQuizScore') || '0', 10) : 0;
    window.quizScore = quizScore;

    window.updateQuizDisplay = function() {
        showFullQuiz(window.currentFullQuizIndex);
    }

    function showFullQuiz(index) {
        const quizzes = getMultiQuizzes();
        const totalQuestions = quizzes.length;
        const startIndex = quizStartIndex;
        // Always use totalQuestions for numbering and progress
        const currentIndex = index;
        if (index < quizzes.length) {
            const quiz = quizzes[index];
            const questionNumber = index + 1;
            const quizTitle = window.languageManager ? window.languageManager.translate('quiz_title') : 'Quanto ne sai su Sofia?';
            const questionText = window.languageManager ? window.languageManager.translate('domanda') : 'Domanda';
            const ofText = window.languageManager ? window.languageManager.translate('di') : 'di';
            const submitText = window.languageManager ? window.languageManager.translate('invia_risposta') : "Invia Risposta";
            const scoreLabel = window.languageManager ? window.languageManager.translate('punteggio_label') : 'Punteggio:';

            let optionsHtml = '';
            // Determina se sono consentite risposte multiple
            const isMultiAnswer = quiz.correct.length > 1;
            let multiNote = '';
            if (isMultiAnswer) {
                multiNote = ' <span style="font-size:0.95em; color:#888;">(' + (window.languageManager ? window.languageManager.translate('multi_answer_note') : 'Puoi selezionare più risposte') + ')</span>';
            }
            // Emoji pertinenti per ogni domanda
            let qText = quiz.question + multiNote;
            if (!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(qText)) {
                // No emoji present, add a relevant one
                if (/noveli|antenato|battaglia|ottomani|shipka|storia|origine|perch[eé]/i.test(qText)) {
                    qText = '🏛️ ' + qText; // storia, origini
                } else if (/colore|fiore|simbolo|bandiera|rosa|lilla|verde|blu|giallo|oro/i.test(qText)) {
                    qText = '🌸 ' + qText; // colori, simboli, fiori
                } else if (/musica|canzone|brano|artista|cantante|ascolta|playlist|spotify|note/i.test(qText)) {
                    qText = '🎵 ' + qText; // musica
                } else if (/foto|immagine|scatto|fotografia|album|ricordo/i.test(qText)) {
                    qText = '📸 ' + qText; // foto
                } else if (/quiz|gioco|domanda|risposta|punteggio/i.test(qText)) {
                    qText = '❓ ' + qText; // quiz generico
                } else if (/amica|amico|famiglia|parente|sorella|fratello|mamma|papà|zio|zia|cugino|cugina/i.test(qText)) {
                    qText = '👨‍👩‍👧‍👦 ' + qText; // famiglia
                } else if (/scuola|classe|prof|insegnante|studente|studio|esame/i.test(qText)) {
                    qText = '🏫 ' + qText; // scuola
                } else if (/viaggio|vacanza|città|paese|luogo|posto|mondo|mappa/i.test(qText)) {
                    qText = '🌍 ' + qText; // viaggi
                } else if (/sport|gioca|partita|allenamento|squadra|calcio|basket|pallavolo/i.test(qText)) {
                    qText = '🏅 ' + qText; // sport
                } else if (/cibo|piatto|mangiare|dolce|torta|pizza|pasta|ristorante/i.test(qText)) {
                    qText = '🍰 ' + qText; // cibo
                } else {
                    // Scegli casualmente tra nuvola, stella e punto di domanda
                    const generiche = ['💭', '✨', '❓'];
                    const randomEmoji = generiche[Math.floor(Math.random() * generiche.length)];
                    qText = randomEmoji + ' ' + qText;
                }
            }
            quiz.options.forEach((opt, i) => {
                optionsHtml += `<label class="multi-answer-label"><input type="checkbox" class="multi-answer" value="${i}"> ${opt}</label><br>`;
            });

            elements.quizContainer.innerHTML = `
                <h1 class="gold-text">${quizTitle}</h1>
                <div class="quiz-progress">
                    <p>${questionText} ${questionNumber} ${ofText} ${totalQuestions}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(questionNumber / totalQuestions) * 100}%"></div>
                    </div>
                </div>
                <div id="quiz-score" class="quiz-progress" style="margin-top: 1rem; background: #f8f9fa; color: #b8862b; font-size: 1.2rem; font-weight: bold;">
                    ${scoreLabel} <span id="quiz-score-value">${window.quizScore || 0}</span> / ${totalQuestions}
                </div>
                <div class="quiz-question">
                    <p>${qText}</p>
                    <form id="multi-answer-form-${index}">
                        <div class="quiz-options-group">${optionsHtml}</div>
                        <div style="display: flex; justify-content: center; margin: 18px 0 0 0;">
                            <button type="button" id="multi-submit-${index}" disabled>${submitText}</button>
                        </div>
                    </form>
                    <div style="margin-top: 18px; min-height: 32px; text-align: center;"><p id="full-feedback-${index}" style="margin:0;"></p></div>
                </div>
            `;

            // Logica per abilitare/disabilitare il bottone e limitare la selezione
            const checkboxes = Array.from(document.querySelectorAll(`#multi-answer-form-${index} .multi-answer`));
            const submitBtn = document.getElementById(`multi-submit-${index}`);

            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const checked = checkboxes.filter(c => c.checked);
                    // Se risposta singola, consenti solo una selezione
                    if (!isMultiAnswer) {
                        if (checked.length > 1) {
                            checkboxes.forEach(c => { if (c !== cb) c.checked = false; });
                        }
                    }
                    // Abilita il bottone solo se almeno una risposta è selezionata
                    submitBtn.disabled = checked.length === 0;
                });
            });

            document.getElementById(`multi-submit-${index}`).addEventListener('click', function() {
                checkFullAnswer(index);
            });
        } else {
            // Valutazione finale
            let quizzesDone = quizzes.length;
            let score = window.quizScore || 0;
            let percent = quizzesDone > 0 ? Math.round((score / quizzesDone) * 100) : 0;
            let valutazione = '';
            if (percent === 100) valutazione = window.languageManager ? window.languageManager.translate('valutazione_100') : '🌟 Genio di Sofia!';
            else if (percent >= 80) valutazione = window.languageManager ? window.languageManager.translate('valutazione_80') : '👏 Ottimo! Sei quasi un esperto!';
            else if (percent >= 60) valutazione = window.languageManager ? window.languageManager.translate('valutazione_60') : '😊 Bravo! Ma puoi fare di più!';
            else if (percent >= 40) valutazione = window.languageManager ? window.languageManager.translate('valutazione_40') : '😅 Non male, ma ripassa!';
            else valutazione = window.languageManager ? window.languageManager.translate('valutazione_0') : '🤔 Forse Sofia è ancora un mistero per te!';
            const congratsTitle = window.languageManager ? window.languageManager.translate('complimenti') : '🏆 Congratulazioni!';
            const scoreLabel = window.languageManager ? window.languageManager.translate('punteggio_label') : 'Punteggio:';
            const ofText = window.languageManager ? window.languageManager.translate('di') : 'di';
            elements.quizContainer.innerHTML = `
                <div class="quiz-completion">
                    <h1 class="gold-text">${congratsTitle}</h1>
                    <div class="quiz-question">
                        <p>${window.languageManager ? window.languageManager.translate('completato_tutti_quiz') : '🎉 Hai completato tutti i quiz su Sofia!'}</p>
                        <div id="quiz-score" class="quiz-progress" style="margin: 1rem auto 1.5rem auto; background: #f8f9fa; color: #b8862b; font-size: 1.2rem; font-weight: bold;">
                            ${scoreLabel} <span id="quiz-score-value">${score}</span> ${window.languageManager ? window.languageManager.translate('su') : 'su'} ${quizzesDone} <br><span style="font-size:1.1em;">${valutazione}</span>
                        </div>
                        <p>${window.languageManager ? window.languageManager.translate('grazie_per_aver_giocato') : 'Grazie per aver giocato! Ora conosci Sofia ancora meglio!'}</p>
                        <button onclick="window.location.href='home.php'">${window.languageManager ? window.languageManager.translate('torna_alla_home') : 'Torna alla Home 🏠'}</button>
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

        let isCorrect = false;
        if (JSON.stringify(checked) === JSON.stringify(correctAnswers)) {
            feedback.textContent = correctText;
            feedback.style.color = "green";
            submitBtn.disabled = true;
            submitBtn.textContent = window.languageManager ? window.languageManager.translate('corretto') : "Corretto! ✓";
            submitBtn.style.background = "linear-gradient(145deg, #28a745, #20c997)";
            isCorrect = true;
        } else {
            let correctLabels = quiz.correct.map(i => quiz.options[i]).join(', ');
            feedback.textContent = `${wrongText} ${correctLabels}`;
            feedback.style.color = "red";
            submitBtn.disabled = true;
            submitBtn.textContent = window.languageManager ? window.languageManager.translate('sbagliato') : "Sbagliato ✗";
            submitBtn.style.background = "linear-gradient(145deg, #dc3545, #c82333)";
        }

        // Aggiorna punteggio
        if (isCorrect) {
            window.quizScore = (window.quizScore || 0) + 1;
        }
        // Aggiorna visualizzazione punteggio
        const scoreSpan = document.getElementById('quiz-score-value');
        if (scoreSpan) scoreSpan.textContent = window.quizScore;

        // Update progress bar
        const startIndex = quizStartIndex;
        const totalQuestions = quizzes.length - startIndex;
        const currentIndex = index - startIndex;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const newWidth = Math.min(((currentIndex + 1) / totalQuestions) * 100, 100);
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