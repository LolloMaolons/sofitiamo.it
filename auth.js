// Sistema di autenticazione lato client
(function() {
    'use strict';
    
    function checkAuth() {
        const token = localStorage.getItem('auth_token');
        const authTime = localStorage.getItem('auth_time');

        // Se non c'è token, reindirizza al login
        if (!token || !authTime) {
            redirectToLogin();
            return false;
        }

        // Controlla che il token sia almeno 32 caratteri alfanumerici
        if (typeof token !== 'string' || !/^[a-zA-Z0-9]{32,}$/.test(token)) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_time');
            redirectToLogin();
            return false;
        }

        // Controlla se il token è scaduto (24 ore = 86400 secondi)
        const currentTime = Math.floor(Date.now() / 1000);
        const loginTime = parseInt(authTime);

        if (currentTime - loginTime > 86400) {
            // Token scaduto, pulisci e reindirizza
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_time');
            redirectToLogin();
            return false;
        }

        return true;
    }
    
    function redirectToLogin() {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();
        
        // Se non siamo già nella pagina di login, reindirizza
        if (currentFile !== 'index.php' && currentPath !== '/index.php') {
            window.location.href = 'index.php';
        }
    }
    
    // Esegui la verifica immediatamente
    if (!checkAuth()) {
        // Ferma l'esecuzione di altri script se non autenticato
        document.addEventListener('DOMContentLoaded', function(e) {
            e.stopImmediatePropagation();
        }, true);
    }
})();