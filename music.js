document.addEventListener('DOMContentLoaded', () => {
    // Cache elementi DOM
    const elements = {
        menuToggle: document.getElementById('menu-toggle'),
        menuLinks: document.getElementById('menu-links'),
        audioPlayer: document.getElementById('audio-player'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        progressFill: document.getElementById('progress-fill'),
        // Altri elementi esistenti...
    };

    // Menu toggle ottimizzato (stesso codice di quiz.js)
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.menuLinks.classList.toggle('active');
        });
    }

    document.addEventListener('click', (event) => {
        if (!elements.menuLinks.contains(event.target) && 
            !elements.menuToggle.contains(event.target)) {
            elements.menuLinks.classList.remove('active');
        }
    });

    // Lazy loading playlist
    let playlist = [];
    
    async function loadPlaylist() {
        try {
            const response = await fetch('/media-protection.php?file=media-list.json', {
                cache: 'force-cache'
            });
            const data = await response.json();
            
            // Filtra solo file audio
            playlist = data.files?.filter(file => {
                const ext = file.split('.').pop().toLowerCase();
                return ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
            }) || [];
            
            renderPlaylist();
        } catch (error) {
            console.error('Playlist loading error:', error);
        }
    }

    // Rendering ottimizzato playlist
    function renderPlaylist() {
        const playlistContainer = document.getElementById('playlist');
        if (!playlistContainer) return;
        
        const fragment = document.createDocumentFragment();
        
        playlist.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'playlist-item';
            trackElement.innerHTML = `
                <div class="track-info">
                    <div class="track-title">${getTrackTitle(track)}</div>
                    <div class="track-artist">Sofia</div>
                </div>
                <button class="play-btn">▶️</button>
            `;
            
            // Event delegation ottimizzata
            trackElement.addEventListener('click', () => playTrack(index));
            fragment.appendChild(trackElement);
        });
        
        playlistContainer.replaceChildren(fragment);
    }

    function getTrackTitle(track) {
        return track.title || track.file.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
    }

    // Throttle progress updates per audio
    let progressUpdateTimeout;
    function updateProgress() {
        clearTimeout(progressUpdateTimeout);
        progressUpdateTimeout = setTimeout(() => {
            if (elements.audioPlayer.duration && elements.progressFill) {
                const progress = (elements.audioPlayer.currentTime / elements.audioPlayer.duration) * 100;
                elements.progressFill.style.width = `${progress}%`;
            }
        }, 100);
    }

    // Audio events ottimizzati
    if (elements.audioPlayer) {
        elements.audioPlayer.addEventListener('timeupdate', updateProgress);
        
        // Preload successivo track in background
        elements.audioPlayer.addEventListener('loadedmetadata', () => {
            const nextIndex = currentTrack + 1;
            if (nextIndex < playlist.length) {
                const nextTrack = playlist[nextIndex];
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = `/media-protection.php?file=${nextTrack.file}`;
                document.head.appendChild(link);
            }
        });
    }

    // Lazy load playlist only when needed
    loadPlaylist();

    // ...existing music logic mantiene funzionalità identiche...
});