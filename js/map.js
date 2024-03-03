import { imageDataArray, searchCatalog } from "./catalogService.js";
import SearchOption  from "./SearchOption.js"

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
      if(layer != undefined){
        removeOneLayerFromMap(layer)
      }

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

    const option = new  SearchOption(inputStartDate, inputEndDate, west, east, south, north)
    searchCatalog(option)
    console.log("test2")
    createFootprintGroup(imageDataArray);
    console.log(imageDataArray)



});


function createFootprintGroup(imagesDataArray) { 
    console.log("test3")   
    imagesDataArray.forEach(imageData => {
        console.log("test4")
        console.log(imageData.getCoordinatesForFootprint().topLeft)
        footprintGroup = L.imageOverlay.rotated("icon.svg", imageData.getCoordinatesForFootprint().topLeft, getCoordinatesForFootprint().topRight, getCoordinatesForFootprint().bottomLeft, {
            opacity: 1,
            interactive: true,
        })//.bindPopup(name)
        //footprintGroup.popupContent = name;
        footprintGroupLayer.addLayer(footprintGroup);
    });
    
    

   

    


    
   


    // footprintGroup.on('click', function(e) {
    //    // inputId.value = name;
    //    // findImage();
       
    //     // В этом месте вы можете выполнить любые действия для отображения информации о слое
    //     // Например, отобразить всплывающее окно (popup) с информацией
    //     var popup = L.popup()
    //         .setLatLng(e.latlng) // Устанавливаем положение всплывающего окна там, где был сделан клик
    //         .setContent(name) // Здесь должна быть ваша информация о слое
    //         .openOn(map);
    //         var content = popup.getContent();
    //         findImage(content);
    // });

    
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








export { map, removeLayerFromMap };
// Использование функции




    

    