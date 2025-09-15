console.log('🚀 HOME.JS: Script iniziato');

document.addEventListener('DOMContentLoaded', () => {
    // TEST: la lingua dei quiz deve sempre essere uguale a quella selezionata
    function testQuizLanguageSync() {
        const storedLang = localStorage.getItem('selectedLanguage') || 'it';
        const quizLang = window.languageManager ? window.languageManager.currentLanguage : 'it';
        if (quizLang !== storedLang) {
            console.warn('[TEST] Lingua quiz desincronizzata! Atteso:', storedLang, 'Trovato:', quizLang);
            return false;
        } else {
            console.log('[TEST] Lingua quiz sincronizzata:', quizLang);
            return true;
        }
    }

    // Dopo la sincronizzazione, esegui il test
    setTimeout(testQuizLanguageSync, 200);
    // Sincronizza la lingua selezionata da localStorage (se diversa), anche se languageManager non è ancora pronto
    // Sincronizzazione lingua quiz home: forzata e affidabile anche su reload
    function forceHomeQuizLanguageAndRerender() {
        const storedLang = localStorage.getItem('selectedLanguage') || 'it';
        if (window.languageManager) {
            if (window.languageManager.currentLanguage !== storedLang) {
                window.languageManager.changeLanguage(storedLang);
            } else {
                // Se già corretta, rilancia il quiz per sicurezza
                if (typeof window.updateHomeQuizDisplay === 'function') {
                    window.updateHomeQuizDisplay();
                }
            }
            return true;
        }
        return false;
    }

    // Osserva finché languageManager non è pronto, poi forza lingua e rerender quiz
    (function waitAndSyncQuizLang() {
        if (!forceHomeQuizLanguageAndRerender()) {
            setTimeout(waitAndSyncQuizLang, 50);
        }
    })();
    console.log('✅ DOM LOADED: Pagina caricata');
    
    // ✅ MENU - Sempre per primo
    initBasicMenu();
    
    // ✅ GALLERY HOME - Usa l'elemento che ESISTE (home-gallery)
    const homeGallery = document.getElementById('home-gallery');
    const graduationVideo = document.getElementById('graduation-video');
    
    console.log('📋 ELEMENTI REALI TROVATI:');
    console.log('- home-gallery:', !!homeGallery);
    console.log('- graduation-video:', !!graduationVideo);
    
    // ✅ CARICA SUBITO IL HOME-GALLERY (che esiste)
    if (homeGallery) {
        console.log('🏠 HOME-GALLERY: Caricamento...');
        loadHomeGalleryNow();
    }
    
    // ✅ VIDEO DOPO
    if (graduationVideo) {
        setTimeout(() => {
            console.log('🎬 VIDEO: Inizializing...');
            loadVideoNow();
        }, 1000);
    }
    
    // ✅ RESTO DEL CODICE ESISTENTE
    initExistingFeatures();
});

function initBasicMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');
    
    if (menuToggle && menuLinks) {
        console.log('📱 MENU: OK');
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuLinks.classList.toggle('active');
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!menuLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuLinks.classList.remove('active');
            }
        });
    }
}

function loadHomeGalleryNow() {
    const homeGallery = document.getElementById('home-gallery');
    
    console.log('🔄 LOADING HOME GALLERY...');
    
    fetch('media-protection.php?file=media-list.json')
        .then(response => {
            console.log('🌐 FETCH STATUS:', response.status);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('📊 DATA RECEIVED:', data);
            
            const mediaFiles = Array.isArray(data) ? data : (Array.isArray(data.files) ? data.files : []);
            console.log('📁 MEDIA FILES:', mediaFiles.length);
            
            if (mediaFiles.length === 0) {
                throw new Error('No files found');
            }
            
            // Shuffle e prendi 4 per home
            const shuffled = mediaFiles.slice().sort(() => 0.5 - Math.random());
            let selectedMedia = shuffled.slice(0, 4);
            
            console.log('🎯 SELECTED MEDIA:', selectedMedia);
            
            // Render immediato
            renderHomeGallery(selectedMedia);
            
        })
        .catch(error => {
            console.error('❌ GALLERY ERROR:', error);
            showGalleryPlaceholders();
        });
}

