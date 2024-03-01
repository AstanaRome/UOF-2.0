import { searchCatalog } from "./catalogService.js";
import SearchOption  from "./SearchOption.js"



document.querySelector('.header-button').addEventListener('click', function() {
    // Здесь можно вызвать вашу функцию или выполнить нужные действия при нажатии на кнопку    
    // console.log('Кнопка "Upload KML" нажата');
    // const options = new SearchOption();
    // searchCatalog(options);
    document.getElementById('fileInput').click();


});

document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result;
            // Здесь можно использовать leaflet-omnivore для загрузки файла напрямую,
            // если он поддерживает формат файла без предварительного чтения содержимого.
            omnivore.kml.parse(content).addTo(map);
        };
        reader.readAsText(file);
    }
});

