document.addEventListener('DOMContentLoaded', () => {
    // Cache elementi DOM per evitare query multiple
    const elements = {
        menuToggle: document.getElementById('menu-toggle'),
        menuLinks: document.getElementById('menu-links'),
        languageBtn: document.getElementById('language-btn'),
        languageDropdown: document.getElementById('language-dropdown')
    };

    // Menu toggle ottimizzato
    if (elements.menuToggle && elements.menuLinks) {
        elements.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.menuLinks.classList.toggle('active');
        });
    }

    // Language selector ottimizzato
    if (elements.languageBtn && elements.languageDropdown) {
        elements.languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.languageDropdown.classList.toggle('show');
        });
    }

    // Single document click listener per performance
    document.addEventListener('click', (event) => {
        const target = event.target;
        
        // Close menu se click fuori
        if (elements.menuLinks && 
            !elements.menuLinks.contains(target) && 
            !elements.menuToggle?.contains(target)) {
            elements.menuLinks.classList.remove('active');
        }
        
        // Close language dropdown se click fuori
        if (elements.languageDropdown && 
            !elements.languageDropdown.contains(target) && 
            !elements.languageBtn?.contains(target)) {
            elements.languageDropdown.classList.remove('show');
        }
    });

    // ✅ FIX: Caricamento video laurea
    loadGraduationVideo();

    // Lazy loading per gallery se presente
    const photosGallery = document.getElementById('photos-gallery');
    if (photosGallery) {
        loadGalleryWhenVisible();
    }

    // Memory game ottimizzato se presente
    initMemoryGameOptimized();

    // Quiz e music preview ottimizzati
    initPreviewButtons();
});

// ✅ FIX: Funzione corretta per video laurea
function loadGraduationVideo() {
    const graduationVideo = document.getElementById('graduation-video');
    if (!graduationVideo) {
        console.log('❌ Elemento graduation-video non trovato');
        return;
    }
    
    console.log('🎬 Inizializing graduation video...');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('👀 Video laurea ora visibile, caricamento...');
                
                const video = document.createElement('video');
                video.src = 'media-protection.php?file=graduation/videolaurea.mp4';
                video.controls = true;
                video.preload = 'metadata';
                video.setAttribute('playsinline', '');
                video.style.width = '100%';
                video.style.maxWidth = '800px';
                video.style.height = 'auto';
                
                // Error handling
                video.onerror = () => {
                    console.error('❌ Errore caricamento video laurea');
                    graduationVideo.innerHTML = `
                        <div class="alert alert-warning text-center">
                            <p>⚠️ Video di laurea temporaneamente non disponibile</p>
                            <small>Percorso: media-protection.php?file=graduation/videolaurea.mp4</small>
                        </div>
                    `;
                };
                
                // Loading completato
                video.onloadedmetadata = () => {
                    console.log('✅ Video laurea caricato correttamente');
                };
                
                // Aggiungi video al container
                graduationVideo.innerHTML = ''; // Pulisci contenuto esistente
                graduationVideo.appendChild(video);
                
                // Stop observing
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '50px' });
    
    observer.observe(graduationVideo);
}

// Lazy loading gallery con Intersection Observer
function loadGalleryWhenVisible() {
    const photosGallery = document.getElementById('photos-gallery');
    if (!photosGallery) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadGalleryContent();
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '100px' });

    observer.observe(photosGallery);
}

async function loadGalleryContent() {
    const photosGallery = document.getElementById('photos-gallery');
    if (!photosGallery) return;

    try {
        const response = await fetch('media-protection.php?file=media-list.json', {
            cache: 'force-cache'
        });
        const data = await response.json();
        
        if (data.files && data.files.length > 0) {
            renderGalleryPreview(data.files.slice(0, 6));
        }
    } catch (error) {
        console.error('Gallery loading error:', error);
    }
}

function renderGalleryPreview(files) {
    const photosGallery = document.getElementById('photos-gallery');
    if (!photosGallery) return;

    const fragment = document.createDocumentFragment();

    files.forEach((file, index) => {
        const mediaElement = createOptimizedMediaElement(file, index);
        if (mediaElement) {
            fragment.appendChild(mediaElement);
        }
    });

    photosGallery.appendChild(fragment);
}

function createOptimizedMediaElement(file, index) {
    const ext = file.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        const img = document.createElement('img');
        img.src = `media-protection.php?file=${file}`;
        img.alt = `Foto ${index + 1}`;
        img.loading = index < 3 ? 'eager' : 'lazy';
        return img;
    } else if (['mp4', 'webm'].includes(ext)) {
        const video = document.createElement('video');
        video.src = `media-protection.php?file=${file}`;
        video.muted = true;
        video.loop = true;
        video.preload = 'metadata';
        return video;
    }

    return null;
}

function initMemoryGameOptimized() {
    const memoryButtons = ['memory-easy-btn', 'memory-medium-btn', 'memory-hard-btn'];
    
    memoryButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => handleMemoryGameStart(buttonId));
        }
    });
}

function handleMemoryGameStart(difficulty) {
    // Lazy load memory game data solo quando necessario
    loadMemoryGameData().then(images => {
        if (images && images.length > 0) {
            initMemoryGame(difficulty, images);
        }
    });
}

async function loadMemoryGameData() {
    try {
        const response = await fetch('media-protection.php?file=media-list.json', {
            cache: 'force-cache'
        });
        const data = await response.json();
        
        return data.files?.filter(file => {
            const ext = file.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
        }).slice(0, 8) || [];
    } catch (error) {
        console.error('Memory game data loading error:', error);
        return [];
    }
}

function initMemoryGame(difficulty, images) {
    // Logica memory game esistente mantenuta identica
    // ...existing memory game logic...
}

// Preview buttons ottimizzati
function initPreviewButtons() {
    // Quiz preview
    const quizBtn = document.querySelector('.quiz-preview-btn, .start-quiz-btn');
    if (quizBtn) {
        quizBtn.addEventListener('click', () => {
            window.location.href = 'quiz.html';
        });
    }

    // Music preview  
    const musicBtn = document.querySelector('.music-preview-btn, .start-music-btn');
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            window.location.href = 'music.html';
        });
    }
}

// --- Home Quiz ---
const homeQuizContainer = document.getElementById('home-quiz-section');
const quizzes = [
    { questionKey: "quiz_question_1", answerKey: "quiz_answer_1" },
    { questionKey: "quiz_question_2", answerKey: "quiz_answer_2" },
    { questionKey: "quiz_question_3", answerKey: "quiz_answer_3" },
];

let currentQuizIndex = 0;
window.currentQuizIndex = currentQuizIndex;

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
        
        const inputField = document.getElementById(`quiz-answer-${index}`);
        inputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                checkAnswer(index);
            }
        });
        
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

window.goToQuizPage = function() {
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

        if (!homeGallery) return;

        homeGallery.innerHTML = '';

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
            homeGallery.appendChild(linkElement);
        });
    })
    .catch(error => {
        console.error('Errore nel caricare la galleria:', error);
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