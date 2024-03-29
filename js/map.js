import { foundImage, imageDataArray, searchCatalog } from "./service/catalogService.js";
import SearchOption from "./models/SearchOption.js"
import SatelliteImage from "./models/SatelliteImage.js"
import { clickAction, map } from "./main.js";

// Создание карты с использованием CartoDB

export function initMap() {
    const map = L.map('map', {
        doubleClickZoom: false,
        minZoom: 3,
        maxZoom: 15
    }).setView([50, 70], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO'
    }).addTo(map);

    return map;
}

map.setMaxBounds([[90, -180], [-90, 180]]);

function createMouseCoordinatesControl() {
    var control = L.control({ position: 'bottomleft' });

    control.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'transparent-control mouse-coordinates-control');
        this._div.innerHTML = '';

        // Обработчик события при перемещении указателя мыши
        map.on('mousemove', function (e) {
            var coordinates = e.latlng; // Координаты хранятся в объекте "latlng"
            var lat = coordinates.lat.toFixed(5); // Округление широты до 5 знаков после запятой
            var lng = coordinates.lng.toFixed(5); // Округление долготы до 5 знаков после запятой
            control._div.innerHTML = 'lat: ' + lat + ', lng: ' + lng;
        });

        return this._div;
    };

    return control;
}

createMouseCoordinatesControl().addTo(map);

const footprintGroupLayer = L.layerGroup();
const QuicklookGroupLayer = L.layerGroup();
let oneFootprint;
let oneQucklook;
let quicklookForMouse;

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
        rectangle: {
            shapeOptions: {
                color: '#808080', // Цвет границы
                fillColor: '#0000', // Цвет заливки (прозрачный)
                fillOpacity: 0, // Прозрачность заливки
                weight: 5 // Толщина границы
            }
        },
        polygon: false, // Отключаем рисование полигонов (и других фигур)
        polyline: false, // Отключаем рисование линий
        circle: false, // Отключаем рисование кругов
        circlemarker: false, // Отключаем рисование маркеров-кругов
        marker: false
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
    // layer.setStyle({
    //     color: '#ff7800', // Цвет границы
    //     fillColor: '#ff7800', // Цвет заливки
    //     fillOpacity: 0.8, // Прозрачность заливки
    //     weight: 2, // Толщина границы
    // });

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
        if (!footprintLayers.hasOwnProperty(imageData.Code)) {
            
        var latlngs = [
            imageData.getCoordinatesForFootprint().topLeft,
            imageData.getCoordinatesForFootprint().topRight,
            imageData.getCoordinatesForFootprint().bottomRight,
            imageData.getCoordinatesForFootprint().bottomLeft
        ];

        const footprintGroup = L.polygon(latlngs, {
            color: 'lightcoral', // Цвет границы //darkslate
            fillColor: '#0000', // Цвет заливки (прозрачный)
            fillOpacity: 0, // Прозрачность заливки
            weight: 3 // Толщина границы
        });
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
            toggleVisibility(imageData);
        });

        footprintGroup.on('dblclick', () => {
            
            clickAction(imageData);
        });
        footprintGroup.on('mouseover', function(e) {
            e.target.setStyle({
                color: 'blue', // исходный цвет границы
                fillColor: '#0000', // исходный цвет заливки (прозрачный)
                fillOpacity: 0 // исходная прозрачность заливки
            });


            // document.querySelectorAll('#dataTable tr').forEach(row => {
            //     row.style.backgroundColor = ''; // Сброс цвета фона
            // });
           
            // // Выделяем соответствующую строку
            // const relatedRow = document.getElementById(`row-${imageData.Code}`);
            // if (relatedRow) {
            //     relatedRow.style.backgroundColor = '#ADD8E6'; // Светло-голубой цвет фона для выделения
            //     relatedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // }
           createQuicklookForMouse(imageData);
        });
        footprintGroup.on('mouseout',  function(e) {
            e.target.setStyle({
                color: 'lightcoral', // исходный цвет границы
                fillColor: '#0000', // исходный цвет заливки (прозрачный)
                fillOpacity: 0 // исходная прозрачность заливки
            });
            removeOneLayerFromMap(quicklookForMouse);
        });

        // Добавление слоя footprintGroup в общий слой footprintGroupLayer
        footprintGroupLayer.addLayer(footprintGroup);
        footprintLayers[imageData.Code] = footprintGroup;
        } 


    });

}


