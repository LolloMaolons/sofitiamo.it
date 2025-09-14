<?php
session_start();

function checkAuthentication() {
    // Verifica se esiste un token di sessione
    if (!isset($_SESSION['auth_token'])) {
        redirectToLogin();
    }
    
    // Verifica se la sessione non è scaduta (24 ore)
    if (!isset($_SESSION['login_time']) || (time() - $_SESSION['login_time']) > 86400) {
        session_destroy();
        redirectToLogin();
    }
    
    // Verifica IP per sicurezza aggiuntiva
    if (!isset($_SESSION['user_ip']) || $_SESSION['user_ip'] !== $_SERVER['REMOTE_ADDR']) {
        session_destroy();
        redirectToLogin();
    }
    
    // Se arriviamo qui, l'utente è autenticato
    return true;
}

function redirectToLogin() {
    header('Location: index.php');
    exit();
}

// Esegui la verifica
checkAuthentication();

$token = bin2hex(random_bytes(32)); // 64 caratteri esadecimali
// Salva $token nel database associato all'utente
?>