function renderHomeGallery(files) {
    const homeGallery = document.getElementById('home-gallery');
    console.log('🎨 RENDERING HOME GALLERY...');
    
    // Clear existing
    homeGallery.innerHTML = '';
    
    files.forEach((file, index) => {
        const extension = String(file).split('.').pop().toLowerCase();
        let mediaElement;
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            mediaElement = document.createElement('img');
            mediaElement.src = `media-protection.php?file=${file}`;
            mediaElement.alt = `Momento ${index + 1}`;

            mediaElement.onload = () => console.log('✅ IMG OK:', file);
            mediaElement.onerror = (e) => {
                console.error('❌ IMG ERROR:', file, e);
                // Prova a fare una fetch per vedere la risposta HTTP
                fetch(`media-protection.php?file=${file}`)
                    .then(resp => {
                        if (!resp.ok) {
                            console.error(`❌ HTTP ERROR: ${resp.status} ${resp.statusText} per ${file}`);
                        } else {
                            console.error(`❌ IMG ERROR: Il file sembra esistere ma non è un'immagine valida o c'è un problema di CORS.`);
                        }
                    })
                    .catch(fetchErr => {
                        console.error('❌ FETCH ERROR:', fetchErr);
                    });
                mediaElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle">Immagine non disponibile</text></svg>';
            };
        } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
            mediaElement = document.createElement('video');
            mediaElement.src = `media-protection.php?file=${file}`;
            mediaElement.autoplay = true;
            mediaElement.loop = true;
            mediaElement.muted = true;
            mediaElement.playsInline = true;
            mediaElement.controls = false;
        } else {
            // Fallback
            mediaElement = document.createElement('img');
            mediaElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect width="100%" height="100%" fill="%23042a12"/><text x="50%" y="50%" font-size="14" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">Momento Iconico</text></svg>';
            mediaElement.alt = 'Momento iconico';
        }
        
        // Styles
        if (mediaElement) {
            mediaElement.style.width = '100%';
            mediaElement.style.height = '160px';
            mediaElement.style.objectFit = 'cover';
            mediaElement.style.borderRadius = '10px';
            mediaElement.style.boxShadow = '0 6px 14px rgba(0,0,0,0.12)';
        }
        
        // Link wrapper
        const linkElement = document.createElement('a');
    linkElement.href = 'photos.php';
        linkElement.appendChild(mediaElement);
        homeGallery.appendChild(linkElement);
    });
    
    console.log('✅ HOME GALLERY RENDERED');
}

function showGalleryPlaceholders() {
    const homeGallery = document.getElementById('home-gallery');
    console.log('🔄 SHOWING PLACEHOLDERS...');
    
    homeGallery.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const a = document.createElement('a');
    a.href = 'photos.php';
        
        const img = document.createElement('img');
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect width="100%" height="100%" fill="%23042a12"/><text x="50%" y="50%" font-size="14" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">Momento Iconico</text></svg>';
        img.alt = `Placeholder ${i + 1}`;
        img.style.width = '100%';
        img.style.height = '160px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '10px';
        img.style.boxShadow = '0 6px 14px rgba(0,0,0,0.12)';
        
        a.appendChild(img);
        homeGallery.appendChild(a);
    }
}

function loadVideoNow() {
    const graduationVideo = document.getElementById('graduation-video');
    
    console.log('🎬 LOADING VIDEO...');
    
    const video = document.createElement('video');
    video.src = 'media-protection.php?file=graduation/videolaurea.mp4';
    video.controls = true;
    video.preload = 'metadata';
    video.style.width = '100%';
    video.style.maxWidth = '600px';
    
    video.onloadedmetadata = () => {
        console.log('✅ VIDEO LOADED');
    };
    
    video.onerror = () => {
        console.error('❌ VIDEO ERROR');
        graduationVideo.innerHTML = `
            <div class="alert alert-warning text-center">
                <h5>⚠️ Video di laurea non disponibile</h5>
                <small>File: graduation/videolaurea.mp4</small>
            </div>
        `;
    };
    
    graduationVideo.innerHTML = '';
    graduationVideo.appendChild(video);
}

