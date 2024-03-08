import SatelliteImage from "../models/SatelliteImage.js";
import { fillTableWithSatelliteImages, inputFirstLineNum, inputLineMax } from "../main.js";
import { createFootprintGroup, createOneFootprint, createOneQuicklook, zoomToImage } from "../map.js";
import { reinitializeSlider } from "../utils/slider.js";
const imageDataArray = []
let foundImage;

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

async function searchOneImage(imageID) {


    const year = imageID.slice(9, 13);
    const month = imageID.slice(13, 15);
    const day = imageID.slice(15, 17);
    
    // Создаем новую дату на основе полученных значений
    const currentDate = new Date(`${year}-${month}-${day}`);
    
    // Вычитаем один день
    const oneDayBefore = new Date(currentDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    
    // Плюсуем один день
    const oneDayAfter = new Date(currentDate);
    oneDayAfter.setDate(oneDayAfter.getDate() + 1);
    
    // Преобразуем полученные даты обратно в формат год-месяц-день
    const dateFrom = formatDate(oneDayBefore);
    const dateTo = formatDate(oneDayAfter);
    
    
    //var path = "http://10.0.6.117:8001/CatalogService?DateFr=" + dateFrom + "&DateTo=" + dateTo + "&West=179.356737&East=79.563306&South=-37.146315&North=-179.766815"
    var path = "http://old-eo.gharysh.kz/CatalogService?DateFr=" + dateFrom + "&DateTo=" + dateTo + "&West=179.356737&East=79.563306&South=-37.146315&North=-179.766815"
    fetch(path)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const foundImage2 = data.data.find(item => item.Code === imageID);
        if (foundImage2) {
            foundImage = new SatelliteImage(foundImage2);
            foundImage.calculateLines(foundImage2.Quicklook)
                .then(lines => {
                    foundImage.Lines = lines;
                    createOneFootprint(foundImage);
                    createOneQuicklook(foundImage);
                    zoomToImage(foundImage);
                    reinitializeSlider(foundImage);
                    inputFirstLineNum.value = 1
                    inputLineMax.value = foundImage.Lines;
                })
                .catch(error => {
                    console.error('Ошибка при вычислении lines:', error.message);
                });
        } else {
            // Не найдено изображение с таким imageID
            console.log('Image not found');
        }
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });


}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Экспорт функций для использования в других модулях
export { searchCatalog, imageDataArray, createFootprintGroup, searchOneImage, foundImage };