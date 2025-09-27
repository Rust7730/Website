document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const apodContainer = document.getElementById('apod-container');

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

    showPage('apod');
    loadApod();
});