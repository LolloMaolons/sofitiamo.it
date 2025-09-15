<?php
require_once 'auth.php';
checkAuthentication();
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="quanto_ne_sai">Quanto ne sai su Sofia?</title>
    
    <!-- Performance optimizations -->
    <link rel="preload" href="style.css" as="style">
    <link rel="preload" href="quiz.js" as="script">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    
    <!-- Font ottimizzato -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="style.css">
</head>
<body class="quiz-page">
    <header>
        <nav id="navbar-quiz">
            <a href="home.php" class="brand" data-translate="brand">DOTTORESSA!!!</a>
            <div class="menu-toggle" id="menu-toggle">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </nav>
        <div class="menu-links" id="menu-links">
            <a href="photos.php" data-translate="momenti_iconici">Momenti iconici</a>
            <a href="quiz.php" data-translate="quanto_ne_sai">Quanto ne sai su Sofia?</a>
            <a href="music.php" data-translate="musica_sofia">Musica di Sofia</a>
        </div>
    </header>

    <main>
            <section id="quiz-section">
                <!-- I quiz verranno inseriti qui da quiz.js -->
            </section>
    </main>

    <!-- JS con defer per non bloccare rendering -->
    <script defer src="translations.js"></script>
    <script defer src="auth.js"></script>
    <script defer src="quiz.js"></script>
</body>
</html>