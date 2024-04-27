class GamePiece {
    constructor(ctx) {
        this.ctx = ctx
        this.randomGamePiece = null
        this.color = null
        this.startX = 3
        this.startY = 0
    }

    getRandomElement() {
        //Функция Math.random() генерирует случайное число от 0 (включительно) 
        //до 1 (не включая 1). Это число можно умножить на длину массива, чтобы 
        //получить случайный индекс в диапазоне от 0 до длины массива (не включая 
        //последний элемент).
        //Функция Math.floor() округляет число до ближайшего меньшего целого, что 
        //позволяет преобразовать полученное число в индекс массива.
        //Полученный случайный индекс можно использовать его для выбора случайного 
        //элемента из массива.
        const randomIndexForGamePiece = Math.floor(Math.random() * GAME_PIECE_SET.length);

        //Получаем фигуру.
        this.randomGamePiece = GAME_PIECE_SET[randomIndexForGamePiece]

        const randomIndexForColor = Math.floor(Math.random() * COLORS.length);

        //Получем цвет.
        this.color = COLORS[randomIndexForColor]
        
        //Сохряняем увеличенный на единицу индекс, по которому можно будет 
        //определить, с каким цветом отрисовывать уже сохраненную на игровом 
        //поле фигуру.
        this.randomGamePiece.map((row, indexY) => row.map((value, indexX) => {
            //Чтобы не возникало путаницы из-за того, что индекс может иметь 
            //нулевое значение, randomIndexForColor нужно увеличить на единицу, 
            //поскольку пустые ячейки игрового поля заполнены 0.
            if (value > 0) this.randomGamePiece[indexY][indexX] = randomIndexForColor + 1
        }))
    }

    draw() {
        //Задаем цвет отрисовываемой фигуры.
        this.ctx.fillStyle = this.color;
        
        //Отрисовываем фигуру на игровом поле.
        this.randomGamePiece.forEach((row, indexY) => {
            row.forEach((value, indexX) => {
                if (value > 0) {
                    this.ctx.fillRect(
                        this.startX + indexX, 
                        this.startY + indexY, 
                        0.95, 
                        0.95
                    )
                }
            });
        });
    }

    //Для перемещения фигуры по игровому полю.
    moves = { 
        'ArrowUp': () => this.updatedShapeCoordinates = this.randomGamePiece
            .map((row, i) => row
            .map((value, j) => this.randomGamePiece[this.randomGamePiece.length - 1 - j][i])
        ), 
        '8': () => this.updatedShapeCoordinates = this.randomGamePiece
            .map((row, i) => row
            .map((value, j) => this.randomGamePiece[this.randomGamePiece.length - 1 - j][i])
        ), 
        'ArrowRight': () => this.startX += 1, 
        '6': () => this.startX += 1, 
        'ArrowDown': () => this.startY += 1, 
        '2': () => this.startY += 1, 
        ' ': () => this.startY += 1, 
        'ArrowLeft': () => this.startX -= 1, 
        '4':  () => this.startX -= 1, 
    }
    
    move(key) {
        if (key === 'ArrowUp' || key === '8') {
            this.randomGamePiece = this.updatedShapeCoordinates
            
            return
        }
        
        this.moves[key]()
    }
}