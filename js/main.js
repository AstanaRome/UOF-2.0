import { createFootprintGroup, createQuicklookGroup, initMap, oneFootprint, oneQucklook, removeFromFootprintGroupLayer, removeFromQuicklookGroupLayer, removeLayerFromMap, removeOneLayerFromMap, zoomToImage } from "./map.js";
import { inputSatelliteId, openInfoBox } from "./buttonEvents.js";
import { imageDataArray, searchOneImage } from "./service/catalogService.js";
export const map = initMap();
const inputFirstLineNum = document.getElementById('inputFirstLineNum');
const inputLineMax = document.getElementById('inputLineCount');
const inputCntLineAfterFirst = document.getElementById('inputCntLineAfterFirst');
const kmlLayerGroup = L.layerGroup().addTo(map);
const btnDownloadCover = document.getElementById('btnDownloadCover');
const copyButton = document.getElementById('copyButton');

btnDownloadCover.addEventListener('click', donwloadCover);
copyButton.addEventListener('click', copyText);


inputFirstLineNum.addEventListener('click', function () {
    const enteredValue = inputFirstLineNum.value;
    firstLine(enteredValue);
});

inputCntLineAfterFirst.addEventListener('click', function () {
    const enteredValue = inputCntLineAfterFirst.value;
    // Здесь можно выполнить любые действия с введенным значением
    endLine(enteredValue);
});

function copyText() {
    var tempInput = document.createElement('input');
    tempInput.value = inputSatelliteId.value + '\t' + inputFirstLineNum.value + '\t' + inputCntLineAfterFirst.value;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');

    var notification = document.createElement('div'); 
    notification.style.backgroundColor = 'grey';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.zIndex = '9999';
    notification.style.borderRadius = '5px';
    if(tempInput.value.trim()){
        notification.textContent = 'The image parameters have been copied to the clipboard';    
} else{
    notification.textContent = 'The search field is empty';
}
    // Добавляем элемент на страницу
    document.body.appendChild(notification);

    // Через 3 секунды удаляем уведомление
    setTimeout(function() {
        document.body.removeChild(notification);
    }, 1000);
       
        document.body.removeChild(tempInput);
}


// Инициализация карты и экспорт для использования в других модулях

function donwloadCover(){
    const inputStartDate = document.getElementById('startDate').value;
    const inputEndDate = document.getElementById('endDate').value;
    let kmlData = `<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
            <Document>
                <Folder>
                    <name>${"Quicklook from " + inputStartDate + " to " + inputEndDate}</name>`;
    
    for (let i = 0; i < imageDataArray.length; i++) {
        const imageData = imageDataArray[i];
        if (imageData.IsChecked == true) {
            const coords = imageData.getCoordinates();
            const coordsReversed = [coords[0], coords[3], coords[2], coords[1], coords[0]];
            
            kmlData += `
                <Folder><name>${imageData.Code}</name>
                    <Placemark>
                        <name>${imageData.Code}</name>
                        <description>Incidence Angle: ${imageData.IncidenceAngle}, Satellite: ${imageData.Satellite}, Date: ${imageData.Meta_Date}</description>
                        <Polygon>
                            <outerBoundaryIs>
                                <LinearRing>
                                    <coordinates>
                                        ${coords.map(coord => `${coord[1]},${coord[0]},0`).join('\n')}
                                    </coordinates>
                                </LinearRing>
                            </outerBoundaryIs>
                        </Polygon>
                    </Placemark>            
                    <GroundOverlay>
                        <name>${imageData.Code}</name>
                        <Icon>
                            <href>${imageData.Quicklook}</href>
                        </Icon>
                        <gx:LatLonQuad xmlns:gx="http://www.google.com/kml/ext/2.2">
                            <coordinates>
                                ${coordsReversed.map(coord => `${coord[1]},${coord[0]},0`).join('\n')}
                            </coordinates>
                        </gx:LatLonQuad>
                    </GroundOverlay>
                </Folder>`;
        }
    }
    
    kmlData += `</Folder></Document></kml>`;
    
    // Создание и скачивание KML файла
    const blob = new Blob([kmlData], { type: 'text/xml' });
    saveAs(blob, `Quicklook from ${inputStartDate} to ${inputEndDate}.kml`);
}




function addInfoButtonToRow(row, image) {
    let infoCell = document.createElement('td');
    let infoButton = document.createElement('button');
    infoButton.className = 'info-button'; // Класс для стилизации кнопки, если необходимо
    infoButton.innerHTML = '<i class="fas fa-info-circle"></i>'; // Использование иконки информации FontAwesome
    infoButton.style.cursor = 'pointer';

    // Обработчик события нажатия на кнопку
    infoButton.addEventListener('click', () => {
        // const rows = document.querySelectorAll('tr.highlighted'); // Получаем все строки с классом подсветки
        // rows.forEach(row => {
        //     row.classList.remove('highlighted'); // Удаляем класс подсветки
        //     // row.style.backgroundColor = ''; // Если были применены стили, то их можно убрать
        // });

        openInfoBox(image);
       // row.classList.add('highlighted'); // Добавляем класс подсветки к текущей строке
    });

    infoCell.appendChild(infoButton);
    row.appendChild(infoCell);
}





