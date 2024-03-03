

export default class SatelliteImage {
    constructor(data) {
        this.Code = data.Code || null;
        this.Coordinates = data.Coordinates || null;
        this.East = data.East || null;
        this.Meta_Date = data.Meta_Date || null;
        this.Metadata_Date = data.Metadata_Date || null;
        this.North = data.North || null;
        this.Quicklook = data.Quicklook || null;
        this.Satellite = data.Satellite || null;
        this.South = data.South || null;
        this.West = data.West || null;
        // Добавьте другие свойства при необходимости
    }

    getCoordinatesForFootprint() {
        if (this.Coordinates) {
            const numberArray = this.Coordinates.split(' ').map(coord => parseFloat(coord));
            const bottomLeft = L.latLng(numberArray[0], numberArray[1]);
            const topLeft = L.latLng(numberArray[2], numberArray[3]);
            const topRight = L.latLng(numberArray[4], numberArray[5]);
            const bottomRight = L.latLng(numberArray[6], numberArray[7]);
            return { bottomLeft, topLeft, topRight, bottomRight };
        }
        return null;
    }
    getCoordinates() {
        if (this.Coordinates) {
            const numberArray = this.Coordinates.split(' ').map(coord => parseFloat(coord));
            const bottomLeft = [numberArray[0], numberArray[1]];
            const topLeft = [numberArray[2], numberArray[3]];
            const topRight = [numberArray[4], numberArray[5]];
            const bottomRight = [numberArray[6], numberArray[7]];
            return { bottomLeft, topLeft, topRight, bottomRight };
        }
        return null;
    }
}

// Пример использования:
const imageData = {
    Code: "KM0057d3MI_004_MUL",
    Coordinates: "44.96550853721932 62.67852643118834 45.65726835791579 62.435944997674156 45.82249226661688 63.4131937670143 45.129538559933124 63.64413573774084",
    East: "63.64413573774084",
    Meta_Date: "2024-02-28",
    Metadata_Date: "2024-02-28",
    North: "45.82249226661688",
    Quicklook: "https://eo.gharysh.kz/quicklooks/KM0057d3MI_004_MUL_QL.jpeg",
    Satellite: "KazEOSat-2",
    South: "44.96550853721932",
    West: "62.435944997674156",
};

//const satelliteImage = new SatelliteImage(imageData);
//console.log(satelliteImage.getCoordinates());