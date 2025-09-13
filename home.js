console.log('🚀 HOME.JS: Script iniziato');

document.addEventListener('DOMContentLoaded', () => {
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
            mediaElement.onerror = () => {
                console.error('❌ IMG ERROR:', file);
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
        linkElement.href = 'photos.html';
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
        a.href = 'photos.html';
        
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
        quizBtn.addEventListener('click', () => window.location.href = 'quiz.html');
    }
    
    const musicBtn = document.querySelector('.music-preview-btn, .start-music-btn');
    if (musicBtn) {
        musicBtn.addEventListener('click', () => window.location.href = 'music.html');
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
    
    images.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.image = image;
        card.dataset.index = index;
        
        const cardInner = document.createElement('div');
        cardInner.className = 'memory-card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'memory-card-front';
        cardFront.textContent = '?';
        
        const cardBack = document.createElement('div');
        cardBack.className = 'memory-card-back';
        const img = document.createElement('img');
        img.src = `media-protection.php?file=${image}`;
        img.alt = 'Memory card';
        img.loading = 'lazy';
        cardBack.appendChild(img);
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
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
const quizzes = [
    { questionKey: "quiz_question_1", answerKey: "quiz_answer_1" },
    { questionKey: "quiz_question_2", answerKey: "quiz_answer_2" },
    { questionKey: "quiz_question_3", answerKey: "quiz_answer_3" },
];

let currentQuizIndex = 0;
window.currentQuizIndex = currentQuizIndex;

// Funzione per mostrare il quiz corrente
function showQuiz(index) {
    if (!homeQuizContainer) return;

    // Sincronizza currentQuizIndex con window.currentQuizIndex
    currentQuizIndex = index;
    window.currentQuizIndex = index;

    if (index < quizzes.length) {
        const quiz = quizzes[index];
        const questionText = window.languageManager ? window.languageManager.translate(quiz.questionKey) : "🤔 Quanto puzza il culo di Sofia?";
        const placeholderText = window.languageManager ? window.languageManager.translate('inserisci_risposta') : "Inserisci la tua risposta...";
        const submitText = window.languageManager ? window.languageManager.translate('invia_risposta') : "Invia Risposta";

        homeQuizContainer.innerHTML = `
            <div class="quiz-question">
                <p>${questionText}</p>
                <input type="text" id="quiz-answer-${index}" placeholder="${placeholderText}">
                <button id="quiz-submit-${index}">${submitText}</button>
                <p id="feedback-${index}"></p>
            </div>
        `;

        const inputField = document.getElementById(`quiz-answer-${index}`);
        const button = document.getElementById(`quiz-submit-${index}`);
        if (inputField) {
            inputField.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    checkAnswer(index);
                }
            });
            inputField.focus();
        }
        if (button) {
            button.addEventListener('click', function() {
                checkAnswer(index);
            });
        }
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

// Funzione per controllare la risposta
function checkAnswer(index) {
    const quiz = quizzes[index];
    const correctAnswer = window.languageManager ? window.languageManager.translate(quiz.answerKey) : "tanto";
    const userAnswer = document.getElementById(`quiz-answer-${index}`)?.value.trim();
    const feedback = document.getElementById(`feedback-${index}`);
    const inputField = document.getElementById(`quiz-answer-${index}`);
    const button = document.getElementById(`quiz-submit-${index}`);

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

// Espone le funzioni globalmente per il cambio lingua e per i bottoni
window.updateHomeQuizDisplay = function() {
    currentQuizIndex = window.currentQuizIndex || 0;
    showQuiz(currentQuizIndex);
};
window.checkAnswer = checkAnswer;
window.goToQuizPage = function() {
    sessionStorage.setItem('completedHomeQuizzes', 'true');
    window.location.href = 'quiz.html';
};

// Mostra il primo quiz all'avvio
if (homeQuizContainer) {
    showQuiz(currentQuizIndex);
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
                width="100%" height="200" frameBorder="0" allowfullscreen="" 
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
                linkElement.href = 'photos.html';
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
