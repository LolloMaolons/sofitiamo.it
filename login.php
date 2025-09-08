<?php
// --- BACKEND DI LOGIN SICURO MULTILINGUE ---

// Hash sicuri delle password in tutte le lingue
$validHashes = [
    '$2y$10$CgbITjuvY2j23XETHD.j.uDhvlX1OmZ7WxFmyUN0XzC3cCIIVC0zK',
    '$2y$10$K3UbhgC0.iL3zyuRhmJ40.aFGQvWw6pxLulUwxFwD/p8TZohpL4fW',
    '$2y$10$75fYbBg7VYju0oGHT8aEuujXkmBnzuEh.58Y/4HK.mujmUn.7/D9W',
    '$2y$10$8uXc8jmZYTwjGrFjiuOcNOgZIX0L8V0HPfBQNDj2g6Rmrz6iHLUrG',
    '$2y$10$Gf7N/iib9iBNR2KCplMK2OdqeSz8hsHHPwJ9XohBJ22FDvEFw3ywW'
];

// Controlla se i dati sono stati inviati tramite POST
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['frutto'])) {
    
    $rispostaUtente = $_POST['frutto'];

    // Normalizza la risposta dell'utente in minuscolo per renderla case-insensitive
    $rispostaUtente = strtolower(trim($rispostaUtente));

    // Verifica se la risposta dell'utente corrisponde a uno degli hash validi
    $loginValido = false;
    foreach ($validHashes as $hash) {
        if (password_verify($rispostaUtente, $hash)) {
            $loginValido = true;
            break;
        }
    }

    if ($loginValido) {
        // Password CORRETTA: reindirizza alla home page
        header('Location: home.html');
        exit(); // Termina sempre lo script dopo un reindirizzamento
    } else {
        // Password SBAGLIATA: torna alla pagina di login con un messaggio di errore
        header('Location: index.php?error=1');
        exit();
    }
} else {
    // Se qualcuno tenta di accedere a questo file direttamente, lo rimandiamo alla pagina di login
    header('Location: index.php');
    exit();
}
?>