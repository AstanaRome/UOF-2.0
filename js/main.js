
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
        img.style.width = '50px'; // Ограничение ширины изображения
        img.style.height = '50px'; // Ограничение высоты изображения
        img.style.objectFit = 'cover'; // Обеспечение сохранения пропорций изображения без искажений
        quicklookCell.appendChild(img);
        row.appendChild(quicklookCell);

        // Добавление Satellite ID
        let satelliteIDCell = document.createElement('td');
        satelliteIDCell.style.fontSize = '12px';
        satelliteIDCell.appendChild(document.createTextNode(image.Code));
        row.appendChild(satelliteIDCell);

        // Добавление ячеек для Информации, Видимости и Zoom (в этом примере без действующих элементов)
        let infoCell = document.createElement('td');
        row.appendChild(infoCell);

        let visibilityCell = document.createElement('td');
        let visibilityIcon = document.createElement('i');
        if (image.IsVisibleOnMap) {
            visibilityIcon.className = 'fas fa-eye'; // Иконка для видимого состояния
        } else {
            visibilityIcon.className = 'fas fa-eye-slash'; // Иконка для невидимого состояния
        }
        visibilityCell.appendChild(visibilityIcon);
        row.appendChild(visibilityCell);

        visibilityIcon.addEventListener('click', () => {
            image.IsVisibleOnMap = !image.IsVisibleOnMap; // Изменение значения
            
            visibilityIcon.className = image.IsVisibleOnMap ? 'fas fa-eye' : 'fas fa-eye-slash'; // Изменение иконки
        });




        let zoomCell = document.createElement('td');
        row.appendChild(zoomCell);

        tableBody.appendChild(row);
    });
}

export { fillTableWithSatelliteImages };
