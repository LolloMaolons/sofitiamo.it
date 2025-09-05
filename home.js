document.addEventListener('DOMContentLoaded', () => {
    // Logic for menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
        });
    }

    // --- Home Quiz ---
    const homeQuizContainer = document.getElementById('home-quiz-section');
    const quizzes = [
        {
            question: "Qual è il secondo nome di Sofia?",
            answer: "Maria"
        },
        {
            question: "In che anno ha iniziato l'università?",
            answer: "2019"
        },
        {
            question: "Qual è il suo soprannome più comune?",
            answer: "Sofi"
        }
    ];

    let currentQuizIndex = 0;

    function showQuiz(index) {
        if (index < quizzes.length) {
            const quiz = quizzes[index];
            homeQuizContainer.innerHTML = `
                <div class="quiz-question">
                    <p>${quiz.question}</p>
                    <input type="text" id="quiz-answer-${index}">
                    <button onclick="checkAnswer(${index}, '${quiz.answer}')">Invia</button>
                    <p id="feedback-${index}"></p>
                </div>
            `;
        } else {
            homeQuizContainer.innerHTML = `
                <p>Hai completato i quiz della home!</p>
                <p>Vuoi continuare nella sezione quiz?</p>
                <button onclick="goToQuizPage()">Sì, andiamo!</button>
            `;
        }
    }

    window.checkAnswer = function(index, correctAnswer) {
        const userAnswer = document.getElementById(`quiz-answer-${index}`).value.trim();
        const feedback = document.getElementById(`feedback-${index}`);
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback.textContent = "Corretto!";
            feedback.style.color = "green";
            setTimeout(() => {
                currentQuizIndex++;
                showQuiz(currentQuizIndex);
            }, 1000);
        } else {
            feedback.textContent = "Sbagliato, riprova!";
            feedback.style.color = "red";
        }
    }
    
    window.goToQuizPage = function() {
        // Salva i quiz già fatti per non ripeterli
        sessionStorage.setItem('completedHomeQuizzes', 'true');
        window.location.href = 'quiz.html';
    }

    showQuiz(currentQuizIndex);


    // --- Iconic Moments Gallery ---
    const homeGallery = document.getElementById('home-gallery');

    // Crea un file 'media-list.json' nella cartella 'media' con questo formato:
    // { "files": ["foto1.jpg", "video1.mp4", "foto2.png"] }
    fetch('media/media-list.json')
        .then(response => response.json())
        .then(data => {
            const mediaFiles = data.files;
            const shuffled = mediaFiles.sort(() => 0.5 - Math.random());
            const selectedMedia = shuffled.slice(0, 4); // Mostra 4 elementi a caso

            selectedMedia.forEach(file => {
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
                    homeGallery.appendChild(mediaElement);
                }
            });
        })
        .catch(error => console.error('Errore nel caricare la galleria:', error));
});