function createCheckboxCell(image) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'slaveCheckbox'; // Задаем класс
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
    const diameter = 50;
    let img = document.createElement('img');
    img.src = image.Quicklook;
    img.style.width = diameter + 'px';
    img.style.height = diameter + 'px';
    // img.style.clipPath = 'circle(' + diameter / 2 + 'px at center)'; // Обрезаем изображение до круга без сохранения пропорций
    let quicklookCell = document.createElement('td');
    quicklookCell.appendChild(img);
    return quicklookCell;
}



function createTextCell(image, fontSize = '16px') {
    let cell = document.createElement('td');
    cell.style.fontSize = fontSize;
    cell.appendChild(document.createTextNode(image.Code));

    // Создание обработчика события mouseover
    cell.addEventListener('mouseover', () => hoverAction(image));

    // Создание обработчика события mouseout
    cell.addEventListener('mouseout', () => hoverOutAction(image));

    // Добавление обработчика события клика
    cell.addEventListener('click', () => {
        zoomToImage(image);
    });
    cell.addEventListener('dblclick', () => {
       clickAction(image)
    });
   // cell.addEventListener('click', () => clickAction(image));

    return cell;
}



function createVisibilityCell(image) {
    let visibilityIcon = document.createElement('i');
    visibilityIcon.className = image.IsVisibleOnMap ? 'fas fa-eye' : 'fas fa-eye-slash';
    visibilityIcon.setAttribute('data-code', image.Code); // Добавляем атрибут data-code, чтобы связать иконку с конкретным объектом
   
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
            removeFromQuicklookGroupLayer(image.Code + ".ql")
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
        zoomToImage(image);
    });

    let zoomCell = document.createElement('td');
    zoomCell.appendChild(zoomIcon);
    return zoomCell;
}









function fillTableWithSatelliteImages(images) {
    document.getElementById('itemCheck1').checked = false;
    const inputStartDate = document.getElementById('startDate').value;
    const inputEndDate = document.getElementById('endDate').value;
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Очистка содержимого tbody
    document.getElementById('imagesTable').innerText = `For the period from ${inputStartDate} to ${inputEndDate}, ${images.length} images were found.`;
    images.forEach(image => {
        let row = document.createElement('tr');
        row.setAttribute('id', `row-${image.Code}`);

        
        row.appendChild(createQuicklookCell(image));
        row.appendChild(createTextCell(image));
        addInfoButtonToRow(row, image); 
        row.appendChild(createCheckboxCell(image));
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


function clickAction(image) {
    searchOneImage(image.Code);
    inputSatelliteId.value = image.Code;
}



document.getElementById('itemCheck1').addEventListener('change', function() {
    var isChecked = this.checked;
    // Теперь выбираем чекбоксы только с классом 'slaveCheckbox'
    var checkboxes = document.querySelectorAll('input[type="checkbox"].slaveCheckbox');

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = isChecked;
        // Триггерим событие 'change' для каждого чекбокса
        checkbox.dispatchEvent(new Event('change'));
    });
});



document.getElementById('btnCheckedVisibleFootrpints').addEventListener('click', function() {
    // Получаем все строки таблицы
    const rows = document.getElementById('dataTable').querySelectorAll('tbody tr');

    // Проходимся по каждой строке
    rows.forEach(row => {
        // Находим иконку видимости в строке
        const visibilityIcon = row.querySelector('.fa-eye');
        // Находим чекбокс в строке
        const checkbox = row.querySelector('input[type="checkbox"].slaveCheckbox');

        // Если иконка видимости есть и чекбокс найден
        if (visibilityIcon && checkbox) {
            // Отмечаем чекбокс
            checkbox.checked = true;
            // Триггерим событие 'change' для чекбокса, если нужно обработать это событие
            checkbox.dispatchEvent(new Event('change'));
        }
    });
});




document.getElementById('btnClear').addEventListener('click', function() {
    // Очищаем значения указанных полей ввода
    document.getElementById('inputSatelliteId').value = '';
    document.getElementById('inputFirstLineNum').value = '';
    document.getElementById('inputCntLineAfterFirst').value = '';
    document.getElementById('inputLineCount').value = '';
    
    removeOneLayerFromMap(oneFootprint);
    removeOneLayerFromMap(oneQucklook);
    

});

export { fillTableWithSatelliteImages, inputFirstLineNum, inputLineMax, inputCntLineAfterFirst, kmlLayerGroup, clickAction };
