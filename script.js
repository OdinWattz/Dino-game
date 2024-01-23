// Dit zorgt voor de maat van het canvas
var board
var boardWidth = 750
var boardHeight = 281   
var context

// Dit zorgt voor de maat van de vis
var fishWidth = 84
var fishWidthHitbox = 10
var fishHeight = 94
var fishHeightHitbox = 10
var fishX = 50
var fishY = boardHeight - fishHeight
var fishImg
// Dit zorgt voor de maat van de vis
var fish = {
    x: fishX,
    y: fishY,
    width: fishWidth,
    height: fishHeight
}

// Ocean was in eerste instantie de cactus maar heb de naam veranderd naar ocean, dus officieel is het gewoon ook een obstakel
var oceanArray = []

// Dit zorgt voor de maat van de obstakels
var coralWidth = 54
var diverWidth = 87
var sharkWidth = 110

var oceanHeight = 59
var oceanX = 850
var oceanY = boardHeight - oceanHeight

var coralImg
var diverImg
var sharkImg

// Dit zorgt voor de Jump van de vis en de gravity
var velocityX = -5
var velocityY = 0
var gravity = .39

var gameOver = false
var score = 0

var speedUpTimer = 0

// Dit zorgt ervoor dat de canvas wordt gemaakt
// Dit zorgt ervoor dat de afbeeldingen worden geladen
// Dit zorgt ervoor dat de obstakels worden geplaatst via de image
window.onload = function() {
    board = document.getElementById("board")
    board.height = boardHeight
    board.width = boardWidth

    context = board.getContext("2d")

    board.style.backgroundImage = "url('./img/foregound-merged1.png')";

    fishImg = new Image()
    fishImg.src = "./img/Goldfish-pixelart.png"
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

    // Dit zorgt ervoor dat de snelheid van de obstakels om de 10 seconden omhoog gaat
    setInterval(function() {
        speedUpTimer += 1
        if (speedUpTimer % 10 === 0) {
            velocityX -= 0.5
        }
    }, 1000)
}


// Dit zorgt ervoor dat de canvas wordt geupdate
// Dit zorgt ervoor dat de vis wordt geupdate
// En dat de collision wordt geupdate
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

    // Dit zorgt ervoor dat de score wordt weergegeven
    context.fillStyle = "black"
    context.font = "20px courier"
    score += 0.5
    context.fillText(score, 5, 20)
}


// Dit zorgt ervoor dat de vis kan springen
function moveFish(e) {
    if (gameOver) {
        return
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && fish.y == fishY) {
        velocityY = -11
    }
}


// Dit zorgt ervoor dat de obstakels worden geplaatst
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

    // Dit zorgt ervoor dat de obstakels random worden geplaatst en hoe groot de kans is dat ze worden geplaatst
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


// Dit zorgt voor de collision
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y
}

// Dit zorgt voor de Game Over Screen
// Hoe het er uitziet en wat er staat
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


// Dit zorgt ervoor dat je het spel kan herstarten
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