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

    // Load memory game images
    function loadMemoryImages() {
        return fetch('media-protection.php?file=media-list.json')
            .then(response => response.json())
            .then(data => {
                // Filter only image files (exclude videos)
                const imageFiles = data.files.filter(file => {
                    const extension = file.split('.').pop().toLowerCase();
                    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
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
        gameActive = true;

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
        }, 500);

        // Update UI
        updateMemoryStats();
        memoryIntro.classList.add('hidden');
        memoryBoard.classList.remove('hidden');
        memoryGameOver.classList.add('hidden');
    }

    // Create a memory card element
    function createMemoryCard(image, id) {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">?</div>
                <div class="memory-card-back">
                    <img src="media-protection.php?file=${image}" alt="Memory Card">
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
        }, 1500);

        // Then flip them back after showing for 3 seconds
        setTimeout(() => {
            gameCards.forEach(card => {
                card.element.classList.remove('flipped', 'shuffle');
                card.isFlipped = false;
            });
            gameActive = true; // Now the game is active
        }, 3500);
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
    }

    // Event listeners for memory game
    if (easyBtn) {
        easyBtn.addEventListener('click', () => {
            if (memoryGameImages.length > 0) {
                startMemoryGame('easy');
            } else {
                loadMemoryImages().then(() => startMemoryGame('easy'));
            }
        });
    }

    if (hardBtn) {
        hardBtn.addEventListener('click', () => {
            if (memoryGameImages.length > 0) {
                startMemoryGame('hard');
            } else {
                loadMemoryImages().then(() => startMemoryGame('hard'));
            }
        });
    }

    if (mediumBtn) {
        mediumBtn.addEventListener('click', () => {
            if (memoryGameImages.length > 0) {
                startMemoryGame('medium');
            } else {
                loadMemoryImages().then(() => startMemoryGame('medium'));
            }
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

    // Load memory images on page load
    loadMemoryImages();

    // --- Full Gallery ---
    const photosGallery = document.getElementById('photos-gallery');

    // Function to shuffle an array using Fisher-Yates algorithm
    function shuffleArray(array) {
        const shuffled = [...array]; // Create a copy of the array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Function to create media element with lazy loading
    function createMediaElement(file, index) {
        const extension = file.split('.').pop().toLowerCase();
        let mediaElement;
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(extension)) {
            mediaElement = document.createElement('img');
            mediaElement.dataset.src = `media-protection.php?file=${file}`;
            mediaElement.alt = `Foto ${index + 1}`;
            
            // Add lazy loading for images after the first 12
            if (index > 11) {
                mediaElement.loading = 'lazy';
            } else {
                // Load first 12 images immediately
                mediaElement.src = mediaElement.dataset.src;
            }
            
            // Add error handling
            mediaElement.onerror = function() {
                this.style.display = 'none';
                console.log(`Errore nel caricare: ${file}`);
            };
            
        } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
            mediaElement = document.createElement('video');
            mediaElement.dataset.src = `media-protection.php?file=${file}`;
            mediaElement.autoplay = true;
            mediaElement.loop = true;
            mediaElement.muted = true;
            
            // Add lazy loading for videos after the first 6
            if (index > 5) {
                mediaElement.preload = 'none';
            } else {
                mediaElement.src = mediaElement.dataset.src;
                mediaElement.preload = 'metadata';
            }
            
            // Add error handling
            mediaElement.onerror = function() {
                this.style.display = 'none';
                console.log(`Errore nel caricare: ${file}`);
            };
        }
        
        return mediaElement;
    }

    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const mediaElement = entry.target;
                if (mediaElement.dataset.src) {
                    mediaElement.src = mediaElement.dataset.src;
                    observer.unobserve(mediaElement);
                }
            }
        });
    }, {
        rootMargin: '50px 0px' // Start loading 50px before element is visible
    });

    fetch('media-protection.php?file=media-list.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Shuffle the media files array to display them in random order
            const mediaFiles = shuffleArray(data.files);
            
            mediaFiles.forEach((file, index) => {
                const mediaElement = createMediaElement(file, index);
                
                if (mediaElement) {
                    photosGallery.appendChild(mediaElement);
                    
                    // Set up lazy loading for elements that don't load immediately
                    if ((mediaElement.tagName === 'IMG' && index > 11) || 
                        (mediaElement.tagName === 'VIDEO' && index > 5)) {
                        imageObserver.observe(mediaElement);
                    }
                }
            });
            
            console.log(`Caricati ${mediaFiles.length} file multimediali in ordine casuale`);
        })
        .catch(error => {
            console.error('Errore nel caricare la galleria completa:', error);
            photosGallery.innerHTML = '<p>Errore nel caricamento della galleria. Ricarica la pagina.</p>';
        });
});