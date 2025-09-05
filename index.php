<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuti!</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <h1>Entra nel sito di Sofia</h1>
        <h2>Quanto ne sai sulla neo dottoressa?</h2>
        
        <!-- Il form invia i dati a login.php usando il metodo POST -->
        <form id="login-form" action="login.php" method="POST">
            <label for="frutto">Qual è il suo frutto preferito?</label>
            <input type="text" id="frutto" name="frutto" required autocomplete="off" autofocus>
            <button type="submit">Entra</button>
        </form>

        <p id="error-message" class="error">
            <?php
            // Questo piccolo script PHP controlla se l'URL contiene "?error=1"
            // e in tal caso stampa un messaggio di errore.
            if (isset($_GET['error']) && $_GET['error'] == 1) {
                echo 'Risposta sbagliata, riprova!';
            }
            ?>
        </p>
    </div>
</body>
</html>