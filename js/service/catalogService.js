import SatelliteImage from "../models/SatelliteImage.js";
import { fillTableWithSatelliteImages } from "../main.js";
import { createFootprintGroup, createOneFootprint, createOneQuicklook, zoomToImage } from "../map.js";
import { reinitializeSlider } from "../utils/slider.js";
import { coordinatesFromKmlKmz } from "../kmlLayerButtonEvents.js";
const imageDataArray = []
let foundImage;

// var path = "http://10.0.6.117:8001/CatalogService?DateFr=" 
var path = "http://old-eo.gharysh.kz/CatalogService?DateFr="

function searchCatalogForKmlKmz(options) {
    // Проверка, переданы ли только координаты
    imageDataArray.length = 0;
    // Формирование URL
    const { dateFrom, dateTo, west, east, south, north, satellites, angle } = options;
    // Формирование URL  
    const fullPath = path + dateFrom + "&DateTo=" + dateTo + "&West=" + west + "&East=" + east + "&South=" + south + "&North=" + north;
    fetch(fullPath)
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



function searchCatalog(options) {
    // Проверка, переданы ли только координаты
    imageDataArray.length = 0;
    // Формирование URL
    const { dateFrom, dateTo, west, east, south, north, satellites, angle } = options;
    // Формирование URL  
    const fullPath = path + dateFrom + "&DateTo=" + dateTo + "&West=" + west + "&East=" + east + "&South=" + south + "&North=" + north;
    fetch(fullPath)
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





    if (imageID.startsWith("DS_")) {
        fetchImageByIDforKazEOSat1(imageID);
    } else if (imageID.startsWith("KM")) {
        fetchImageByIDforKazEOSat2(imageID);
    } else {
        console.error("Unknown satellite image ID format:", imageID);
    }


}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function fetchImageByIDforKazEOSat1(imageID) {
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

    const west = "179.356737";
    const east = "79.563306";
    const south = "-37.146315";
    const north = "-179.766815";

    const fullPath = path + dateFrom + "&DateTo=" + dateTo + "&West=" + west + "&East=" + east + "&South=" + south + "&North=" + north;

    fetch(fullPath)
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
                        createOneQuicklook(foundImage);
                        zoomToImage(foundImage);
                        reinitializeSlider(foundImage);
                        // const coordinates = foundImage.getCoordinatesForFootprint();

                        // createOneFootprint(coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft);  

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

function fetchImageByIDforKazEOSat2(imageID) {
    // Вычитаем один день



    // Пример использования:
    const idDict = {
        "KM000109MI": "2014-12-11",
        "KM00048bMI": "2015-06-29",
        "KM000764MI": "2015-12-30",
        "KM000cbdMI": "2016-06-29",
        "KM001356MI": "2016-12-30",
        "KM0018feMI": "2017-06-29",
        "KM001e2aMI": "2017-12-30",
        "KM0022fbMI": "2018-06-29",
        "KM00275fMI": "2018-12-30",
        "KM002bc2MI": "2019-06-29",
        "KM002fc0MI": "2019-12-30",
        "KM0035dbMI": "2020-06-29",
        "KM003c05MI": "2020-12-30",
        "KM00410aMI": "2021-06-29",
        "KM004556MI": "2021-12-30",
        "KM0049f4MI": "2022-06-29",
        "KM004e93MI": "2022-12-30",
        "KM005292MI": "2023-06-29",
        "KM005686MI": "2023-12-30",
        "KM0057f4MI": "2024-03-04"
    };

    const [dateFrom, dateTo] = findClosestValues(imageID, idDict);
    // Преобразуем полученные даты обратно в формат год-месяц-день

    const west = "179.356737";
    const east = "79.563306";
    const south = "-37.146315";
    const north = "-179.766815";

    const fullPath = path + dateFrom + "&DateTo=" + dateTo + "&West=" + west + "&East=" + east + "&South=" + south + "&North=" + north;

    fetch(fullPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const foundImage2 = data.data.find(item => item.Code === imageID);
            if (foundImage2) {
                console.log(foundImage2.Meta_Date)
                foundImage = new SatelliteImage(foundImage2);
                const coordinates = foundImage.getCoordinatesForFootprint();
                createOneFootprint(coordinates.topLeft, coordinates.topRight, coordinates.bottomLeft);
                createOneQuicklook(foundImage);
                zoomToImage(foundImage);
            } else {
                // Не найдено изображение с таким imageID
                console.log('Image not found');
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function findClosestValues(id, idDict) {
    const trimmedId = id.slice(0, -8); // Убираем "_006_MUL" с конца

    let prevKey = null;
    let nextKey = null;
    let prevKeyFound = false; // Флаг для обработки случая, когда ключ равен искомому айди

    for (const key in idDict) {
        if (key === trimmedId) {
            prevKeyFound = true;
        }
        if (key < trimmedId && (!prevKey || key > prevKey)) {
            prevKey = key;
        }
        if (key > trimmedId && (!nextKey || key < nextKey)) {
            nextKey = key;
        }
    }

    // Если найденный ключ совпадает с искомым айди, вернем его как оба ближайших ключа
    if (prevKeyFound) {
        nextKey = prevKey;
    }

    // Получаем значения для найденных ключей
    const prevValue = prevKey ? idDict[prevKey] : null;
    let nextValue = nextKey ? idDict[nextKey] : null;

    // Если следующего ключа нет (айди больше последнего ключа), установим дату сегодняшнего дня
    if (!nextValue) {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = today.getDate();
        day = day < 10 ? "0" + day : day;
        nextValue = `${year}-${month}-${day}`;
    }

    return [prevValue, nextValue];
}
// Экспорт функций для использования в других модулях
export { searchCatalog, imageDataArray, createFootprintGroup, searchOneImage, foundImage, searchCatalogForKmlKmz };