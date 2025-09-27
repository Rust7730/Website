
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