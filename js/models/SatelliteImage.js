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
        this.IncidenceAngle = data.IncidenceAngle|| null;
        this.West = data.West || null;
        this.IsChecked = data.IsChecked || false;
        this.IsVisibleOnMap = data.IsVisibleOnMap || false;
        this.Lines = null;
          if (data.Code.startsWith('DS_')) {
              this.calculateLines(data.Quicklook)
                  .then(lines => {
                      this.Lines = lines;                      
                  })
                  .catch(error => {
                      console.error('Ошибка при вычислении lines:', error.message);
                  });

          } else {
              this.Lines = null;
          }
        
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

    calculateLines(imageUrl) {
        // Возвращает Promise, который разрешается значением maxLine
        return getImageSize(imageUrl)
            .then(size => {
                let maxLine = Math.round(size.height / (size.width / 125) * 5 - 5);
                if (maxLine % 5 !== 0) {
                    if (maxLine % 5 >= 6) {
                        maxLine -= maxLine % 5 - 10;
                    } else if (maxLine % 5 < 6 && maxLine % 5 > 1) {
                        maxLine -= maxLine % 5 - 5;
                    } else {
                        maxLine -= maxLine % 5;
                    }
                }
                return maxLine;
            })
            .catch(error => {
                console.error('Ошибка при получении размера изображения:', error.message);
                throw error; // Пробрасываем ошибку дальше, чтобы её можно было обработать
            });
    }
}

function getImageSize(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            const width = img.width;
            const height = img.height;
            resolve({ width, height });
        };
        img.onerror = function () {
            reject(new Error('Не удалось загрузить изображение'));
        };
        img.src = url;
    });
}
