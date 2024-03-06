import { createFootprintGroup, createQuicklookGroup, map, removeFromFootprintGroupLayer, removeFromQuicklookGroupLayer } from "./map.js";

function createModal() {
    // Создаем контейнер модального окна
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';

    // Создаем контент модального окна
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);

    // Создаем элемент для изображения Quicklook
    const modalImage = document.createElement('img');
    modalImage.id = 'modalImage';
    modalContent.appendChild(modalImage);

    // Создаем кнопку закрытия модального окна
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };
    modalContent.appendChild(closeButton);

    document.body.appendChild(modal);

}

// Вызываем функцию создания модального окна при загрузке страницы
window.onload = createModal;


function addInfoButtonToRow(row, image) {
    let infoCell = document.createElement('td');
    let infoButton = document.createElement('button');
    infoButton.className = 'info-button'; // Класс для стилизации кнопки, если необходимо
    infoButton.innerHTML = '<i class="fas fa-info-circle"></i>'; // Использование иконки информации FontAwesome
    infoButton.style.cursor = 'pointer';

    // Обработчик события нажатия на кнопку
    infoButton.addEventListener('click', () => {
        const modal = document.getElementById('myModal');
        const modalImg = document.getElementById('modalImage');
        modalImg.src = image.Quicklook; // Устанавливаем источник изображения в модальном окне
        modal.style.display = 'block'; // Показываем модальное окно
    });

    infoCell.appendChild(infoButton);
    row.appendChild(infoCell);
}


function createCheckboxCell(image) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = image.IsChecked;

    checkbox.addEventListener('change', (e) => {
        image.IsChecked = e.target.checked;
        if (image.IsChecked) {
            createFootprintGroup([image]);
        } else {
            removeFromFootprintGroupLayer(image.Code);
        }
    });

    let checkCell = document.createElement('td');
    checkCell.appendChild(checkbox);
    return checkCell;
}

function createQuicklookCell(image) {
    let img = document.createElement('img');
    img.src = image.Quicklook;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    let quicklookCell = document.createElement('td');
    quicklookCell.appendChild(img);
    return quicklookCell;
}

function createTextCell(image, fontSize = '11px') {
    let cell = document.createElement('td');
    cell.style.fontSize = fontSize;
    cell.appendChild(document.createTextNode(image.Code));

    // Создание обработчика события mouseover
    cell.addEventListener('mouseover', () => hoverAction(image));

    // Создание обработчика события mouseout
    cell.addEventListener('mouseout', () => hoverOutAction(image));

    return cell;
}

function createVisibilityCell(image) {
    let visibilityIcon = document.createElement('i');
    visibilityIcon.className = image.IsVisibleOnMap ? 'fas fa-eye' : 'fas fa-eye-slash';
    visibilityIcon.style.cursor = 'pointer';

    visibilityIcon.addEventListener('click', () => {
        image.IsVisibleOnMap = !image.IsVisibleOnMap;
        visibilityIcon.className = image.IsVisibleOnMap ? 'fas fa-eye' : 'fas fa-eye-slash';
        if (visibilityIcon.className === 'fas fa-eye') {
            // Если иконка показывает открытый глаз, выполняем одну функцию
            // Например, показываем объект на карте
            createQuicklookGroup([image])
        } else {
            // Иначе, если иконка показывает закрытый глаз, выполняем другую функцию
            // Например, скрываем объект на карте
            removeFromQuicklookGroupLayer(image.Code)
        }
    });

    let visibilityCell = document.createElement('td');
    visibilityCell.appendChild(visibilityIcon);
    return visibilityCell;
}

function createZoomCell(image) {
    let zoomIcon = document.createElement('i');
    zoomIcon.className = 'fas fa-search-plus';
    zoomIcon.style.cursor = 'pointer';

    zoomIcon.addEventListener('click', () => {
        const splitCoords = image.Coordinates.split(" ").map(Number);
        let sumLat = 0, sumLng = 0;

        for (let i = 0; i < splitCoords.length; i += 2) {
            sumLat += splitCoords[i];
            sumLng += splitCoords[i + 1];
        }

        const centerLat = sumLat / (splitCoords.length / 2);
        const centerLng = sumLng / (splitCoords.length / 2);
        const marker = L.marker([centerLat, centerLng]).addTo(map);
        // Можно также добавить всплывающее окно для маркера
        marker.bindPopup(image.Code).openPopup();
        // Использование координат, например, для установки центра карты
        map.setView([centerLat, centerLng], 7);
        // Логика зума
    });

    let zoomCell = document.createElement('td');
    zoomCell.appendChild(zoomIcon);
    return zoomCell;
}









function fillTableWithSatelliteImages(images) {
    
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Очистка содержимого tbody

    images.forEach(image => {
        let row = document.createElement('tr');
        row.setAttribute('id', `row-${image.Code}`);

        row.appendChild(createCheckboxCell(image));
        row.appendChild(createQuicklookCell(image));
        row.appendChild(createTextCell(image));
        addInfoButtonToRow(row, image); 
        row.appendChild(createVisibilityCell(image));
        row.appendChild(createZoomCell(image));

        tableBody.appendChild(row);
    });
}

function hoverAction(image) {
    // Проверяем, установлен ли флажок в чекбоксе
    if (image.IsChecked) {
        return; // Не выполняем никаких действий
    }

    // В противном случае вызываем функцию создания следа
    createFootprintGroup([image]);
}

function hoverOutAction(image) {
    // Проверяем, установлен ли флажок в чекбоксе
    if (image.IsChecked) {
        return; // Не выполняем никаких действий
    }

    // В противном случае вызываем функцию удаления следа
    removeFromFootprintGroupLayer(image.Code);
}


export { fillTableWithSatelliteImages };
