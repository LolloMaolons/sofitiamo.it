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
            const mediaFiles = data.files;
            mediaFiles.forEach(file => {
                const extension = file.split('.').pop().toLowerCase();
                let mediaElement;
                if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                    mediaElement = document.createElement('img');
                    mediaElement.src = `media/${file}`;
                } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    mediaElement = document.createElement('video');
                    mediaElement.src = `media/${file}`;
                    mediaElement.controls = true; // Aggiungi controlli qui
                }
                if(mediaElement){
                    photosGallery.appendChild(mediaElement);
                }
            });
        })
        .catch(error => console.error('Errore nel caricare la galleria completa:', error));
});