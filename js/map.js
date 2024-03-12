import { imageDataArray, searchCatalog } from "./service/catalogService.js";
import SearchOption from "./models/SearchOption.js"
import SatelliteImage from "./models/SatelliteImage.js"
import { map } from "./main.js";

// Создание карты с использованием CartoDB

export function initMap() {
    const map = L.map('map', {
        minZoom: 3,
        maxZoom: 15
    }).setView([50, 70], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO'
    }).addTo(map);

    return map;
}

map.setMaxBounds([[90, -180], [-90, 180]]);


const footprintGroupLayer = L.layerGroup();
const QuicklookGroupLayer = L.layerGroup();
let oneFootprint;
let oneQucklook;
footprintGroupLayer.addTo(map);
QuicklookGroupLayer.addTo(map);

let footprintLayers = {};
let quicklookLayers = {};

var layer;

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Настройки для рисования полигонов (в данном случае - квадратов)
var drawOptions = {
    draw: {
        rectangle: {}, // Опции для квадрата (оставляем пустыми для включения)
        polygon: false, // Отключаем рисование полигонов (и других фигур)
        polyline: false, // Отключаем рисование линий
        circle: false, // Отключаем рисование кругов
        circlemarker: false, // Отключаем рисование маркеров-кругов
        marker: false,


        // Задайте другие опции для рисования здесь
    },
    edit: false,
    remove: false
};

var drawControl = new L.Control.Draw(drawOptions);
map.addControl(drawControl);

// Обработчик события при завершении рисования полигона
map.on('draw:created', function (e) {
    if (layer != undefined) {
        removeOneLayerFromMap(layer)
    }
    footprintLayers = {};
    quicklookLayers = {};
    removeLayerFromMap(QuicklookGroupLayer);
    removeLayerFromMap(footprintGroupLayer);
    layer = e.layer;
    drawnItems.addLayer(layer);

    var rectangle = layer.toGeoJSON();
    var coordinates = rectangle.geometry.coordinates[0]; // Координаты хранятся в свойстве "coordinates"

    var north = coordinates[1][0];
    var west = coordinates[3][0];
    var east = coordinates[1][1];
    var south = coordinates[3][1];
    const inputStartDate = document.getElementById('startDate').value;
    const inputEndDate = document.getElementById('endDate').value;

    const selectedSatellites = Array.from(document.querySelectorAll('input[name="satellite"]:checked'))
        .map(checkbox => checkbox.value);

    // Получаем угол
    const angle = parseInt(document.getElementById('angle').value); // для целого числа
    const option = new SearchOption(inputStartDate, inputEndDate, west, east, south, north, selectedSatellites, angle);
    searchCatalog(option)
});


function createFootprintGroup(imageDataArray) {
    imageDataArray.forEach(imageData => {    
            const coordinates = imageData.getCoordinatesForFootprint();          
   
            const footprintGroup = L.imageOverlay.rotated("icon.svg", coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft, {
                opacity: 1,
                interactive: true,
            });
            footprintGroup.setZIndex(401);
            // Пример добавления всплывающего окна с названием изображения
            footprintGroup.bindPopup(imageData.Code);
            footprintGroup.on('click', () => {
                document.querySelectorAll('#dataTable tr').forEach(row => {
                    row.style.backgroundColor = ''; // Сброс цвета фона
                });

                // Выделяем соответствующую строку
                const relatedRow = document.getElementById(`row-${imageData.Code}`);
                if (relatedRow) {
                    relatedRow.style.backgroundColor = '#ADD8E6'; // Светло-голубой цвет фона для выделения
                    relatedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            // Добавление слоя footprintGroup в общий слой footprintGroupLayer
            footprintGroupLayer.addLayer(footprintGroup);
            footprintLayers[imageData.Code] = footprintGroup;
     
    });

}


function createOneFootprint(topLeft, topRight, bottomLeft) {
    removeOneLayerFromMap(oneFootprint);   
    oneFootprint = L.imageOverlay.rotated("icon green.svg", topLeft, topRight, bottomLeft, {
        opacity: 1,
        interactive: true,
    });
    oneFootprint.setZIndex(402);
    oneFootprint.addTo(map);
}

function createOneQuicklook(oneImage){
    removeOneLayerFromMap(oneQucklook);  
    const coordinates = oneImage.getCoordinatesForFootprint();      
    oneQucklook = L.imageOverlay.rotated(oneImage.Quicklook, coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft, {
        opacity: 1,
        interactive: true,
    });
    oneQucklook.addTo(map);
}





function createQuicklookGroup(imagesDataArray) {
    imagesDataArray.forEach(imageData => {    
            const coordinates = imageData.getCoordinatesForFootprint();  
            const QuicklookGroup = L.imageOverlay.rotated(imageData.Quicklook, coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft, {
                opacity: 1,
                interactive: true,
            });
            QuicklookGroup.setZIndex(400);
            // Пример добавления всплывающего окна с названием изображения
            QuicklookGroup.bindPopup(imageData.Code);
            QuicklookGroup.on('click', () => {
                document.querySelectorAll('#dataTable tr').forEach(row => {
                    row.style.backgroundColor = ''; // Сброс цвета фона
                });

                // Выделяем соответствующую строку
                const relatedRow = document.getElementById(`row-${imageData.Code}`);
                if (relatedRow) {
                    relatedRow.style.backgroundColor = '#ADD8E6'; // Светло-голубой цвет фона для выделения
                    relatedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            // Добавление слоя footprintGroup в общий слой footprintGroupLayer
            QuicklookGroupLayer.addLayer(QuicklookGroup);
            quicklookLayers[imageData.Code] = QuicklookGroup;
     
    });

}










function removeOneLayerFromMap(layer) {
    if (layer != undefined) {
        map.removeLayer(layer);
    }
}

function removeLayerFromMap(layerGroup) {
    if (layerGroup != undefined) {
        layerGroup.clearLayers();
    }
}

function removeFromFootprintGroupLayer(code) {
    const layerRemove = footprintLayers[code];
    if (layerRemove) {
        footprintGroupLayer.removeLayer(layerRemove); // Удаляем слой из группового слоя
        delete footprintLayers[code]; // Удаляем ссылку на слой из объекта
    } else {
        console.log("Layer with code", code, "not found.");
    }
}

function removeFromQuicklookGroupLayer(code) {
    const layerRemove = quicklookLayers[code];
    if (layerRemove) {
        QuicklookGroupLayer.removeLayer(layerRemove); // Удаляем слой из группового слоя
        delete footprintLayers[code]; // Удаляем ссылку на слой из объекта
    } else {
        console.log("Layer with code", code, "not found.");
    }
}

function zoomToImage(image) {
    const splitCoords = image.Coordinates.split(" ").map(Number);
    let sumLat = 0, sumLng = 0;
    var currentZoom = map.getZoom();
    for (let i = 0; i < splitCoords.length; i += 2) {
        sumLat += splitCoords[i];
        sumLng += splitCoords[i + 1];
    }

    const centerLat = sumLat / (splitCoords.length / 2);
    const centerLng = sumLng / (splitCoords.length / 2);

    // Установка центра карты и зума
    map.setView([centerLat, centerLng], currentZoom); 
}


export { footprintLayers, quicklookLayers, removeLayerFromMap, removeOneLayerFromMap, createFootprintGroup, removeFromFootprintGroupLayer, 
    createQuicklookGroup, removeFromQuicklookGroupLayer, oneFootprint, oneQucklook, createOneFootprint, createOneQuicklook, zoomToImage, footprintGroupLayer, QuicklookGroupLayer };
// Использование функции






