import SatelliteImage from "../models/SatelliteImage.js";
import { fillTableWithSatelliteImages } from "../main.js";
import { createFootprintGroup } from "../map.js";
const imageDataArray = []


function searchCatalog(options) {
    // Проверка, переданы ли только координаты
    imageDataArray.length = 0;
    // Формирование URL
    const { dateFrom, dateTo, west, east, south, north, satellites, angle } = options;
    // Формирование URL  
    //  var path = "http://10.0.6.117:8001/CatalogService?DateFr=" + dateFrom + "&DateTo=" + dateTo + "&West=" + west + "&East=" + east + "&South=" + south + "&North=" + north;
    var path = "http://old-eo.gharysh.kz/CatalogService?DateFr=" + dateFrom + "&DateTo=" + dateTo + "&West="+ west + "&East="+ east + "&South="+ south + "&North=" + north;
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.data.forEach(item => {
                const satelliteImage = new SatelliteImage(item);
                // Проверка по спутнику и углу
                if (satellites.some(satellite => satellite === item.Satellite) && item.IncidenceAngle <= angle) {
                    imageDataArray.push(satelliteImage);
                    // Дальнейшие действия с полученными данными
                }
                
                // Дальнейшие действия с полученными данными
            });
            // Дальнейшие действия с полученными данными
            //createFootprintGroup(imageDataArray);
            imageDataArray.sort((a, b) => {
                if (b.Code < a.Code) return -1;
                if (b.Code > a.Code) return 1;
                return 0;
            });
            fillTableWithSatelliteImages(imageDataArray)
        })

        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}




// Экспорт функций для использования в других модулях
export { searchCatalog, imageDataArray, createFootprintGroup };