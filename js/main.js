
function fillTableWithSatelliteImages(images) {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Очистить текущее содержимое tbody

    images.forEach(image => {
        let row = document.createElement('tr');

        // Добавление галочки (пример использования ячейки без данных)
        let checkCell = document.createElement('td');
        row.appendChild(checkCell);

        // Добавление Quicklook
        let quicklookCell = document.createElement('td');
        let img = document.createElement('img');
        img.src = image.Quicklook;
        img.style.width = '50px'; // Пример ограничения размера изображения
        quicklookCell.appendChild(img);
        row.appendChild(quicklookCell);

        // Добавление Satellite ID
        let satelliteIDCell = document.createElement('td');
        satelliteIDCell.appendChild(document.createTextNode(image.Code));
        row.appendChild(satelliteIDCell);

        // Добавление ячеек для Информации, Видимости и Zoom (в этом примере без действующих элементов)
        let infoCell = document.createElement('td');
        row.appendChild(infoCell);

        let visibilityCell = document.createElement('td');
        row.appendChild(visibilityCell);

        let zoomCell = document.createElement('td');
        row.appendChild(zoomCell);

        tableBody.appendChild(row);
    });
}

export {fillTableWithSatelliteImages};
