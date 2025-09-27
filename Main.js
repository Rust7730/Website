document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const apodContainer = document.getElementById('apod-container');
    const asteroidsContainer = document.getElementById('asteroids-container');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });

    async function loadApod() {
        const data = await getApod();
        apodContainer.innerHTML = '';
        if (data) {
            let mediaHtml = '';
            if (data.media_type === 'image') {
                mediaHtml = `<img src="${data.hdurl}" alt="${data.title}">`;
            } else if (data.media_type === 'video') {
                mediaHtml = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
            }

            apodContainer.innerHTML = `
                <h3>${data.title}</h3>
                <p><strong>Fecha:</strong> ${data.date}</p>
                ${mediaHtml}
                <p>${data.explanation}</p>
            `;
        } else {
            apodContainer.innerHTML = `<p>No se pudo cargar la imagen del día. Inténtalo más tarde.</p>`;
        }
    }
    let issMap;
    let issMarker;
    const issIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', // URL de un ícono simple
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        });
    function initializeIssMap() {
     issMap = L.map('iss-map-container').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(issMap);

    issMarker = L.marker([0, 0], { icon: issIcon }).addTo(issMap);
}

    async function updateIssPosition() {
    const data = await getIssPosition();
    if (!data) return;

    const { latitude, longitude, velocity, altitude } = data;

    issMarker.setLatLng([latitude, longitude]);
    issMap.setView([latitude, longitude], issMap.getZoom());

    const issDataContainer = document.getElementById('iss-data-container');
    issDataContainer.innerHTML = `
        <div class="iss-data-item">
            <h4>Velocidad</h4>
            <p>${velocity.toFixed(2)} km/h</p>
        </div>
        <div class="iss-data-item">
            <h4>Altitud</h4>
            <p>${altitude.toFixed(2)} km</p>
        </div>
        <div class="iss-data-item">
            <h4>Latitud</h4>
            <p>${latitude.toFixed(4)}</p>
        </div>
        <div class="iss-data-item">
            <h4>Longitud</h4>
            <p>${longitude.toFixed(4)}</p>
        </div>
    `;
}
async function loadAsteroids() {
    asteroidsContainer.innerHTML = '<div class="loader"></div>';
    const asteroids = await getNearbyAsteroids();
    asteroidsContainer.innerHTML = '';

    if (asteroids && asteroids.length > 0) {
        asteroids.forEach(asteroid => {
            const cardClass = asteroid.is_potentially_hazardous_asteroid ? 'asteroid-card hazardous' : 'asteroid-card';
            const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3);
            const missDistance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString('es-ES', { maximumFractionDigits: 0 });
            const velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString('es-ES', { maximumFractionDigits: 0 });

            const card = `
                <div class="${cardClass}">
                    <h4>${asteroid.name}</h4>
                    ${asteroid.is_potentially_hazardous_asteroid ? '<p class="hazardous-warning">⚠️ Potencialmente Peligroso</p>' : ''}
                    <p><strong>Fecha de máxima aproximación:</strong> ${asteroid.close_approach_data[0].close_approach_date_full}</p>
                    <p><strong>Diámetro estimado:</strong> ${diameter} km</p>
                    <p><strong>Pasará a una distancia de:</strong> ${missDistance} km de la Tierra</p>
                    <p><strong>Velocidad:</strong> ${velocity} km/h</p>
                </div>
            `;
            asteroidsContainer.innerHTML += card;
        });
    } else {
        asteroidsContainer.innerHTML = '<p>No se encontraron asteroides cercanos en los próximos 7 días.</p>';
    }
}
showPage('apod');
    loadApod();
    initializeIssMap();
    updateIssPosition(); 
    setInterval(updateIssPosition, 5000); 
      loadAsteroids();

});
