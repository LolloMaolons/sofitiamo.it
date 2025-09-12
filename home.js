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

    // Funzione per caricare il video di laurea (solo se autenticato)
    function loadGraduationVideo() {
        const videoContainer = document.getElementById('graduation-video');
        if (!videoContainer) return;

        // Crea solo il video senza titolo duplicato (il titolo è già nell'HTML)
        videoContainer.innerHTML = `
            <video controls class="graduation-video-player">
                <source src="media-protection.php?file=videolaurea.mp4" type="video/mp4">
                Il tuo browser non supporta il tag video.
            </video>
        `;
    }

    // CARICA IL VIDEO DI LAUREA QUI
    loadGraduationVideo();

    // --- Home Quiz ---
    const homeQuizContainer = document.getElementById('home-quiz-section');
    const quizzes = [
        { questionKey: "quiz_question_1", answerKey: "quiz_answer_1" },
        { questionKey: "quiz_question_2", answerKey: "quiz_answer_2" },
        { questionKey: "quiz_question_3", answerKey: "quiz_answer_3" },
    ];

    let currentQuizIndex = 0;
    // Make it globally accessible for language changes
    window.currentQuizIndex = currentQuizIndex;

    // AGGIUNGI QUESTA FUNZIONE
    // Verrà chiamata da translations.js per forzare l'aggiornamento del quiz.
    window.updateHomeQuizDisplay = function() {
        showQuiz(window.currentQuizIndex);
    }

    function showQuiz(index) {
        if (index < quizzes.length) {
            const quiz = quizzes[index];
            const questionText = window.languageManager ? window.languageManager.translate(quiz.questionKey) : "🤔 Quanto puzza il culo di Sofia?";
            const placeholderText = window.languageManager ? window.languageManager.translate('inserisci_risposta') : "Inserisci la tua risposta...";
            const submitText = window.languageManager ? window.languageManager.translate('invia_risposta') : "Invia Risposta";
            
            homeQuizContainer.innerHTML = `
                <div class="quiz-question">
                    <p>${questionText}</p>
                    <input type="text" id="quiz-answer-${index}" placeholder="${placeholderText}">
                    <button onclick="checkAnswer(${index})">${submitText}</button>
                    <p id="feedback-${index}"></p>
                </div>
            `;
            
            // Add Enter key listener to the input field
            const inputField = document.getElementById(`quiz-answer-${index}`);
            inputField.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    checkAnswer(index);
                }
            });
            
            // Focus on input field for better UX
            inputField.focus();
        } else {
            const completedText = window.languageManager ? window.languageManager.translate('completato_home_quiz') : "🎉 Complimenti! Hai completato tutti i quiz della home!";
            const continueText = window.languageManager ? window.languageManager.translate('vuoi_continuare') : "Vuoi continuare con il quiz completo?";
            const goText = window.languageManager ? window.languageManager.translate('si_andiamo') : "Sì, andiamo! 🚀";
            
            homeQuizContainer.innerHTML = `
                <div class="quiz-question">
                    <p>${completedText}</p>
                    <p>${continueText}</p>
                    <button onclick="goToQuizPage()" style="background: linear-gradient(145deg, var(--verde-sx), var(--verde-dx)); margin-top: 1rem;">${goText}</button>
                </div>
            `;
        }
    }

    window.checkAnswer = function(index) {
        const quiz = quizzes[index];
        const correctAnswer = window.languageManager ? window.languageManager.translate(quiz.answerKey) : "tanto";
        const userAnswer = document.getElementById(`quiz-answer-${index}`).value.trim();
        const feedback = document.getElementById(`feedback-${index}`);
        const inputField = document.getElementById(`quiz-answer-${index}`);
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
            
            setTimeout(() => {
                currentQuizIndex++;
                window.currentQuizIndex = currentQuizIndex;
                showQuiz(currentQuizIndex);
            }, 1500);
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
            
            // Passa alla domanda successiva dopo aver mostrato la soluzione
            setTimeout(() => {
                currentQuizIndex++;
                window.currentQuizIndex = currentQuizIndex;
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

    // --- Random Music Song ---
    const songUrls = [
        'https://open.spotify.com/embed/track/0KzAbK6nItSqNh8q70tb0K?utm_source=generator',
        'https://open.spotify.com/embed/track/0jWgAnTrNZmOGmqgvHhZEm?utm_source=generator',
        'https://open.spotify.com/embed/track/0xahPNJVFHGMEFxu9kergk?utm_source=generator',
        'https://open.spotify.com/embed/track/474uVhyGgK5MtY9gMcDgGl?utm_source=generator',
        'https://open.spotify.com/embed/track/2ZWlPOoWh0626oTaHrnl2a?utm_source=generator',
        'https://open.spotify.com/embed/track/1mBSWayaS9nnqLvZNdOdL7?utm_source=generator',
        'https://open.spotify.com/embed/track/4kzOYNpDNmkSGs9w6Z7dVB?utm_source=generator',
        'https://open.spotify.com/embed/track/6VzcQuzTNTMFnJ6rBSaLH9?utm_source=generator',
        'https://open.spotify.com/embed/track/0JXXNGljqupsJaZsgSbMZV?utm_source=generator',
        'https://open.spotify.com/embed/track/1uAOCTevGnyKIDbgZdOCnE?utm_source=generator',
        'https://open.spotify.com/embed/track/1MrSbSu9UNo7Aucwrf32WJ?utm_source=generator',
        'https://open.spotify.com/embed/track/1oAwsWBovWRIp7qLMGPIet?utm_source=generator',
        'https://open.spotify.com/embed/track/3xwNG8evnrOMelmAJ9RxJ1?utm_source=generator',
        'https://open.spotify.com/embed/track/1UZOjK1BwmwWU14Erba9CZ?utm_source=generator',
        'https://open.spotify.com/embed/track/0WI4Oe17LXAWCekzAEPCWi?utm_source=generator',
        'https://open.spotify.com/embed/track/37C6DyoMu75ViTiwqxV4bY?utm_source=generator',
        'https://open.spotify.com/embed/track/6BsxtJ3aKkc3KqB734VaYJ?utm_source=generator'
    ];

    // Load random song
    const randomSongContainer = document.getElementById('random-song-container');
    if (randomSongContainer) {
        const randomIndex = Math.floor(Math.random() * songUrls.length);
        const randomSongUrl = songUrls[randomIndex];
        
        randomSongContainer.innerHTML = `
            <iframe data-testid="embed-iframe" style="border-radius:8px" 
                    src="${randomSongUrl}" 
                    width="100%" height="200" frameBorder="0" allowfullscreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
            </iframe>
        `;
    }

    // --- Iconic Moments Gallery ---
    const homeGallery = document.getElementById('home-gallery');

    // Crea un file 'media-list.json' nella cartella 'media' con questo formato:
    // { "files": ["foto1.jpg", "video1.mp4", "foto2.png"] }
    fetch('media-protection.php?file=media-list.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            // Normalizza l'array dei file
            const mediaFiles = Array.isArray(data) ? data : (Array.isArray(data.files) ? data.files : []);
            // Shuffle in modo sicuro (non modificare originale se non necessario)
            const shuffled = mediaFiles.slice().sort(() => 0.5 - Math.random());
            // Se ci sono meno di 4 elementi, verranno duplicati fino a 4;
            // se non ce ne sono, verranno usati placeholder
            let selectedMedia = shuffled.slice(0, 4);

            if (selectedMedia.length === 0) {
                // Nessun file: crea 4 placeholder
                selectedMedia = ['__placeholder__', '__placeholder__', '__placeholder__', '__placeholder__'];
            } else if (selectedMedia.length < 4) {
                // Duplica elementi esistenti fino ad avere 4 elementi
                let i = 0;
                while (selectedMedia.length < 4) {
                    selectedMedia.push(selectedMedia[i % selectedMedia.length]);
                    i++;
                }
            }

            // In caso homeGallery non esista, esci silenziosamente
            if (!homeGallery) return;

            // Pulisci eventuali contenuti precedenti
            homeGallery.innerHTML = '';

            selectedMedia.forEach(file => {
                let mediaElement;
                if (file === '__placeholder__') {
                    // Placeholder SVG inline
                    mediaElement = document.createElement('img');
                    mediaElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23042a12"/><text x="50%" y="50%" font-size="20" fill="%23ffffff" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Momenti iconici (apri la galleria)</text></svg>';
                    mediaElement.alt = 'Placeholder - Momenti iconici';
                } else {
                    const extension = String(file).split('.').pop().toLowerCase();
                    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                        mediaElement = document.createElement('img');
                        mediaElement.src = `media-protection.php?file=${file}`;
                        mediaElement.alt = `Momento: ${file}`;
                    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                        mediaElement = document.createElement('video');
                        mediaElement.src = `media-protection.php?file=${file}`;
                        mediaElement.autoplay = true;
                        mediaElement.loop = true;
                        mediaElement.muted = true;
                        mediaElement.playsInline = true;
                        mediaElement.controls = false; // mantiene aspetto gallery
                    } else {
                        // Se estensione sconosciuta, usa placeholder
                        mediaElement = document.createElement('img');
                        mediaElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23042a12"/><text x="50%" y="50%" font-size="20" fill="%23ffffff" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Formato non supportato</text></svg>';
                        mediaElement.alt = 'Formato non supportato';
                    }
                }

                // Assicura classi/attributi di stile coerenti
                if (mediaElement) {
                    mediaElement.style.width = '100%';
                    mediaElement.style.height = '160px';
                    mediaElement.style.objectFit = 'cover';
                    mediaElement.style.borderRadius = '10px';
                    mediaElement.style.boxShadow = '0 6px 14px rgba(0,0,0,0.12)';
                }

                // Crea link che avvolge l'elemento media
                const linkElement = document.createElement('a');
                linkElement.href = 'photos.html';
                linkElement.appendChild(mediaElement);
                homeGallery.appendChild(linkElement);
            });
        })
        .catch(error => {
            console.error('Errore nel caricare la galleria:', error);
            // Fallback: mostra sempre 4 placeholder
            if (homeGallery) {
                homeGallery.innerHTML = '';
                for (let i = 0; i < 4; i++) {
                    const a = document.createElement('a');
                    a.href = 'photos.html';
                    const img = document.createElement('img');
                    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23042a12"/><text x="50%" y="50%" font-size="20" fill="%23ffffff" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Momenti iconici (apri la galleria)</text></svg>';
                    img.alt = 'Placeholder - Momenti iconici';
                    img.style.width = '100%';
                    img.style.height = '160px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '10px';
                    img.style.boxShadow = '0 6px 14px rgba(0,0,0,0.12)';
                    a.appendChild(img);
                    homeGallery.appendChild(a);
                }
            }
        });
});

// La tua funzione checkHomeAnswer rimane invariata
function checkHomeAnswer(index) {
    const quiz = quizzes[index];
    const correctAnswer = window.languageManager ? window.languageManager.translate(quiz.answerKey) : "tanto";
    const userAnswer = document.getElementById(`home-answer-${index}`).value.trim();
    const feedback = document.getElementById(`home-feedback-${index}`);
    const inputField = document.getElementById(`home-answer-${index}`);
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
        
        setTimeout(() => {
            currentQuizIndex++;
            window.currentQuizIndex = currentQuizIndex;
            showQuiz(currentQuizIndex);
        }, 1500);
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
        
        // Passa alla domanda successiva dopo aver mostrato la soluzione
        setTimeout(() => {
            currentQuizIndex++;
            window.currentQuizIndex = currentQuizIndex;
            showQuiz(currentQuizIndex);
        }, 2500);
    }
}