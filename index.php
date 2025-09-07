<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuti!</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ENjdO4Dr2bkBIFxQpeoA6VKHr8zWvZg9lZlY9MZC1l1rZl9FQ51h6Q0Q5r5F5r5F" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
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
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</body>
</html>