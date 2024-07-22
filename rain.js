const express = require('express');
const axios = require('axios');
const geolib = require('geolib');

const app = express();
const PORT = 3000;
let userCoordinates = { lat: 35.0844, lon: -106.6504 }; // User's coordinates (latitude, longitude)

app.use(express.static('public'));

// Function to get weather data for a given location
async function getWeatherData(lat, lon) {
    const apiKey = 'H9Gi6SVWPqGv5d1BFbioLoEdUeu5mFqL';
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
}

// Function to generate a grid of coordinates around a central point
function generateGrid(lat, lon, radiusKm, stepKm) {
    const grid = [];
    const stepDegrees = stepKm / 111; // Approx conversion from km to degrees
    for (let i = -radiusKm; i <= radiusKm; i += stepKm) {
        for (let j = -radiusKm; j <= radiusKm; j += stepKm) {
            grid.push({ lat: lat + i * stepDegrees, lon: lon + j * stepDegrees });
        }
    }
    return grid;
}

// Function to find all locations with rain
async function findRainLocations(locations) {
    const rainLocations = [];
    for (const loc of locations) {
        try {
            const weatherData = await getWeatherData(loc.lat, loc.lon);
            if (weatherData.data.values.weatherCode === 4000 || weatherData.data.values.weatherCode === 4200 || weatherData.data.values.weatherCode === 4201
                || weatherData.data.values.weatherCode === 4001) {
                rainLocations.push(loc);
            }
        }
        catch (error) {
        }
        //rainLocations.push(loc);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
    console.log(rainLocations.length);
    return rainLocations;
}

// Function to find the closest location with rain
function findClosestRainLocation(userLat, userLon, rainLocations) {
    let minDistance = Infinity;
    let closestLocation = null;
    for (const loc of rainLocations) {
        const distance = geolib.getDistance(
            { latitude: userLat, longitude: userLon },
            { latitude: loc.lat, longitude: loc.lon }
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestLocation = loc;
        }
    }
    return [closestLocation, minDistance];
}

// Example usage
/*(async () => {
    const userCoordinates = { lat: 35.0844, lon: 106.6504 }; // User's coordinates (latitude, longitude)
    const radiusKm = 33;  // Radius in kilometers to search for rain
    const stepKm = 33;    // Step in kilometers for grid generation

    const gridLocations = generateGrid(userCoordinates.lat, userCoordinates.lon, radiusKm, stepKm);
    //const gridLocations = [ userCoordinates ];
    const rainLocations = await findRainLocations(gridLocations);
    const closestRainLocations = findClosestRainLocation(userCoordinates.lat, userCoordinates.lon, rainLocations);

    console.log(closestRainLocations[0] + ", about "  + closestRainLocations[1] + " km away.");
})();*/

app.get('/location', async (req, res) => {
    const { latitude, longitude } = req.query;
    userCoordinates = { lat: latitude, lon: longitude };
    console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);
    res.send('Location received');
})

app.get('/find-rain', async (req, res) => {
    //const { lat, lon } = req.query;

    const radiusKm = 100;  // Radius in kilometers to search for rain
    const stepKm = 100;    // Step in kilometers for grid generation

    console.log(userCoordinates);

    const gridLocations = generateGrid(userCoordinates.lat, userCoordinates.lon, radiusKm, stepKm);
    //const gridLocations = [ { lat: 35.0844, lon: 103.6504 } ];
    const rainLocations = await findRainLocations(gridLocations);
    const closestRainLocations = findClosestRainLocation(userCoordinates.lat, userCoordinates.lon, rainLocations);

    if (closestRainLocations[0]) {
        res.json({ message: ("[" + closestRainLocations[0].lat + ", " + closestRainLocations[0].lon + "], about "  + closestRainLocations[1] + " km away.")}); 
    } else {
        res.json({ message: "No idea!"});
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});