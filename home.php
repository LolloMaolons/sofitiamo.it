<?php require_once 'auth.php'; ?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="benvenuta">Benvenuta Dottoressa Sofia!</title>
    
    <link rel="preload" href="style.css" as="style">
    <link rel="preload" href="home.js" as="script">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
    
    <!-- Font con display=swap -->
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap asincrono -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"></noscript>
    
    <link rel="stylesheet" href="style.css">
</head>
    <!-- Performance optimizations -->
    <link rel="preload" href="style.css" as="style">
    <link rel="preload" href="home.js" as="script">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.gstatic.com/s/josefinsans/v34/Qw3aZQNVED7rKGKxtqIqX5EUDXw.ttf.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
    <!-- Font con display=swap -->
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <!-- Bootstrap asincrono -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"></noscript>
    <link rel="stylesheet" href="style.css">
</head>

<body class="home-page">
    <header>
        <nav id="navbar-home">
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
    
        <div class="congratulations">
            <h1 class="gold-text" data-translate="congratulazioni">CONGRATULAZIONI</h1>
            <h2 class="bordeaux-text" data-translate="dottoressa_buco">Dottoressa del buco del cul...</h2>
        </div>
        
        <h3 class="point-text" data-translate="momenti_iconici">Momenti Iconici</h3>
        <div id="iconic-moments">
            <div class="gallery" id="home-gallery">
                <!-- Le immagini e i video verranno inseriti qui da home.js -->
            </div>
        </div>

        <h3 class="point-text" data-translate="musica_sofia_title">🎵 Musica che ha il Sapore di Sofia</h3>
        <div id="home-music-section">
            <p style="color: white; font-weight: 600; margin-bottom: 1.5rem;" data-translate="musica_intro">Le canzoni che catturano l'essenza della nostra dottoressa!</p>
            <div class="music-preview-grid">
                <div id="random-song-container">
                    <!-- Random song will be loaded here by JavaScript -->
                </div>
            </div>
            <div class="music-see-more">
                <a href="music.php" data-translate="ascolta_tutte">Ascolta tutte le canzoni 🎵</a>
            </div>
        </div>
        
        <h3 class="point-text" data-translate="piccolo_assaggio">🧠 Un piccolo assaggio del quiz...</h3>
        <div id="home-quiz-section">
            <!-- I quiz verranno inseriti qui da home.js -->
        </div>
        
        <h3 class="point-text" data-translate="video_laurea">Il Video di Laurea</h3>
        <!-- Container per il video di laurea - ora largo come gli altri -->
        <div id="graduation-video">
            <!-- Il video verrà inserito qui da home.js -->
        </div>
    </main>

    <!-- JS con defer per performance -->
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script defer src="translations.js"></script>
    <script defer src="auth.js"></script>
    <script defer src="home.js"></script>
</body>
</html>