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

    // Memory Game Variables
    let memoryGameImages = [];
    let gameCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let errors = 0;
    let maxErrors = 3;
    let gameActive = false;
    let currentDifficulty = null;

    // Memory Game Elements
    const memoryIntro = document.getElementById('memory-game-intro');
    const memoryBoard = document.getElementById('memory-game-board');
    const memoryGameOver = document.getElementById('memory-game-over');
    const memoryGrid = document.getElementById('memory-grid');
    const memoryErrors = document.getElementById('memory-errors');
    const memoryPairs = document.getElementById('memory-pairs');
    const memoryResultTitle = document.getElementById('memory-result-title');
    const memoryResultMessage = document.getElementById('memory-result-message');


    // Memory Game Buttons
    const easyBtn = document.getElementById('memory-easy-btn');
    const mediumBtn = document.getElementById('memory-medium-btn');
    const hardBtn = document.getElementById('memory-hard-btn');
    const restartBtn = document.getElementById('memory-restart-btn');
    const playAgainBtn = document.getElementById('memory-play-again-btn');

    // Aggiorna errori/coppie in tempo reale al cambio lingua
    function updateMemoryStatsAndGameOverText() {
        // Aggiorna errori/coppie
        updateMemoryStats();
        // Aggiorna testo game over se visibile
        if (!memoryGameOver.classList.contains('hidden')) {
            const won = memoryResultTitle.classList.contains('gold-text');
            if (won) {
                const congratsText = window.languageManager ? window.languageManager.translate('complimenti') : '🎉 Complimenti! 🎉';
                const wonText = window.languageManager ? window.languageManager.translate('hai_vinto') : 'Hai vinto il Memory Game! La tua memoria è fantastica!';
                memoryResultTitle.textContent = congratsText;
                memoryResultTitle.className = 'gold-text';
                memoryResultMessage.textContent = wonText;
            } else {
                const gameOverText = window.languageManager ? window.languageManager.translate('game_over') : '😔 Game Over';
                const retryText = window.languageManager ? window.languageManager.translate('riprova') : 'Hai esaurito i tentativi. Riprova per migliorare la tua memoria!';
                memoryResultTitle.textContent = gameOverText;
                memoryResultTitle.style.color = '#c92a2a';
                memoryResultMessage.textContent = retryText;
            }
        }
    }

    if (window.languageManager && typeof window.languageManager.on === 'function') {
        window.languageManager.on('change', updateMemoryStatsAndGameOverText);
    } else {
        // fallback: osserva la lingua ogni 200ms (se non c'è event system)
        let lastLang = window.languageManager && window.languageManager.currentLanguage;
        setInterval(() => {
            if (window.languageManager && window.languageManager.currentLanguage !== lastLang) {
                lastLang = window.languageManager.currentLanguage;
                updateMemoryStatsAndGameOverText();
            }
        }, 200);
    }

    // Load memory game images (prioritize loading when user clicks)
    function loadMemoryImages(forceReload = false) {
        if (memoryGameImages.length > 0 && !forceReload) return Promise.resolve();
        return fetch('media-protection.php?file=media-list.json')
            .then(response => response.json())
            .then(data => {
                // Filter only image files (exclude videos)
                const imageFiles = data.files.filter(file => {
                    const extension = file.split('.').pop().toLowerCase();
                    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
                });
                memoryGameImages = imageFiles;
            })
            .catch(error => {
                console.error('Errore nel caricamento delle immagini per il memory:', error);
                memoryGameImages = [];
            });
    }

    // Start memory game
    function startMemoryGame(difficulty) {
        // Always reload images for memory to prioritize loading
        loadMemoryImages(true).then(() => {
            if (memoryGameImages.length === 0) {
                alert('Errore nel caricamento delle immagini. Riprova più tardi.');
                return;
            }

            currentDifficulty = difficulty;
            const numPairs = difficulty === 'easy' ? 3 : (difficulty === 'medium' ? 4 : 5);
            const totalCards = numPairs * 2;

            // Reset game state
            gameCards = [];
            flippedCards = [];
            matchedPairs = 0;
            errors = 0;
            gameActive = false;

            // Select random images for the game
            const shuffledImages = [...memoryGameImages].sort(() => Math.random() - 0.5);
            const selectedImages = shuffledImages.slice(0, numPairs);

            // Create pairs
            const cardImages = [...selectedImages, ...selectedImages];

            // Shuffle cards
            cardImages.sort(() => Math.random() - 0.5);

            // Create card elements
            memoryGrid.innerHTML = '';
            memoryGrid.className = `memory-grid ${difficulty}`;

            cardImages.forEach((image, index) => {
                const card = createMemoryCard(image, index);
                gameCards.push(card);
                memoryGrid.appendChild(card.element);
            });

            // Show all cards briefly then flip them
            setTimeout(() => {
                showAllCardsTemporarily();
            }, 300);

            // Update UI
            updateMemoryStats();
            memoryIntro.classList.add('hidden');
            memoryBoard.classList.remove('hidden');
            memoryGameOver.classList.add('hidden');
        });
    }

    // Create a memory card element
    function createMemoryCard(image, id) {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">?</div>
                <div class="memory-card-back">
                    <img src="media-protection.php?file=${image}" alt="Memory Card" loading="eager" fetchpriority="high">
                </div>
            </div>
        `;

        const card = {
            element: cardElement,
            image: image,
            id: id,
            isFlipped: false,
            isMatched: false
        };

        cardElement.addEventListener('click', () => flipCard(card));

        return card;
    }

    // Show all cards temporarily at the start
    function showAllCardsTemporarily() {
        // First flip all cards to show them
        gameCards.forEach(card => {
            card.element.classList.add('flipped');
            card.isFlipped = true;
        });

        // Add shuffle animation
        setTimeout(() => {
            gameCards.forEach(card => {
                card.element.classList.add('shuffle');
            });
        }, 2000);

        // Then flip them back after showing for 5 seconds (increased time)
        setTimeout(() => {
            gameCards.forEach(card => {
                card.element.classList.remove('flipped', 'shuffle');
                card.isFlipped = false;
            });
            gameActive = true; // Now the game is active
        }, 5000);
    }

    // Flip a card
    function flipCard(card) {
        if (!gameActive || card.isFlipped || card.isMatched || flippedCards.length === 2) {
            return;
        }

        card.element.classList.add('flipped');
        card.isFlipped = true;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            gameActive = false;
            setTimeout(checkMatch, 1000);
        }
    }

    // Check if two flipped cards match
    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.image === card2.image) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            card1.element.classList.add('matched', 'match-animation');
            card2.element.classList.add('matched', 'match-animation');
            
            matchedPairs++;
            updateMemoryStats();

            // Remove animation class after animation completes
            setTimeout(() => {
                card1.element.classList.remove('match-animation');
                card2.element.classList.remove('match-animation');
            }, 500);

            // Check if game is won
            const totalPairs = currentDifficulty === 'easy' ? 3 : (currentDifficulty === 'medium' ? 4 : 5);
            if (matchedPairs === totalPairs) {
                setTimeout(() => endGame(true), 500);
            }
        } else {
            // No match
            errors++;
            updateMemoryStats();
            
            // Add shake animation
            card1.element.classList.add('shake');
            card2.element.classList.add('shake');

            setTimeout(() => {
                card1.element.classList.remove('flipped', 'shake');
                card2.element.classList.remove('flipped', 'shake');
                card1.isFlipped = false;
                card2.isFlipped = false;
                
                // Check if game is lost
                if (errors >= maxErrors) {
                    endGame(false);
                }
            }, 500);
        }

        flippedCards = [];
        if (errors < maxErrors && matchedPairs < (currentDifficulty === 'easy' ? 3 : (currentDifficulty === 'medium' ? 4 : 5))) {
            gameActive = true;
        }
    }

    // Update memory game stats
    function updateMemoryStats() {
        const errorsText = window.languageManager ? window.languageManager.translate('errori') : 'Errori';
        const pairsText = window.languageManager ? window.languageManager.translate('coppie_trovate') : 'Coppie trovate';
        
        memoryErrors.textContent = `${errorsText}: ${errors}/${maxErrors}`;
        const totalPairs = currentDifficulty === 'easy' ? 3 : (currentDifficulty === 'medium' ? 4 : 5);
        memoryPairs.textContent = `${pairsText}: ${matchedPairs}/${totalPairs}`;
    }

    // End the memory game
    function endGame(won) {
        gameActive = false;

        // Correggi sempre la classe e il colore del titolo
        if (won) {
            memoryResultTitle.className = 'gold-text';
            memoryResultTitle.style.color = '';
            const congratsText = window.languageManager ? window.languageManager.translate('complimenti') : '🎉 Complimenti! 🎉';
            const wonText = window.languageManager ? window.languageManager.translate('hai_vinto') : 'Hai vinto il Memory Game! La tua memoria è fantastica!';
            memoryResultTitle.textContent = congratsText;
            memoryResultMessage.textContent = wonText;
        } else {
            memoryResultTitle.className = '';
            memoryResultTitle.style.color = '#c92a2a';
            const gameOverText = window.languageManager ? window.languageManager.translate('game_over') : '😔 Game Over';
            const retryText = window.languageManager ? window.languageManager.translate('riprova') : 'Hai esaurito i tentativi. Riprova per migliorare la tua memoria!';
            memoryResultTitle.textContent = gameOverText;
            memoryResultMessage.textContent = retryText;
        }

        setTimeout(() => {
            memoryBoard.classList.add('hidden');
            memoryGameOver.classList.remove('hidden');
        }, 1000);
    }

    // Reset memory game
    function resetMemoryGame() {
        memoryIntro.classList.remove('hidden');
        memoryBoard.classList.add('hidden');
        memoryGameOver.classList.add('hidden');
        memoryGrid.innerHTML = '';
        gameCards = [];
        flippedCards = [];
        matchedPairs = 0;
        errors = 0;
        gameActive = false;
        currentDifficulty = null;
        // Mostra i bottoni di difficoltà e nascondi restart
        if (easyBtn) easyBtn.classList.remove('hidden');
        if (mediumBtn) mediumBtn.classList.remove('hidden');
        if (hardBtn) hardBtn.classList.remove('hidden');
        if (restartBtn) restartBtn.classList.add('hidden');
    }

    // Event listeners for memory game
    if (easyBtn) {
        easyBtn.addEventListener('click', () => {
            startMemoryGame('easy');
        });
    }

    if (hardBtn) {
        hardBtn.addEventListener('click', () => {
            startMemoryGame('hard');
        });
    }

    if (mediumBtn) {
        mediumBtn.addEventListener('click', () => {
            startMemoryGame('medium');
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (currentDifficulty) {
                startMemoryGame(currentDifficulty);
            }
        });
    }

    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', resetMemoryGame);
    }

    // Load memory images on page load (for gallery, not for game)
    loadMemoryImages();

    // --- Full Gallery ---
    const photosGallery = document.getElementById('photos-gallery');
    const priorityCount = 3; // Definisci il numero di immagini prioritarie

    // Function to shuffle an array using Fisher-Yates algorithm
    function shuffleArray(array) {
        const shuffled = [...array]; // Create a copy of the array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Function to create media element with lazy loading, but animation only when in viewport
    function createMediaElement(file, index) {
        const extension = file.split('.').pop().toLowerCase();
        let mediaElement;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(extension)) {
            mediaElement = document.createElement('img');
            const baseSrc = `media-protection.php?file=${file}`;
            // Usa width minore per anteprima veloce
            mediaElement.dataset.src = baseSrc + '&w=320';
            mediaElement.dataset.srcset = [
                `${baseSrc}&w=160 160w`,
                `${baseSrc}&w=320 320w`,
                `${baseSrc}&w=480 480w`,
                `${baseSrc}&w=640 640w`
            ].join(', ');
            mediaElement.sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px";
            mediaElement.alt = `Foto ${index + 1}`;
            mediaElement.loading = 'lazy';
            // Priorità alta solo per le prime 3 immagini
            if (index < 3) mediaElement.setAttribute('fetchpriority', 'high');
            mediaElement.style.opacity = '0';
            mediaElement._fadeInIndex = index;
            mediaElement._loaded = false;
            mediaElement._fadeInShown = false;
            mediaElement.onerror = function() {
                this.style.display = 'none';
                console.log(`Errore nel caricare: ${file}`);
            };
        } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
            mediaElement = document.createElement('video');
            mediaElement.dataset.src = `media-protection.php?file=${file}`;
            mediaElement.autoplay = false; // autoplay solo se visibile
            mediaElement.loop = true;
            mediaElement.muted = true;
            mediaElement.playsInline = true;
            mediaElement.preload = 'none';
            mediaElement.style.opacity = '0';
            mediaElement._fadeInIndex = index;
            mediaElement._loaded = false;
            mediaElement._fadeInShown = false;
            mediaElement.onerror = function() {
                this.style.display = 'none';
                console.log(`Errore nel caricare: ${file}`);
            };
        }
        return mediaElement;
    }

    // Intersection Observer: lazy load and animate only when in viewport
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const mediaElement = entry.target;
            if (entry.isIntersecting) {
                // Lazy load: set src/srcset only when in viewport
                if (!mediaElement._loaded) {
                    if (mediaElement.dataset.src) {
                        if (mediaElement.tagName === 'IMG') {
                            mediaElement.src = mediaElement.dataset.src;
                            if (mediaElement.dataset.srcset) {
                                mediaElement.srcset = mediaElement.dataset.srcset;
                            }
                        } else {
                            mediaElement.src = mediaElement.dataset.src;
                            mediaElement.autoplay = true; // autoplay solo ora
                        }
                    }
                    mediaElement._loaded = true;
                }
                // Animation only when in viewport
                if (!mediaElement._fadeInShown) {
                    mediaElement._fadeInShown = true;
                    function showAnimation() {
                        mediaElement.style.animation = `photoFadeIn 0.7s cubic-bezier(.22,.68,.43,1.01) forwards`;
                        mediaElement.style.animationDelay = `${mediaElement._fadeInIndex * 0.08}s`;
                    }
                    if (mediaElement.tagName === 'IMG') {
                        if (mediaElement.complete) {
                            showAnimation();
                        } else {
                            mediaElement.addEventListener('load', showAnimation, { once: true });
                        }
                    } else if (mediaElement.tagName === 'VIDEO') {
                        mediaElement.addEventListener('loadeddata', showAnimation, { once: true });
                    }
                }
                observer.unobserve(mediaElement);
            }
        });
    }, {
        rootMargin: '0px 0px',
        threshold: 0.1
    });

    // Funzione per applicare animazione fade-in con delay
    function applyPhotoFadeInAnimation(gallerySelector = '.gallery') {
        const gallery = document.querySelector(gallerySelector);
        if (!gallery) return;
        const items = gallery.querySelectorAll('img, video');
        items.forEach((el, i) => {
            el.style.setProperty('--photo-delay', `${i * 0.12}s`);
        });
    }

    // Funzione per aggiungere animazione quando l'immagine/video viene caricata
    function addPhotoFadeInOnLoad(mediaElement, index) {
        function showAnimation() {
            // L'opacità è già 0, parte solo l'animazione
            mediaElement.style.animation = `photoFadeIn 1.2s cubic-bezier(.22,.68,.43,1.01) forwards`;
            mediaElement.style.animationDelay = `${index * 0.12}s`;
        }
        if (mediaElement.tagName === 'IMG') {
            mediaElement.addEventListener('load', showAnimation, { once: true });
        } else if (mediaElement.tagName === 'VIDEO') {
            mediaElement.addEventListener('loadeddata', showAnimation, { once: true });
        }
    }

    fetch('media-protection.php?file=media-list.json')
        .then(response => response.json())
        .then(data => {
            const mediaFiles = shuffleArray(data.files);
            mediaFiles.forEach((file, index) => {
                const mediaElement = createMediaElement(file, index);
                if (mediaElement) {
                    photosGallery.appendChild(mediaElement);
                    imageObserver.observe(mediaElement); // lazy load + animazione solo in viewport
                }
            });
        })
        .catch(error => {
            console.error('Errore nel caricare la galleria completa:', error);
            photosGallery.innerHTML = '<p>Errore nel caricamento della galleria. Ricarica la pagina.</p>';
        });
});