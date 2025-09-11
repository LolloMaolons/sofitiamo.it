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
        if (window.location.pathname !== '/index.php' && !window.location.pathname.endsWith('index.php')) {
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