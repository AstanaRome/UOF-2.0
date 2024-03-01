

// Создание карты с использованием CartoDB
const map = L.map('map', {
    minZoom: 3,
    maxZoom: 15
}).setView([50, 70], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO'
}).addTo(map);

map.setMaxBounds([[90, -180], [-90, 180]]);
