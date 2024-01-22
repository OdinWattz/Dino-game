
var board
var boardWidth = 750
var boardHeight = 281   
var context



var fishWidth = 84
var fishWidthHitbox = 10
var fishHeight = 94
var fishHeightHitbox = 10
var fishX = 50
var fishY = boardHeight - fishHeight
var fishImg

var fish = {
    x: fishX,
    y: fishY,
    width: fishWidth,
    height: fishHeight
}

var cactusArray = []

var cactus1Width = 54
var cactus2Width = 87
var cactus3Width = 110

var cactusHeight = 59
var cactusX = 850
var cactusY = boardHeight - cactusHeight

var cactus1Img
var cactus2Img
var cactus3Img

var velocityX = -5
var velocityY = 0
var gravity = .39

var gameOver = false
var score = 0

var speedUpTimer = 0

window.onload = function() {
    board = document.getElementById("board")
    board.height = boardHeight
    board.width = boardWidth

    context = board.getContext("2d")

    board.style.backgroundImage = "url('./img/foregound-merged1.png')";

    fishImg = new Image()
    fishImg.src = "./img/Goldfish-pixelart.gif"
    fishImg.onload = function() {
        context.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height)
    }

    cactus1Img = new Image()
    cactus1Img.src = "./img/Coral red.png"

    cactus2Img = new Image()
    cactus2Img.src = "./img/diver.png"

    cactus3Img = new Image()
    cactus3Img.src = "./img/shark.png"


    requestAnimationFrame(update)
    setInterval(placeCactus, 1000)
    document.addEventListener("keydown", moveFish)

    setInterval(function() {
        speedUpTimer += 1
        if (speedUpTimer % 10 === 0) {
            velocityX -= 0.5
        }
    }, 1000)
}


function update() {
    requestAnimationFrame(update)
    if (gameOver) {
        showGameOverScreen()
        return
    }
    context.clearRect(0, 0, board.width, board.height)

    velocityY += gravity
    fish.y = Math.min(fish.y + velocityY, fishY)
    context.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height)

    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i]
        cactus.x += velocityX
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height)

        if (detectCollision(fish, cactus)) {
            gameOver = true
        }
    }

    context.fillStyle = "black"
    context.font = "20px courier"
    score += 0.5
    context.fillText(score, 5, 20)
}
// if (score >= 100) {
//     gameOver = true
//     context.clearRect(0, 0, board.width, board.height)
//     context.fillStyle = "black"
//     context.font = "40px courier"
//     context.fillText("Game Over", board.width / 2, board.height / 2)
//     context.font = "20px courier"
//     context.fillText("You won!", board.width / 2, board.height / 2 + 30)
// }

function moveFish(e) {
    if (gameOver) {
        return
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && fish.y == fishY) {
        velocityY = -11
    }
}

function placeCactus() {
    if (gameOver) {
        return
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random()

    if (placeCactusChance > .90) {
        cactus.img = cactus3Img
        cactus.width = cactus3Width
        cactusArray.push(cactus)
    }
    else if (placeCactusChance > .70) {
        cactus.img = cactus2Img
        cactus.width = cactus2Width
        cactusArray.push(cactus)
    }
    else if (placeCactusChance > .50) {
        cactus.img = cactus1Img
        cactus.width = cactus1Width
        cactusArray.push(cactus)
    }

    if (cactusArray.length > 5) {
        cactusArray.shift()
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y
}

function showGameOverScreen() {
    context.fillStyle = "transparent"
    context.fillRect(0, 0, board.width, board.height)

    context.fillStyle = "white"
    context.font = "40px courier"
    context.fillText("Game Over", boardWidth / 2 - 100, boardHeight / 2 - 20)

    context.font = "20px courier"
    context.fillText("Press R to restart", boardWidth / 2 - 100, boardHeight / 2 + 20)
    document.addEventListener("keydown", function(e) {
        if (e.key === "r" || e.key === "R") {
            restartGame()
        }
    })
}

var popup = document.createElement("div");
    popup.innerHTML = "Press F11 for full screen";
    popup.style.position = "absolute";
    popup.style.top = "10px";
    popup.style.left = "10px";
    popup.style.padding = "10px";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    popup.style.color = "white";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.fontSize = "16px";
    document.body.appendChild(popup);


function restartGame() {
    gameOver = false
    score = 0
    fish.y = fishY
    velocityY = 0
    velocityX = -5
    cactusArray = []
    document.addEventListener("keydown", function(e) {
        if (e.key === "r" || e.key === "R") {
            restartGame()
        }
    })
}