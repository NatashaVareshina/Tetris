//Игровое поле.
class GameScreen {
  constructor(ctx) {
    this.ctx = ctx
    this.playingFieldGrid = null
    this.gamePiece = null
  }
  
  reset() {
    this.playingFieldGrid = this.getEmptyPlayingField();
  }
    
  getEmptyPlayingField() {
    return Array.from(
      {length: ROWS_QUANTITY}, () => Array(COLUMNS_QUANTITY).fill(0)
    );
  }

  //Для автоматического опускания фигуры.
  drop() {
    if (this.checkIsValid('ArrowDown')) {
      this.gamePiece.move('ArrowDown');
      
      return true
    }
    
    return false
  }

  //Для проверки допустимости перемещения фигуры.
  checkIsValid(key) {
    switch (key) {
      case 'ArrowUp':
      case '8':
        return this.gamePiece.moves[key]()
          .every((row, indexY) => row
            .every((value, indexX) => value === 0 
              || (this.gamePiece.startX + indexX + 1 <= COLUMNS_QUANTITY 
                && this.gamePiece.startY + indexY + 1 <= ROWS_QUANTITY 
                && this.playingFieldGrid[this.gamePiece.startY 
                  + indexY][this.gamePiece.startX + indexX] === 0)
            )
          )
      //Проверяем, можно ли переместить фигуру вправо.
      case 'ArrowRight':
      case '6':
        //Метод массива .every() позволяет узнать, удовлетворяют ли все 
        //элементы в массиве условию в функции-колбэке. Результатом 
        //вызова метода .every() будет boolean-значение true или false. 
        //Если хотя бы один элемент не будет удовлетворять условию, то 
        //результат будет false.
        return this.gamePiece.randomGamePiece
          .every((row, indexY) => row
            .every((value, indexX) => value === 0 
              || (this.gamePiece.startX + indexX + 2 <= COLUMNS_QUANTITY 
                && this.playingFieldGrid[this.gamePiece.startY + indexY][
                  this.gamePiece.startX + indexX + 1
                ] === 0)
            )
          );
      case 'ArrowDown':
      case '2':
        return this.gamePiece.randomGamePiece
          .every((row, indexY) => row
            .every((value, indexX) => value === 0 
              || (this.gamePiece.startY + indexY + 2 <= ROWS_QUANTITY 
                && this.playingFieldGrid[this.gamePiece.startY + indexY 
                  + 1][this.gamePiece.startX + indexX] === 0
              )
            )
          );
      //Проверяем, можно ли переместить фигуру влево.
      case 'ArrowLeft':
      case '4':
        return this.gamePiece.randomGamePiece
          .every((row, indexY) => row
            .every((value, indexX) => value === 0 
              || (this.gamePiece.startX + indexX - 1 >= 0 
                && this.playingFieldGrid[this.gamePiece.startY + indexY][
                  this.gamePiece.startX + indexX - 1
                ] === 0)
            )
          );
      default:
        break;
    }
}

//Для сохранения положения на игровом поле акивной фигры.
saveFigurePosition() {
    this.gamePiece.randomGamePiece.forEach((row, indexY) => {
      row.forEach((value, indexX) => {
        if (value > 0) {
          this.playingFieldGrid[indexY + this.gamePiece.startY][indexX + this.gamePiece.startX] = value;
        }
      });
    });
  }

  //Для удаления заполненного ряда игровго поля.
  deleteLine() {
    this.playingFieldGrid.forEach((row, indexY) => {
      if (row.every(value => value > 0)) {
        //Если все ячейки в ряду заполнены, удаляем его.
        this.playingFieldGrid.splice(indexY, 1);
        
        //Добавляем наверх поля новый пустой ряд клеток.
        this.playingFieldGrid.unshift(Array(COLUMNS_QUANTITY).fill(0));

        STATISTICS.rows++

        STATISTICS.bonus++
      }
    });
  }

  //Для отрисовки уже сохраненных на игровом поле фигур.
  drawPlayingFieldGrid() {
    this.playingFieldGrid.forEach((row, indexY) => {
      row.forEach((value, indexX) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value - 1];

          this.ctx.fillRect(indexX, indexY, 0.95, 0.95);
        }
      })
    })
  }
}