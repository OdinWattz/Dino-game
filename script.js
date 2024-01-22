
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

var oceanArray = []

var coralWidth = 54
var diverWidth = 87
var sharkWidth = 110

var oceanHeight = 59
var oceanX = 850
var oceanY = boardHeight - oceanHeight

var coralImg
var diverImg
var sharkImg

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

    coralImg = new Image()
    coralImg.src = "./img/Coral red.png"

    diverImg = new Image()
    diverImg.src = "./img/diver.png"

    sharkImg = new Image()
    sharkImg.src = "./img/shark.png"


    requestAnimationFrame(update)
    setInterval(placeOcean, 1000)
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

    for (let i = 0; i < oceanArray.length; i++) {
        let ocean = oceanArray[i]
        ocean.x += velocityX
        context.drawImage(ocean.img, ocean.x, ocean.y, ocean.width, ocean.height)

        if (detectCollision(fish, ocean)) {
            gameOver = true
        }
    }

    context.fillStyle = "black"
    context.font = "20px courier"
    score += 0.5
    context.fillText(score, 5, 20)
}


function moveFish(e) {
    if (gameOver) {
        return
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && fish.y == fishY) {
        velocityY = -11
    }
}

function placeOcean() {
    if (gameOver) {
        return
    }

    let ocean = {
        img: null,
        x: oceanX,
        y: oceanY,
        width: null,
        height: oceanHeight
    }

    let placeOceanChance = Math.random()

    if (placeOceanChance > .90) {
        ocean.img = sharkImg
        ocean.width = sharkWidth
        oceanArray.push(ocean)
    }
    else if (placeOceanChance > .70) {
        ocean.img = diverImg
        ocean.width = diverWidth
        oceanArray.push(ocean)
    }
    else if (placeOceanChance > .50) {
        ocean.img = coralImg
        ocean.width = coralWidth
        oceanArray.push(ocean)
    }

    if (oceanArray.length > 5) {
        oceanArray.shift()
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
    popup.style.padding = "10px";
    popup.style.color = "white";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.fontSize = "16px";

function restartGame() {
    gameOver = false
    score = 0
    fish.y = fishY
    velocityY = 0
    velocityX = -5
    oceanArray = []
    document.addEventListener("keydown", function(e) {
        if (e.key === "r" || e.key === "R") {
            restartGame()
        }
    })
}