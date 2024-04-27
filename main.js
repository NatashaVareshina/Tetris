const playingField = document.getElementById('field__playing')

const score = document.getElementById('score');

const btnPlay = document.getElementById('btn__play')

function getStatistics(ctxScore) {
    ctxScore.fillStyle = 'black'
    ctxScore.fillRect(0, 0, score.width, score.height);  
    ctxScore.fillStyle = 'white';
    ctxScore.font = '25px Courier New';
    ctxScore.fillText(`Level: ${STATISTICS.level}`, 0, 20);
    ctxScore.fillText(`Score: ${STATISTICS.score}`, 200, 20);
}

//Определяем, поддерживает ли браузер canvas: проверяем наличие метода 
//getContext().
if (playingField.getContext) {
    //Присваиваем контекст.
    const ctx = playingField.getContext('2d');

    const ctxScore = score.getContext('2d');

    //Устанавливаем размеры игровго поля.
    playingField.width = COLUMNS_QUANTITY * BLOCK_SIZE;
    playingField.height = ROWS_QUANTITY * BLOCK_SIZE;

    //Устанавливаем масштаб.
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    
    //Нарисуем заполненный прямоугольник.
    ctx.fillRect(0, 0, playingField.width, playingField.height);

    getStatistics(ctxScore)
    
    const gameScreen = new GameScreen(ctx)

    gameScreen.reset()
    
    let gamePiece = new GamePiece(ctx)

    gamePiece.getRandomElement()

    gamePiece.draw()
    
    gameScreen.gamePiece = gamePiece

    let requestId
    
    function runGameCycle(currentTime = 0) {
        //Обновляем количество затраченного времени.
        TIME.spentTime = currentTime - TIME.initialTime

        if (TIME.spentTime > TIME.level) {
            //Начинаем отсчет сначала.
            TIME.initialTime = currentTime;
            
            //Опускаем активную фигуру. При достижении активной фигурой низа 
            //игрового поля, нужно сохранить ее текущее положение.
            if (!gameScreen.drop()) {
                gameScreen.saveFigurePosition()

                gameScreen.deleteLine()
                
                if (STATISTICS.bonus > 0) {
                    STATISTICS.score += POINTS[STATISTICS.bonus]
                    
                    STATISTICS.bonus = 0
                }
                
                if (STATISTICS.rows >= 5) {
                    STATISTICS.level++
                
                    TIME.level = LEVELS[STATISTICS.level]

                    STATISTICS.rows = 0
                }
                
                getStatistics(ctxScore)
                
                //Игра окончена.
                if (gamePiece.startY === 0) {
                    cancelAnimationFrame(requestId);
                    
                    ctx.globalAlpha = 0.8;
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, playingField.width, playingField.height);
                    ctx.globalAlpha = 1.0;
                    ctx.font = '1.5px monospace';
                    ctx.fillStyle = 'white';
                    ctx.fillText('GAME OVER', 1.45, 4);
                    
                    return;
                }
                
                gamePiece = new GamePiece(ctx)

                gamePiece.getRandomElement()

                gameScreen.gamePiece = gamePiece
            }
        }
        
        //Перемещаем фигуру по игровому полю.
        ctx.fillStyle = 'black'

        ctx.fillRect(0, 0, playingField.width, playingField.height);

        gamePiece.draw()
        
        //Отрисовываем уже сохраненные на игровом поле фигуры.
        gameScreen.drawPlayingFieldGrid();
        
        requestId = requestAnimationFrame(runGameCycle)
    }

    runGameCycle()
    
    document.addEventListener('keydown', e => {
        if (gameScreen.checkIsValid(e.key)) {
            //Перемещаем фигуру по игровому полю.
            ctx.fillStyle = 'black'

            ctx.fillRect(0, 0, playingField.width, playingField.height);
            
            gamePiece.move(e.key)
            
            gamePiece.draw()
        }
    });
}