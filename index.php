<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover">
    <title data-translate="benvenuti">Benvenuti!</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page">
    <header>
        <nav>
            <a href="#" class="brand" data-translate="brand">DOTTORESSA!!!</a>
        

            <div class="menu-toggle" id="menu-toggle">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </nav>
    </header>

    <main>
        <div class="login-container">
            <div class="login-box">
            <h1 data-translate="entra_sito">Entra nel sito di Sofia</h1>
            <h2 data-translate="quanto_sai_dottoressa">Quanto ne sai sulla neo-dottoressa?</h2>
            
            <!-- Il form invia i dati a login.php usando il metodo POST -->
            <form id="login-form" action="login.php" method="POST">
                <label for="frutto" data-translate="frutto_preferito">Qual è il suo frutto preferito?</label>
                <input type="text" id="frutto" name="frutto" required autocomplete="off">
                <button type="submit" data-translate="entra">Entra</button>
            </form>

            <p id="error-message" class="error<?php echo (isset($_GET['error']) && $_GET['error'] == 1) ? ' show-error' : ''; ?>">
                <?php
                // Questo piccolo script PHP controlla se l'URL contiene "?error=1"
                // e in tal caso stampa un messaggio di errore.
                if (isset($_GET['error']) && $_GET['error'] == 1) {
                    echo '<span data-translate="risposta_sbagliata">Risposta sbagliata, riprova!</span>';
                }
                ?>
            </p>
            </div>
        </div>
    </main>
    
    <script src="translations.js"></script>
    <script>
        // Mobile keyboard handling
        document.addEventListener('DOMContentLoaded', function() {
            const input = document.getElementById('frutto');
            const loginBox = document.querySelector('.login-box');
            const loginContainer = document.querySelector('.login-container');
            
            if (input && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // Mobile device detected
                
                // Handle focus to ensure visibility
                input.addEventListener('focus', function() {
                    // Add keyboard-open class for mobile styling
                    if (loginContainer) {
                        loginContainer.classList.add('keyboard-open');
                    }
                    
                    // Scroll the entire form into view
                    setTimeout(function() {
                        loginBox.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest' 
                        });
                    }, 100);
                });
                
                // Handle blur to restore centering
                input.addEventListener('blur', function() {
                    setTimeout(function() {
                        if (loginContainer && !input.matches(':focus')) {
                            loginContainer.classList.remove('keyboard-open');
                        }
                    }, 300);
                });
                
                // Prevent zoom on input focus for iOS
                input.addEventListener('touchstart', function() {
                    input.style.fontSize = '16px';
                });
                
                // Handle viewport resize (keyboard show/hide)
                let initialHeight = window.innerHeight;
                window.addEventListener('resize', function() {
                    if (window.innerHeight < initialHeight * 0.75) {
                        // Keyboard likely shown
                        if (loginContainer) {
                            loginContainer.classList.add('keyboard-open');
                        }
                    } else {
                        // Keyboard likely hidden
                        if (loginContainer && !input.matches(':focus')) {
                            loginContainer.classList.remove('keyboard-open');
                        }
                    }
                });
            }
        });
        
        // Inizializza il language manager per la pagina di login
        document.addEventListener('DOMContentLoaded', function() {
            // Nascondi eventuali errori del server
            const serverErrors = document.querySelectorAll('[style*="color: red"]');
            serverErrors.forEach(error => {
                if (error.textContent.includes('server') || error.textContent.includes('404')) {
                    error.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>