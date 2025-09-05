<?php
// --- BACKEND DI LOGIN SICURO ---

// 1. L'hash sicuro della password che hai generato.
//    SOSTITUISCI QUESTA RIGA CON IL TUO HASH!
$passwordHash = '$2y$10$JyCrf2TWg1u/nL2dvTPbdOPYX47RfAEQ152y6VR.KT6Gv5Re8Bfi.';

// 2. Controlla se i dati sono stati inviati tramite POST.
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['frutto'])) {
    
    $rispostaUtente = $_POST['frutto'];

    // 3. Verifica in modo sicuro se la risposta dell'utente corrisponde all'hash.
    if (password_verify($rispostaUtente, $passwordHash)) {
        // Password CORRETTA: reindirizza alla home page.
        header('Location: home.html');
        exit(); // Termina sempre lo script dopo un reindirizzamento.
    } else {
        // Password SBAGLIATA: torna alla pagina di login con un messaggio di errore.
        header('Location: index.php?error=1');
        exit();
    }
} else {
    // Se qualcuno tenta di accedere a questo file direttamente, lo rimandiamo alla pagina di login.
    header('Location: index.php');
    exit();
}
?>