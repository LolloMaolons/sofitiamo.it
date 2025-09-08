<?php
// --- BACKEND DI LOGIN SICURO MULTILINGUE ---

// Hash sicuri delle password in tutte le lingue
$validHashes = [
    '$2y$10$9Zq.UF/.aA251ksqiz6qoe2rXy0658.XyQuAs6Ev6fd1HAsXpY6za',
    '$2y$10$mzO9gyWLNVFQ99BcUkbx3O8NuzLfKamsVx8oRADfKCi12xCgiXcfe',  
    '$2y$10$3oNChWdmZaMn83mNDEPudux8ZXZ020w0px3o0lalCWBN1a8iiOYTu',
    '$2y$10$VFr5acfvNiOROzhspckpZeGkKsElpwLA2ie3ZL6.c6tWwA7RjLm.y' 
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