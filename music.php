<?php
require_once 'auth.php';
checkAuthentication();
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="musica_sofia">La Musica di Sofia</title>
    
    <!-- Performance optimizations -->
    <link rel="preload" href="music.js" as="script">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    
    <!-- Font ottimizzato -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="style.css">
</head>
<body class="music-page">
    <header>
        <nav id="navbar-music">
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
        <section id="music-section">
            <h1 class="gold-text" data-translate="musica_sofia_title">🎵 Musica che ha il Sapore di Sofia 🎵</h1>
            <p class="music-intro" data-translate="musica_intro">Le canzoni che catturano l'essenza della nostra dottoressa!</p>
            <div class="music-grid">
                <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/0AjaaKeiD0VPkwOusTY4kM?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </section>
    </main>

    <!-- Audio con preload=metadata per performance -->
    <audio id="audio-player" preload="metadata"></audio>

    <!-- JS con defer -->
    <script defer src="translations.js"></script>
    <script defer src="auth.js"></script>
    <script defer src="music.js"></script>
</body>
</html>