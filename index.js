let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let brickColors = {2: "#DD0000", 1: "#00DD95"};
let bricksDestroyed = 0;
let playerScore = 0;
let playerLives = 3;
let fontColor = "#0095DD";
let paddleColor = "#0095DD";
let ballColor = "#00DD95";

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, lives: 2};
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].lives > 0) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[bricks[c][r].lives];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameOver() {
    alert("GAME OVER!");
    document.location.reload();
    clearInterval(interval);
}

function detectCollisionWithWall() {
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }
    if (ballY + dy < ballRadius) {
        dy = -dy;
    } else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            playerLives--;
            if (!playerLives) {
                gameOver();
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
}

function detectCollisionWithBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.lives > 0) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    dy = -dy;
                    b.lives--;
                    playerScore += b.lives > 0 ? 1 : 5;
                    if (b.lives == 0) bricksDestroyed++;
                    if (bricksDestroyed == brickRowCount * brickColumnCount) {
                        alert("CONGRATULATIONS, YOU WON!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = fontColor;
    ctx.fillText("Score: " + playerScore, 8, 20);
}

function drawPlayerLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = fontColor;
    ctx.fillText("Lives: " + playerLives, canvas.width - 65, 20);
}

function movePaddle() {
    if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
}

function draw() {
    clearCanvas();
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawPlayerLives();
    detectCollisionWithBricks()
    ballX += dx;
    ballY += dy;
    detectCollisionWithWall();
    movePaddle();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

let interval = setInterval(draw, 10);

