<?php require_once 'auth.php'; ?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="momenti_iconici">Momenti Iconici</title>
    
    <link rel="preload" href="style.css" as="style">
    <link rel="preload" href="photos.js" as="script">
    
    <!-- CSS inline critico per above-the-fold -->
    <style>
        /* CSS critico inline */
        body { margin: 0; font-family: 'Josefin Sans', sans-serif; }
        header { background: linear-gradient(90deg, var(--verde-sx), var(--verde-dx)); }
        .gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .gallery img, .gallery video { width: 100%; height: 160px; object-fit: cover; border-radius: 10px; }
    </style>
    
    <!-- CSS non critico caricato in modo asincrono -->
    <link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css"></noscript>
    
    <!-- Font con display=swap -->
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
    <!-- Preload risorse critiche -->
    <link rel="preload" href="style.css" as="style">
    <link rel="preload" href="photos.js" as="script">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.gstatic.com/s/josefinsans/v34/Qw3aZQNVED7rKGKxtqIqX5EUDXw.ttf.woff2" as="font" type="font/woff2" crossorigin>
    <!-- CSS inline critico per above-the-fold -->
    <style>
        /* CSS critico inline */
        body { margin: 0; font-family: 'Josefin Sans', sans-serif; }
        header { background: linear-gradient(90deg, var(--verde-sx), var(--verde-dx)); }
        .gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .gallery img, .gallery video { width: 100%; height: 160px; object-fit: cover; border-radius: 10px; }
    </style>
    <link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css"></noscript>
    <!-- Font con display=swap -->
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
    <!-- CSS non critico caricato in modo asincrono/minificato -->
    <link rel="preload" href="style.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.min.css"></noscript>
    <!-- Font con display=swap -->
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body class="photos-page">
    <header>
        <nav id="navbar-photos">
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
        <section id="memory-game-section">
            <h1 class="gold-text" data-translate="photos_title">Gioco del Memory - Momenti Iconici</h1>
            <div id="memory-game-intro">
                <p class="memory-intro-text" data-translate="memory_intro">Metti alla prova la tua memoria con i momenti più iconici di Sofia!</p>
                <div class="memory-difficulty-buttons">
                    <button id="memory-easy-btn" class="memory-btn" data-translate="facile">Facile (6 carte)</button>
                    <button id="memory-medium-btn" class="memory-btn" data-translate="intermedio">Intermedio (8 carte)</button>
                    <button id="memory-hard-btn" class="memory-btn" data-translate="difficile">Difficile (10 carte)</button>
                </div>
            </div>
            <div id="memory-game-board" class="hidden">
                <div class="memory-stats">
                    <span id="memory-errors"><span data-translate="errori">Errori</span>: 0/3</span>
                    <span id="memory-pairs"><span data-translate="coppie_trovate">Coppie trovate</span>: 0</span>
                </div>
                <div id="memory-grid" class="memory-grid"></div>
                <button id="memory-restart-btn" class="memory-btn hidden" data-translate="gioca_ancora">Gioca di nuovo</button>
            </div>
            <div id="memory-game-over" class="hidden">
                <div class="memory-result">
                    <h2 id="memory-result-title"></h2>
                    <p id="memory-result-message"></p>
                    <button id="memory-play-again-btn" class="memory-btn" data-translate="gioca_ancora">Gioca di nuovo</button>
                </div>
            </div>
        </section>

        <section id="all-moments">
            <h1 class="gold-text" data-translate="tutti_momenti">Tutti i Momenti più Iconici</h1>
            <div class="gallery" id="photos-gallery">
                <!-- Le immagini e i video verranno inseriti qui da photos.js -->
            </div>
        </section>
    </main>

    <script defer src="translations.js"></script>
    <script defer src="auth.js"></script>
    <script defer src="photos.js"></script>
</body>
    <!-- JS minificato e defer per performance -->
    <script defer src="translations.min.js"></script>
    <script defer src="auth.min.js"></script>
    <script defer src="photos.min.js"></script>
</body>
</html>