function initExistingFeatures() {
    // Language selector
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!languageDropdown.contains(e.target) && !languageBtn.contains(e.target)) {
                languageDropdown.classList.remove('show');
            }
        });
    }
    
    // ✅ MEMORY GAME - CODICE COMPLETO RIPRISTINATO
    initMemoryGame();
    
    // Preview buttons
    const quizBtn = document.querySelector('.quiz-preview-btn, .start-quiz-btn');
    if (quizBtn) {
    quizBtn.addEventListener('click', () => window.location.href = 'quiz.php');
    }
    
    const musicBtn = document.querySelector('.music-preview-btn, .start-music-btn');
    if (musicBtn) {
    musicBtn.addEventListener('click', () => window.location.href = 'music.php');
    }
}

// ✅ MEMORY GAME - CODICE COMPLETO ORIGINALE
let memoryGameImages = [];
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let errors = 0;
let maxErrors = 3;
let gameActive = false;

function initMemoryGame() {
    const memoryButtons = {
        easy: document.getElementById('memory-easy-btn'),
        medium: document.getElementById('memory-medium-btn'),
        hard: document.getElementById('memory-hard-btn')
    };

    Object.entries(memoryButtons).forEach(([difficulty, button]) => {
        if (button) {
            button.addEventListener('click', () => {
                console.log('🧠 Memory game started:', difficulty);
                startMemoryGame(difficulty);
            });
        }
    });
}

async function loadMemoryImages() {
    if (memoryGameImages.length > 0) return memoryGameImages;
    
    try {
        const response = await fetch('media-protection.php?file=media-list.json');
        const data = await response.json();

        const imageFiles = (data.files || []).filter(file => {
            const ext = file.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
        });
        
        memoryGameImages = imageFiles.slice(0, 8);
        return memoryGameImages;
    } catch (error) {
        console.error('Memory images loading error:', error);
        return [];
    }
}

function startMemoryGame(difficulty) {
    const memoryGrid = document.getElementById('memory-grid');
    const memoryGameIntro = document.getElementById('memory-game-intro');
    
    if (!memoryGrid) return;
    
    gameActive = true;
    errors = 0;
    matchedPairs = 0;
    flippedCards = [];
    
    loadMemoryImages().then(images => {
        if (images.length === 0) return;
        
        const pairs = difficulty === 'easy' ? 3 : (difficulty === 'medium' ? 4 : 6);
        const selectedImages = images.slice(0, pairs);
        const gameImages = [...selectedImages, ...selectedImages];
        
        // Shuffle
        for (let i = gameImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameImages[i], gameImages[j]] = [gameImages[j], gameImages[i]];
        }
        
        renderMemoryGrid(gameImages);
        
        if (memoryGameIntro) {
            memoryGameIntro.style.display = 'none';
        }
        if (memoryGrid) {
            memoryGrid.style.display = 'grid';
        }
    });
}

