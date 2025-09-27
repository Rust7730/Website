
const API_KEY = 'i3fB518bc4HWgErQH5r7oz6W3vAwepfb8sTevDZ6'; 


async function getApod() {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la red: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener APOD:', error);
        return null; 
    }
}
///
async function getIssPosition() {
    const url = 'https://api.wheretheiss.at/v1/satellites/25544';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la red: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener la posición de la ISS:', error);
        return null;
    }
}
///
async function getNearbyAsteroids() {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7);

    const startDateString = today.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDateString}&end_date=${endDateString}&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la red: ${response.statusText}`);
        }
        const data = await response.json();
        const asteroids = Object.values(data.near_earth_objects).flat();
        return asteroids.sort((a, b) => {
            return new Date(a.close_approach_data[0].close_approach_date_full) - new Date(b.close_approach_data[0].close_approach_date_full);
        });
    } catch (error) {
        console.error('Error al obtener los asteroides:', error);
        return [];
    }
}