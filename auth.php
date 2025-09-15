<?php
session_start();

function checkAuthentication() {
    // Se la sessione non è valida o non esiste, reindirizza
    if (
        !isset($_SESSION['authenticated']) ||
        $_SESSION['authenticated'] !== true ||
        !isset($_SESSION['user_ip']) ||
        $_SESSION['user_ip'] !== $_SERVER['REMOTE_ADDR'] ||
        !isset($_SESSION['login_time']) ||
        (time() - $_SESSION['login_time']) > 86400
    ) {
        // Distruggi la sessione per evitare session fixation
        session_unset();
        session_destroy();
        // Cancella il cookie PHPSESSID
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        // Reindirizza alla pagina di login
        header('Location: index.php');
        exit();
    }
    // Se tutto ok, continua
    return true;
}

// ...non chiamare checkAuthentication() qui...
?>