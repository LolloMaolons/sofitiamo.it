<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="benvenuti">Benvenuti!</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ENjdO4Dr2bkBIFxQpeoA6VKHr8zWvZg9lZlY9MZC1l1rZl9FQ51h6Q0Q5r5F5r5F" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <div class="language-selector">
            <select class="language-select" id="language-selector">
                <!-- Options will be populated by JavaScript -->
            </select>
        </div>
        <div class="login-box">
            <h1 data-translate="entra_sito">Entra nel sito di Sofia</h1>
            <h2 data-translate="quanto_sai_dottoressa">Quanto ne sai sulla neo-dottoressa?</h2>
            
            <!-- Il form invia i dati a login.php usando il metodo POST -->
            <form id="login-form" action="login.php" method="POST">
                <label for="frutto" data-translate="frutto_preferito">Qual è il suo frutto preferito?</label>
                <input type="text" id="frutto" name="frutto" required autocomplete="off" autofocus>
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
    
    <script src="translations.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</body>
</html>