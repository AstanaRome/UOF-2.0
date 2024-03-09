
import { map, removeLayerFromMap } from './map.js';
import { foundImage, searchOneImage } from './service/catalogService.js';

const kmlLayerGroup = L.layerGroup().addTo(map);

var kmlMapLayer = null

document.getElementById('headerBtnKmlUpload').addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.setAttribute('accept', '.kml,.kmz');
    // Обработчик события выбора файла
    fileInput.addEventListener('change', function (event) {
                

        const file = event.target.files[0];
        
        if (file.name.endsWith('.kml')) {
            removeLayerFromMap(kmlLayerGroup)
            // Если выбран KML файл
            const reader = new FileReader();
            reader.onload = function (e) {
                const kmlText = e.target.result;
                // Загрузка и добавление KML на карту Leaflet
                
                loadAndAddKML(kmlText);
            };
            reader.readAsText(file);
        } else if (file.name.endsWith('.kmz')) {
            removeLayerFromMap(kmlLayerGroup)
            // Если выбран KMZ файл
            const reader = new FileReader();
            reader.onload = function (e) {
                const kmzData = e.target.result;
                // Работа с KMZ данными
                handleKMZData(kmzData);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    // Нажатие на элемент input типа "file"
    fileInput.click();
});

// Функция загрузки и добавления KML на карту Leaflet
function loadAndAddKML(kmlText) {
    const parser = new DOMParser();
    const kml = parser.parseFromString(kmlText, 'text/xml');

    // Удаление предыдущего слоя KML, если он существует
    if (kmlMapLayer) {
        map.removeLayer(kmlMapLayer);
    }

    // Создание нового слоя KML
    kmlMapLayer = new L.KML(kml);
    map.setView(kmlMapLayer.getBounds().getNorthWest(), 7);
    kmlMapLayer.setStyle({ color: 'blue', fillColor: 'blue' });
    kmlMapLayer.addTo(kmlLayerGroup);

    // Получение координат слоя
    const coordinates = kmlMapLayer.getLatLngs();
    console.log('Coordinates:', coordinates);
}

// Функция обработки данных KMZ
function handleKMZData(kmzData) {
    // Создание экземпляра JSZip и загрузка KMZ данных
    const zip = new JSZip();
    zip.loadAsync(kmzData).then(function (zip) {
        // Найдите KML файл в архиве KMZ
        const kmlFile = zip.file(/.*\.kml$/i)[0];
        if (kmlFile) {
            return kmlFile.async('string');
        } else {
            throw new Error("KML file not found in KMZ archive.");
        }
    }).then(function (kmlContent) {
        // Преобразуйте XML KML в объект и добавьте на карту
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlContent, 'text/xml');
        // Создание слоя KML
        kmlMapLayer = new L.KML(kml);
        map.setView(kmlMapLayer.getBounds().getNorthWest(), 7);
        kmlMapLayer.setStyle({ color: 'blue', fillColor: 'blue' });
        kmlMapLayer.addTo(kmlLayerGroup);
    }).catch(function (error) {
        console.error(error);
    });
}



const btnFind = document.getElementById('btnFind');
const inputSatelliteId = document.getElementById('inputSatelliteId');

btnFind.addEventListener('click', function() {
    const imageID = inputSatelliteId.value;
    if (imageID) {
        searchOneImage(imageID);
    } else {
        // Пользователь не ввел ID снимка
        console.error('Please enter the image ID');
    }
});



document.addEventListener('DOMContentLoaded', function() {
    var openButton = document.getElementById('infoButton');
    var infoBox = document.getElementById('infoBox');
    var closeButton = document.getElementById('closeButton');


    var infoContent = document.getElementById('infoContent');

    openButton.addEventListener('click', function() {
        
    if (!foundImage) {
        // Если данных нет, отображаем сообщение об отсутствии данных
        infoContent.innerHTML = '<p>Нет данных для отображения.</p>';
    } else {
        var content = "<h2>Информация о снимке</h2>";
        content += "<p>ID снимка: " + foundImage.Code + "</p>";
        content += "<p>Дата снимка: " + foundImage.Meta_Date + "</p>";
        content += "<p>Космический аппарат: " + foundImage.Satellite + "</p>";
        if (foundImage.IncidenceAngle !== null) {
            content += "<p>Угол съемки: " + foundImage.IncidenceAngle + " градусов</p>";
        } else {
        }
        // Если данные есть, заполняем всплывающее окно этими данными
        // Здесь добавьте код для заполнения информации из ваших данных
        infoContent.innerHTML = content;
    }
        infoBox.style.display = 'block';

    });

    closeButton.addEventListener('click', function() {
        infoBox.style.display = 'none';
    });   
});







function getCoordinatesFromKML(kml) {
    const coordinates = [];
    const placemarks = kml.getElementsByTagName('Placemark');
    for (let i = 0; i < placemarks.length; i++) {
        const coordinatesNode = placemarks[i].getElementsByTagName('coordinates')[0];
        if (coordinatesNode) {
            const coords = coordinatesNode.textContent.trim().split(',');
            if (coords.length === 3) {
                const [lng, lat] = coords;
                coordinates.push([parseFloat(lat), parseFloat(lng)]);
            }
        }
    }
    return coordinates;
}

// Функция очистки слоя KML