function renderMemoryGrid(images) {
    const memoryGrid = document.getElementById('memory-grid');
    if (!memoryGrid) return;
    
    gameCards = [];
    memoryGrid.innerHTML = '';
    
    files.forEach((file, index) => {
        const extension = String(file).split('.').pop().toLowerCase();
        let mediaElement;
        const t = window.languageManager ? translations[window.languageManager.currentLanguage] : translations.it;
        const unavailableText = window.languageManager ? window.languageManager.translate('immagine_non_disponibile') : (t.immagine_non_disponibile || 'Immagine non disponibile');
        const iconicText = window.languageManager ? window.languageManager.translate('momento_iconico') : (t.momento_iconico || 'Momento Iconico');
        if (["webp", "jpg", "jpeg", "png", "gif"].includes(extension)) {
            mediaElement = document.createElement('img');
            mediaElement.src = `media/${file}`;
            mediaElement.alt = file;
            mediaElement.className = 'gallery-img';
            mediaElement.onerror = function() {
                mediaElement.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='160'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' font-size='14' fill='%23999' text-anchor='middle' dominant-baseline='middle'>${unavailableText}</text></svg>`;
            };
        } else if (["mp4", "webm", "ogg"].includes(extension)) {
            mediaElement = document.createElement('video');
            mediaElement.src = `media/${file}`;
            mediaElement.controls = true;
            mediaElement.className = 'gallery-video';
            mediaElement.onerror = function() {
                mediaElement.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='160'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' font-size='14' fill='%23999' text-anchor='middle' dominant-baseline='middle'>${unavailableText}</text></svg>`;
            };
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='160'><rect width='100%' height='100%' fill='%23042a12'/><text x='50%' y='50%' font-size='14' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'>${iconicText}</text></svg>`;
            mediaElement.alt = iconicText;
            mediaElement.className = 'gallery-img';
        }
        card.addEventListener('click', () => flipCard(card));
        
        gameCards.push(card);
        memoryGrid.appendChild(card);
    });
}

function flipCard(card) {
    if (!gameActive || flippedCards.length >= 2 || card.classList.contains('flipped')) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        gameActive = false;
        setTimeout(() => {
            checkMatch();
        }, 600);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.image === card2.dataset.image;
    
    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === gameCards.length / 2) {
            setTimeout(() => showGameResult('win'), 500);
            return;
        }
    } else {
        errors++;
        updateErrorDisplay();
        
        if (errors >= maxErrors) {
            setTimeout(() => showGameResult('lose'), 500);
            return;
        }
        
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }
    
    flippedCards = [];
    gameActive = true;
}

function updateErrorDisplay() {
    const errorDisplay = document.getElementById('memory-errors');
    if (errorDisplay) {
        errorDisplay.textContent = errors;
    }
}

function showGameResult(result) {
    const memoryGrid = document.getElementById('memory-grid');
    const memoryGameIntro = document.getElementById('memory-game-intro');
    
    if (result === 'win') {
        alert('🎉 Complimenti! Hai vinto!');
    } else {
        alert('😔 Hai perso! Troppi errori.');
    }
    
    if (memoryGameIntro) {
        memoryGameIntro.style.display = 'block';
    }
    if (memoryGrid) {
        memoryGrid.style.display = 'none';
    }
}

// ✅ HOME QUIZ - CODICE COMPLETO ORIGINALE
const homeQuizContainer = document.getElementById('home-quiz-section');
let currentHomeQuizIndex = 0;
window.currentHomeQuizIndex = currentHomeQuizIndex;

