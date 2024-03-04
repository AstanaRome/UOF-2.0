import { map } from "./map.js";




function fillTableWithSatelliteImages(images) {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Очистить текущее содержимое tbody

    images.forEach(image => {
        let row = document.createElement('tr');

        let checkCell = document.createElement('td');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = image.IsChecked; // Устанавливаем состояние чекбокса на основе свойства объекта
        console.log(imageData.IsChecked)
        // Установка обработчика событий, если нужно выполнить действие при изменении состояния чекбокса
        checkbox.addEventListener('change', (e) => {
            // Обновляем свойство объекта в соответствии с изменением состояния чекбокса
            imageData.isChecked = e.target.checked;
            console.log(`Checkbox for row is now: ${e.target.checked ? 'checked' : 'unchecked'}`);
        });
        checkCell.appendChild(checkbox);
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
        satelliteIDCell.style.fontSize = '11px';
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
        let zoomIcon = document.createElement('i');
        zoomIcon.className = 'fas fa-search-plus'; // Иконка зума из FontAwesome
        zoomCell.appendChild(zoomIcon);
        row.appendChild(zoomCell);

        zoomIcon.addEventListener('click', () => {
            const splitCoords = image.Coordinates.split(" ").map(Number);
            let sumLat = 0, sumLng = 0;

            for (let i = 0; i < splitCoords.length; i += 2) {
                sumLat += splitCoords[i];
                sumLng += splitCoords[i + 1];
            }

            const centerLat = sumLat / (splitCoords.length / 2);
            const centerLng = sumLng / (splitCoords.length / 2);

            // Использование координат, например, для установки центра карты
            map.setView([centerLat, centerLng], 7);


        });

        tableBody.appendChild(row);
    });
}

export { fillTableWithSatelliteImages };
