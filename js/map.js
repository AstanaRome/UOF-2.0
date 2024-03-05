import { imageDataArray, searchCatalog } from "./catalogService.js";
import SearchOption from "./SearchOption.js"

// Создание карты с использованием CartoDB
const map = L.map('map', {
    minZoom: 3,
    maxZoom: 15
}).setView([50, 70], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO'
}).addTo(map);

map.setMaxBounds([[90, -180], [-90, 180]]);


const footprintGroupLayer = L.layerGroup();
footprintGroupLayer.addTo(map);



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

    const option = new SearchOption(inputStartDate, inputEndDate, west, east, south, north)
    searchCatalog(option)




});


function createFootprintGroup(imagesDataArray) {
    imagesDataArray.forEach(imageData => {
        if (imageData.IsChecked == true) {
            const coordinates = imageData.getCoordinatesForFootprint();
            const footprintGroup = L.imageOverlay.rotated("icon.svg", coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft, {
                opacity: 1,
                interactive: true,
            });
            footprintGroup.setZIndex(400);
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
        }
    });

}

function removeLayerFromMap(layerGroup) {
    if (layerGroup != undefined) {
        layerGroup.clearLayers();
    }
}
function removeOneLayerFromMap(layer) {
    if (layer != undefined) {
        map.removeLayer(layer);
    }
}


function removeFromFootprintGroupLayer(codeToRemove) {
    console.log(codeToRemove)
    footprintGroupLayer.eachLayer((layer) => {
        if (layer.options.id === codeToRemove) { // Проверяем, соответствует ли id слоя удаляемому коду
            footprintGroupLayer.removeLayer(layer); // Удаляем слой из группового слоя
        }
    });
}






export { map, removeLayerFromMap, createFootprintGroup, removeFromFootprintGroupLayer };
// Использование функции