function getHomeMultiQuizzes() {
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

function showHomeQuiz(index) {
    if (!homeQuizContainer) return;
    const quizzes = getHomeMultiQuizzes();
    currentHomeQuizIndex = index;
    window.currentHomeQuizIndex = index;

    if (index < quizzes.length) {
        const quiz = quizzes[index];
        const questionNumber = index + 1;
        const totalQuestions = quizzes.length;
    const quizTitle = window.languageManager ? window.languageManager.translate('quiz_title') : 'Quanto ne sai su Sofia?';
    const questionText = window.languageManager ? window.languageManager.translate('domanda') : 'Domanda';
    const ofText = window.languageManager ? window.languageManager.translate('di') : 'di';
    const submitText = window.languageManager ? window.languageManager.translate('invia_risposta') : "Invia Risposta";
    const scoreLabel = window.languageManager ? window.languageManager.translate('quiz_score_home_label') : 'Punteggio:';

        let optionsHtml = '';
        quiz.options.forEach((opt, i) => {
            optionsHtml += `<label class=\"multi-answer-label\"><input type=\"checkbox\" class=\"multi-answer\" value=\"${i}\"> ${opt}</label><br>`;
        });

        // Show score above the quiz
        homeQuizContainer.innerHTML = `
            <div id=\"home-quiz-score\" class=\"quiz-progress\" style=\"margin: 1rem auto 1.5rem auto; background: #f8f9fa; color: #b8862b; font-size: 1.2rem; font-weight: bold; text-align: center;\">
                ${scoreLabel} <span id=\"home-score-value\">${window.homeQuizScore || 0}</span>
            </div>
            <h2 class=\"gold-text\">${quizTitle}</h2>
            <div class=\"quiz-progress\">
                <p>${questionText} ${questionNumber} ${ofText} ${totalQuestions}</p>
                <div class=\"progress-bar\">
                    <div class=\"progress-fill\" style=\"width: ${((index + 1) / quizzes.length) * 100}%\"></div>
                </div>
            </div>
            <div class=\"quiz-question\">
                <p>${quiz.question}</p>
                <form id=\"home-multi-answer-form-${index}\">
                    <div class=\"quiz-options-group\">${optionsHtml}</div>
                    <div style=\"display: flex; justify-content: center; margin: 18px 0 0 0;\">
                        <button type=\"button\" id=\"home-multi-submit-${index}\">${submitText}</button>
                    </div>
                </form>
                <div style=\"margin-top: 18px; min-height: 32px; text-align: center;\"><p id=\"home-full-feedback-${index}\" style=\"margin:0;\"></p></div>
            </div>
        `;

        document.getElementById(`home-multi-submit-${index}`).addEventListener('click', function() {
            checkHomeFullAnswer(index);
        });
    } else {
        const congratsTitle = window.languageManager ? window.languageManager.translate('complimenti') : '🎉 Complimenti!';
        const goText = window.languageManager ? window.languageManager.translate('vai_al_quiz_completo') : 'Vai al quiz completo 🚀';
        homeQuizContainer.innerHTML = `
            <div class="quiz-completion">
                <h2 class="gold-text">${congratsTitle}</h2>
                <div class="quiz-question">
                    <p>${window.languageManager ? window.languageManager.translate('completato_tutti_quiz') : '🎉 Hai completato tutti i quiz su Sofia!'}</p>
                    <p>${window.languageManager ? window.languageManager.translate('grazie_per_aver_giocato') : 'Grazie per aver giocato! Ora conosci Sofia ancora meglio!'}</p>
                    <button onclick="window.location.href='quiz.php'">${goText}</button>
                </div>
            </div>
        `;
    }
    const maxHomeQuestions = 3;
    if (index >= maxHomeQuestions) {
        // Dopo 3 domande mostra il pulsante per continuare
    const continueText = window.languageManager ? window.languageManager.translate('quiz_home_continue') : "Vuoi continuare con il quiz completo?";
    const goText = window.languageManager ? window.languageManager.translate('quiz_home_andiamo') : "Sì, andiamo! 🚀";
        // Center the parent container
        homeQuizContainer.style.display = 'flex';
        homeQuizContainer.style.flexDirection = 'column';
        homeQuizContainer.style.alignItems = 'center';
        homeQuizContainer.style.justifyContent = 'center';
        homeQuizContainer.style.minHeight = '70vh';
        homeQuizContainer.innerHTML = `
            <div class="quiz-question" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 340px; min-height: 320px; max-width: 600px; width: 100%; background: rgba(255,255,255,0.95); border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                <h2 class="gold-text" style="text-align: center;">Quiz Home Completato</h2>
                <p style="text-align: center;">${continueText}</p>
                <div id="home-quiz-score" class="quiz-progress" style="margin: 1rem auto 1.5rem auto; background: #f8f9fa; color: #b8862b; font-size: 1.2rem; font-weight: bold; text-align: center;">
                    Punteggio: <span id="home-score-value">${window.homeQuizScore || 0}</span>
                </div>
                <button id="go-to-quiz-page-btn" style="background: linear-gradient(145deg, var(--verde-sx), var(--verde-dx)); margin-top: 1rem; align-self: center;">${goText}</button>
            </div>
        `;
        // Salva in sessione che sono state fatte le prime 3 domande e il punteggio
        sessionStorage.setItem('completedHomeQuizzes', 'true');
        sessionStorage.setItem('homeQuizScore', window.homeQuizScore || 0);
        sessionStorage.setItem('homeQuizCount', maxHomeQuestions);
        // Attach event listener to the continue button
        const goBtn = document.getElementById('go-to-quiz-page-btn');
        if (goBtn) {
            goBtn.addEventListener('click', function() {
                sessionStorage.setItem('completedHomeQuizzes', 'true');
                sessionStorage.setItem('homeQuizScore', window.homeQuizScore || 0);
                sessionStorage.setItem('homeQuizCount', maxHomeQuestions);
                window.location.href = 'quiz.php';
            });
        }
    }
}

function checkHomeFullAnswer(index) {
    const quizzes = getHomeMultiQuizzes();
    const quiz = quizzes[index];
    const correctAnswers = quiz.correct.sort();
    const checked = Array.from(document.querySelectorAll(`#home-multi-answer-form-${index} .multi-answer:checked`)).map(el => parseInt(el.value)).sort();
    const feedback = document.getElementById(`home-full-feedback-${index}`);
    const submitBtn = document.getElementById(`home-multi-submit-${index}`);

    const correctText = window.languageManager ? window.languageManager.translate('risposta_corretta') : "🎉 Perfetto! Risposta corretta!";
    const wrongText = window.languageManager ? window.languageManager.translate('risposta_sbagliata') : "❌ Non proprio! La risposta corretta era:";

    if (JSON.stringify(checked) === JSON.stringify(correctAnswers)) {
        feedback.textContent = correctText;
        feedback.style.color = "green";
        submitBtn.disabled = true;
        submitBtn.textContent = window.languageManager ? window.languageManager.translate('corretto') : "Corretto! ✓";
        submitBtn.style.background = "linear-gradient(145deg, #28a745, #20c997)";
        // Increment score
        window.homeQuizScore = (window.homeQuizScore || 0) + 1;
    } else {
        let correctLabels = quiz.correct.map(i => quiz.options[i]).join(', ');
        feedback.textContent = `${wrongText} ${correctLabels}`;
        feedback.style.color = "red";
        submitBtn.disabled = true;
        submitBtn.textContent = window.languageManager ? window.languageManager.translate('sbagliato') : "Sbagliato ✗";
        submitBtn.style.background = "linear-gradient(145deg, #dc3545, #c82333)";
    }

    // Update and persist score in sessionStorage
    sessionStorage.setItem('homeQuizScore', window.homeQuizScore || 0);
    // Update score display in real time if present
    const scoreValue = document.getElementById('home-score-value');
    if (scoreValue) {
        scoreValue.textContent = window.homeQuizScore || 0;
    }

    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const newWidth = Math.min(((index + 1) / quizzes.length) * 100, 100);
        progressFill.style.width = `${newWidth}%`;
    }

    // Show next quiz after a delay
    setTimeout(() => {
        currentHomeQuizIndex++;
        window.currentHomeQuizIndex = currentHomeQuizIndex;
        showHomeQuiz(currentHomeQuizIndex);
    }, 2500);
}

