<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuti!</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ENjdO4Dr2bkBIFxQpeoA6VKHr8zWvZg9lZlY9MZC1l1rZl9FQ51h6Q0Q5r5F5r5F" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div class="card shadow-sm p-4 w-100" style="max-width: 400px;">
            <h1 class="mb-3 text-center">Entra nel sito di Sofia</h1>
            <h2 class="mb-4 h5 text-center">Quanto ne sai sulla neo dottoressa?</h2>
            <!-- Il form invia i dati a login.php usando il metodo POST -->
            <form id="login-form" action="login.php" method="POST">
                <div class="mb-3">
                    <label for="frutto" class="form-label">Qual è il suo frutto preferito?</label>
                    <input type="text" id="frutto" name="frutto" class="form-control" required autocomplete="off" autofocus>
                </div>
                <button type="submit" class="btn btn-success w-100">Entra</button>
            </form>
            <p id="error-message" class="error text-danger text-center mt-3">
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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
</body>
</html>