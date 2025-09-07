document.addEventListener('DOMContentLoaded', () => {
    // Logic for menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
        });
    }

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
    const hardBtn = document.getElementById('memory-hard-btn');
    const restartBtn = document.getElementById('memory-restart-btn');
    const playAgainBtn = document.getElementById('memory-play-again-btn');

    // Load memory game images
    function loadMemoryImages() {
        return fetch('media/media-list.json')
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
        const numPairs = difficulty === 'easy' ? 3 : 4;
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
                    <img src="media/${image}" alt="Memory Card">
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
            const totalPairs = currentDifficulty === 'easy' ? 3 : 4;
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
        if (errors < maxErrors && matchedPairs < (currentDifficulty === 'easy' ? 3 : 4)) {
            gameActive = true;
        }
    }

    // Update memory game stats
    function updateMemoryStats() {
        memoryErrors.textContent = `Errori: ${errors}/${maxErrors}`;
        const totalPairs = currentDifficulty === 'easy' ? 3 : 4;
        memoryPairs.textContent = `Coppie trovate: ${matchedPairs}/${totalPairs}`;
    }

    // End the memory game
    function endGame(won) {
        gameActive = false;
        
        if (won) {
            memoryResultTitle.textContent = '🎉 Complimenti! 🎉';
            memoryResultTitle.className = 'gold-text';
            memoryResultMessage.textContent = 'Hai vinto il Memory Game! La tua memoria è fantastica!';
        } else {
            memoryResultTitle.textContent = '😔 Game Over';
            memoryResultTitle.style.color = '#c92a2a';
            memoryResultMessage.textContent = 'Hai esaurito i tentativi. Riprova per migliorare la tua memoria!';
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

    fetch('media/media-list.json')
        .then(response => response.json())
        .then(data => {
            const mediaFiles = data.files;
            mediaFiles.forEach(file => {
                const extension = file.split('.').pop().toLowerCase();
                let mediaElement;
                if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                    mediaElement = document.createElement('img');
                    mediaElement.src = `media/${file}`;
                } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    mediaElement = document.createElement('video');
                    mediaElement.src = `media/${file}`;
                    mediaElement.autoplay = true;
                    mediaElement.loop = true;
                    mediaElement.muted = true;
                }
                if(mediaElement) {
                    photosGallery.appendChild(mediaElement);
                }
            });
        })
        .catch(error => console.error('Errore nel caricare la galleria completa:', error));
});