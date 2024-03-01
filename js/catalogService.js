function searchCatalog(options) {
    // Проверка, переданы ли только координаты
    
    // Формирование URL
    const { dateFrom, dateTo, west, east, south, north } = options;
    // Формирование URL
    var path = "http://old-eo.gharysh.kz/CatalogService?DateFr=" + dateFrom + "&DateTo=" + dateTo + "&West="+ west + "&East="+ east + "&South="+ south + "&North=" + north;
     fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            // Дальнейшие действия с полученными данными
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}


// Другие функции для обработки данных и взаимодействия с интерфейсом
function processData(data) {
    // Ваша функция обработки данных сюда
}

// Экспорт функций для использования в других модулях
export { searchCatalog, processData };