window.updateHomeQuizDisplay = function() {
    currentHomeQuizIndex = window.currentHomeQuizIndex || 0;
    showHomeQuiz(currentHomeQuizIndex);
};
window.checkHomeFullAnswer = checkHomeFullAnswer;

if (homeQuizContainer) {
    showHomeQuiz(currentHomeQuizIndex);
}

// ✅ RANDOM SPOTIFY SONG - CODICE COMPLETO ORIGINALE
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

const randomSongContainer = document.getElementById('random-song-container');
if (randomSongContainer && songUrls.length > 0) {
    const randomIndex = Math.floor(Math.random() * songUrls.length);
    const randomSongUrl = songUrls[randomIndex];
    
    randomSongContainer.innerHTML = `
        <iframe data-testid="embed-iframe" style="border-radius:8px" 
                src="${randomSongUrl}" 
                width="100%" height="170" frameBorder="0" allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
        </iframe>
    `;
}

// ✅ ICONIC MOMENTS GALLERY - CODICE DUPLICATO MA MANTENUTO PER COMPATIBILITÀ
const homeGalleryDuplicate = document.getElementById('home-gallery');

if (homeGalleryDuplicate && !homeGalleryDuplicate.hasChildNodes()) {
    fetch('media-protection.php?file=media-list.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const mediaFiles = Array.isArray(data) ? data : (Array.isArray(data.files) ? data.files : []);
            const shuffled = mediaFiles.slice().sort(() => 0.5 - Math.random());
            let selectedMedia = shuffled.slice(0, 4);

            if (selectedMedia.length === 0) {
                selectedMedia = ['__placeholder__', '__placeholder__', '__placeholder__', '__placeholder__'];
            } else if (selectedMedia.length < 4) {
                let i = 0;
                while (selectedMedia.length < 4) {
                    selectedMedia.push(selectedMedia[i % selectedMedia.length]);
                    i++;
                }
            }

            homeGalleryDuplicate.innerHTML = '';

            selectedMedia.forEach(file => {
                let mediaElement;
                if (file === '__placeholder__') {
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
                        mediaElement.controls = false;
                    } else {
                        mediaElement = document.createElement('img');
                        mediaElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23042a12"/><text x="50%" y="50%" font-size="20" fill="%23ffffff" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Formato non supportato</text></svg>';
                        mediaElement.alt = 'Formato non supportato';
                    }
                }

                if (mediaElement) {
                    mediaElement.style.width = '100%';
                    mediaElement.style.height = '160px';
                    mediaElement.style.objectFit = 'cover';
                    mediaElement.style.borderRadius = '10px';
                    mediaElement.style.boxShadow = '0 6px 14px rgba(0,0,0,0.12)';
                }

                const linkElement = document.createElement('a');
                linkElement.href = 'photos.php';
                linkElement.appendChild(mediaElement);
                homeGalleryDuplicate.appendChild(linkElement);
            });
        })
        .catch(error => {
            console.error('Errore nel caricare la galleria:', error);
            if (homeGalleryDuplicate) {
                homeGalleryDuplicate.innerHTML = '';
                for (let i = 0; i < 4; i++) {
                    const a = document.createElement('a');
                    a.href = 'photos.php';
                    const img = document.createElement('img');
                    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23042a12"/><text x="50%" y="50%" font-size="20" fill="%23ffffff" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Momenti iconici (apri la galleria)</text></svg>';
                    img.alt = 'Placeholder - Momenti iconici';
                    img.style.width = '100%';
                    img.style.height = '160px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '10px';
                    img.style.boxShadow = '0 6px 14px rgba(0,0,0,0.12)';
                    a.appendChild(img);
                    homeGalleryDuplicate.appendChild(a);
                }
            }
        });
}

// ✅ FUNZIONI HELPER ORIGINALI
function checkHomeAnswer(index) {
    const quiz = quizzes[index];
    const correctAnswer = window.languageManager ? window.languageManager.translate(quiz.answerKey) : "tanto";
    const userAnswer = document.getElementById(`home-answer-${index}`)?.value.trim();
    const feedback = document.getElementById(`home-feedback-${index}`);
    const inputField = document.getElementById(`home-answer-${index}`);
    const button = inputField?.nextElementSibling;
    
    if (!userAnswer || !feedback || !inputField || !button) return;
    
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
        
        inputField.style.animation = "shake 0.5s";
        setTimeout(() => {
            inputField.style.animation = "";
        }, 500);
        
        setTimeout(() => {
            currentQuizIndex++;
            window.currentQuizIndex = currentQuizIndex;
            showQuiz(currentQuizIndex);
        }, 2500);
    }
}

console.log('📄 HOME.JS: Script completato');
