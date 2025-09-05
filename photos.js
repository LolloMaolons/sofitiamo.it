document.addEventListener('DOMContentLoaded', () => {
    // Logic for menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = document.getElementById('menu-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
        });
    }

    // --- Full Gallery ---
    const photosGallery = document.getElementById('photos-gallery');

    fetch('media/media-list.json')
        .then(response => response.json())
        .then(data => {
            data.files.forEach(file => {
                let mediaElement;
                if (file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.webm')) {
                    mediaElement = document.createElement('video');
                    mediaElement.loop = true;
                    mediaElement.muted = true;
                    videosToPlay.push(mediaElement); 
                } else {
                    mediaElement = document.createElement('img');
                }
                mediaElement.src = `media/${file}`;
                mediaElement.alt = `Media: ${file}`;
                photoGallery.appendChild(mediaElement);
            });

            if (videosToPlay.length > 0) {
                const playPromises = videosToPlay.map(video => video.play());
                Promise.all(playPromises)
                    .then(() => console.log('Tutti i video sono partiti.'))
                    .catch(error => {
                        console.warn('Autoplay bloccato. Aggiungo i controlli.', error);
                        videosToPlay.forEach(v => v.controls = true);
                    });
            }
        })
        .catch(error => console.error('Errore nel caricamento della galleria:', error));
});