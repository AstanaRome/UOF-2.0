

function endLine(enteredValue){
    if (isNaN(enteredValue)) { // Проверяем, является ли введенное значение числом
        // Если введенное значение не является числом, сбрасываем поле ввода
        inputEndLine.value = '';
    } else if (enteredValue < 1) {
        // Если введенное значение превышает максимальное, устанавливаем максимальное значение
        inputEndLine.value = 1;
    } else if (enteredValue > maxLine) {
        inputEndLine.value = maxLine
    }
    var value = inputEndLine.value;
    labelRes.textContent = "Numbers of lines: " + (inputEndLine.value - inputFirstLine.value + 1).toString();

    var diffDistance = value * LineToKm;

    newCoordBottomLeft = calculateCoordinates(topleftFootprint.lat, topleftFootprint.lng, bottomleftFootprint.lat, bottomleftFootprint.lng, diffDistance);


    if (newCoordTopLeft == undefined) {
        createFootprint(topleftFootprint, toprightFootprint, newCoordBottomLeft);
    } else {
        removeEmptyLayer(footprint)
        createFootprint(newCoordTopLeft, newCoordTopRight, newCoordBottomLeft);
    }
}

function firstLine(enteredValue){
    if (isNaN(enteredValue)) {
        inputFirstLine.value = '';
    } else if (enteredValue > maxLine) {
        // Если введенное значение превышает максимальное, устанавливаем максимальное значение
        inputFirstLine.value = maxLine;
    } else if (enteredValue < 1) {
        // Если введенное значение превышает максимальное, устанавливаем максимальное значение
        inputFirstLine.value = 1;
    }
    else if (enteredValue > (inputEndLine.value - 623)) {
        // Если введенное значение превышает максимальное, устанавливаем максимальное значение
        inputFirstLine.value = inputEndLine.value - 623;
    }
    var valueFirstLine = inputFirstLine.value;
    labelRes.textContent = "Numbers of lines: " +  (inputEndLine.value - inputFirstLine.value + 1).toString();




    var diffDistance = valueFirstLine * LineToKm;
    newCoordTopLeft = calculateCoordinates(topleftFootprint.lat, topleftFootprint.lng, bottomleftFootprint.lat, bottomleftFootprint.lng, diffDistance);
    newCoordTopRight = calculateCoordinates(toprightFootprint.lat, toprightFootprint.lng, bottomrightFootprint.lat, bottomrightFootprint.lng, diffDistance);







    if (newCoordBottomLeft == undefined) {
        createFootprint(newCoordTopLeft, newCoordTopRight, bottomleftFootprint);
    } else {
        removeEmptyLayer(footprint)
        createFootprint(newCoordTopLeft, newCoordTopRight, newCoordBottomLeft);
    }
}

function calculateCoordinates(startLat, startLng, endLat, endLng, distance) {
    // Преобразование градусов в радианы
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    // Радиус Земли в километрах
    const earthRadius = 6371;

    // Преобразование координат в радианы
    const lat1 = toRadians(startLat);
    const lng1 = toRadians(startLng);
    const lat2 = toRadians(endLat);
    const lng2 = toRadians(endLng);

    // Вычисление разницы координат
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    // Вычисление синуса половинного расстояния между точками
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    // Вычисление угла между точками
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Вычисление расстояния между точками
    const totalDistance = earthRadius * c;

    // Вычисление доли пройденного расстояния
    const fraction = distance / totalDistance;

    // Вычисление промежуточных координат
    const intermediateLat = startLat + (endLat - startLat) * fraction;
    const intermediateLng = startLng + (endLng - startLng) * fraction;

    // Возвращение промежуточных координат
    return [intermediateLat, intermediateLng];
}