function createOneFootprint(topLeft, topRight, bottomLeft) {
    removeOneLayerFromMap(oneFootprint);

    // Определение, является ли входной параметр объектом Leaflet или массивом
    var isLeafletObject = topLeft.hasOwnProperty('lat') && topLeft.hasOwnProperty('lng');

    var bottomRight;

    if (isLeafletObject) {
        // Если работаем с объектами Leaflet
        bottomRight = {
            lat: topRight.lat + bottomLeft.lat - topLeft.lat,
            lng: topRight.lng + bottomLeft.lng - topLeft.lng
        };
    } else {
        // Если работаем с массивами координат
        bottomRight = [
            topRight[0] + bottomLeft[0] - topLeft[0],
            topRight[1] + bottomLeft[1] - topLeft[1]
        ];
    }

    // Формирование массива координат для Leaflet, учитывая тип входных данных
    var latlngs = isLeafletObject ? [
        L.latLng(topLeft.lat, topLeft.lng),
        L.latLng(topRight.lat, topRight.lng),
        L.latLng(bottomRight.lat, bottomRight.lng),
        L.latLng(bottomLeft.lat, bottomLeft.lng)
    ] : [
        L.latLng(topLeft[0], topLeft[1]),
        L.latLng(topRight[0], topRight[1]),
        L.latLng(bottomRight[0], bottomRight[1]),
        L.latLng(bottomLeft[0], bottomLeft[1])
    ];

    // Создание прямоугольного полигона и добавление его на карту
    oneFootprint = L.polygon(latlngs, {
        color: '#00FF00', // Цвет границы
        fillColor: '#0000', // Цвет заливки
        fillOpacity: 0.5, // Прозрачность заливки
        weight: 4 // Толщина границы
    }).addTo(map);
}


function createOneQuicklook(oneImage) {
    removeOneLayerFromMap(oneQucklook);
    const coordinates = oneImage.getCoordinatesForFootprint();
    oneQucklook = L.imageOverlay.rotated(oneImage.Quicklook, coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft, {
        opacity: 5,
        interactive: true,
    });
    oneQucklook.addTo(map);
}


function createQuicklookForMouse(oneImage) {
    const coordinates = oneImage.getCoordinatesForFootprint();
    quicklookForMouse = L.imageOverlay.rotated(oneImage.Quicklook, coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft, {
        opacity: 1,
        interactive: true,
    });



    // quicklookForMouse = L.imageOverlay.rotated(oneImage.Quicklook, coordinates.bottomRight, coordinates.topRight, coordinates.bottomLeft, {
    //     opacity: 1,
    //     interactive: true,
    // });
   
    quicklookForMouse.addTo(map);
}


function createQuicklookGroup(imagesDataArray) {
    imagesDataArray.forEach(imageData => {
        const coordinates = imageData.getCoordinatesForFootprint();
        // const QuicklookGroup = L.imageOverlay.rotated(imageData.Quicklook, coordinates.bottomRight, coordinates.topRight, coordinates.bottomLeft, {
        //     opacity: 1,
        //     interactive: true,
        // });
        const QuicklookGroup = L.imageOverlay.rotated(imageData.Quicklook, coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft, {
            opacity: 1,
            interactive: true,
        });
       
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
        quicklookLayers[imageData.Code + ".ql"] = QuicklookGroup;

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

function toggleVisibility(image) {
   
   
    // Если объект уже выключен и пытаемся снова выключить, не делаем ничего
    if (image.IsVisibleOnMap) return;
    // Переключаем состояние видимости только если объект включен
    image.IsVisibleOnMap = !image.IsVisibleOnMap;

    // Находим иконку видимости в DOM
    const visibilityIcon = document.querySelector(`i[data-code="${image.Code}"]`);
    // Обновляем класс иконки в зависимости от нового состояния видимости
    if (visibilityIcon) {
        visibilityIcon.className = image.IsVisibleOnMap ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        if (image.IsVisibleOnMap) {
            // Показываем объект на карте
            createQuicklookGroup([image]);
        } 
    } else {
        console.error('Icon not found for', image.Code);
    }
}

// function hideVisibility(image) {
   
   
//     // Если объект уже выключен и пытаемся снова выключить, не делаем ничего
//     if (!image.IsVisibleOnMap) return;
//     // Переключаем состояние видимости только если объект включен
//     image.IsVisibleOnMap = image.IsVisibleOnMap;

//     // Находим иконку видимости в DOM
//     const visibilityIcon = document.querySelector(`i[data-code="${image.Code}"]`);
//     // Обновляем класс иконки в зависимости от нового состояния видимости
//     if (visibilityIcon) {
//         visibilityIcon.className = image.IsVisibleOnMap ? 'fas fa-eye' : 'fas fa-eye-slash';
        
//         if (image.IsVisibleOnMap) {
//             // Показываем объект на карте
//             removeFromQuicklookGroupLayer(image.Code);
//         } 
//     } else {
//         console.error('Icon not found for', image.Code);
//     }
// }

export {
    footprintLayers, quicklookLayers, removeLayerFromMap, removeOneLayerFromMap, createFootprintGroup, removeFromFootprintGroupLayer,
    createQuicklookGroup, removeFromQuicklookGroupLayer, oneFootprint, oneQucklook, createOneFootprint, createOneQuicklook, zoomToImage, footprintGroupLayer, QuicklookGroupLayer
};
// Использование функции






