// Variabelen voor het canvas
let board;
let boardWidth = 750;
let boardHeight = 281;
let context;

// Variabelen voor de vis
let fishWidth = 56;
let fishHeight = 36;
let fishX = 50;
let fishY = boardHeight - fishHeight;
let fishImg;
let fish = {
    x: fishX,
    y: fishY,
    width: fishWidth,
    height: fishHeight
};

// Variabelen voor de obstakels
let oceanArray = [];
let coralWidth = 54;
let diverWidth = 87;
let sharkWidth = 110;
let oceanHeight = 60;
let oceanX = 850;
let oceanY = boardHeight - oceanHeight;
let coralImg;
let diverImg;
let sharkImg;

// Variabelen voor de beweging en gameplay
let velocityX = -5;
let velocityY = 0;
let gravity = 0.39;
let gameOver = false;
let score = 0;
let speedUpTimer = 0;

// Functie om het spel te starten
function startGame() {
    createCanvas();
    loadImages();
    setupEventListeners();
    update();
    setInterval(placeOcean, 1000);
    setInterval(speedUpObstacles, 5000);
}


// Functie om het canvas te maken
function createCanvas() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    board.style.backgroundImage = "url('./img/background.png')";
}

// Functie om afbeeldingen te laden
function loadImages() {
    fishImg = new Image();
    fishImg.src = "./img/Goldfish.png";
    fishImg.onload = function() {
        context.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);
    };

    coralImg = new Image();
    coralImg.src = "./img/Coral red.png";

    diverImg = new Image();
    diverImg.src = "./img/diver.png";

    sharkImg = new Image();
    sharkImg.src = "./img/shark.png";
}

// Functie om event listeners in te stellen
function setupEventListeners() {
    document.addEventListener("keydown", moveFish);
    window.addEventListener("touchstart", handleTouchStart, false);
    window.addEventListener("touchend", handleTouchEnd, false);
}

// Functie om de vis te laten bewegen
function moveFish(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && fish.y == fishY) {
        velocityY = -11;
    }
}

// Functie om touch events te verwerken
function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    let  touchEndY = e.changedTouches[0].clientY;

    if (touchStartY > touchEndY) {
        velocityY = -11;
    }
}

// Functie om het spel te updaten
function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        showGameOverScreen();
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    fish.y = Math.min(fish.y + velocityY, fishY);
    context.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);

    for (let i = 0; i < oceanArray.length; i++) {
        let ocean = oceanArray[i];
        ocean.x += velocityX;
        context.drawImage(ocean.img, ocean.x, ocean.y, ocean.width, ocean.height);

        if (detectCollision(fish, ocean)) {
            gameOver = true;
        }
    }

    context.fillStyle = "black";
    context.font = "20px courier";
    score += 0.5;
    context.fillText(score, 5, 20);
}

// Functie om obstakels te plaatsen
function placeOcean() {
    if (gameOver) {
        return;
    }

    let ocean = {
        img: null,
        x: oceanX,
        y: oceanY,
        width: null,
        height: oceanHeight
    };

    let placeOceanChance = Math.random();

    if (placeOceanChance > 0.90) {
        ocean.img = sharkImg;
        ocean.width = sharkWidth;
        oceanArray.push(ocean);
    } else if (placeOceanChance > 0.70) {
        ocean.img = diverImg;
        ocean.width = diverWidth;
        oceanArray.push(ocean);
    } else if (placeOceanChance > 0.50) {
        ocean.img = coralImg;
        ocean.width = coralWidth;
        oceanArray.push(ocean);
    }

    if (oceanArray.length > 5) {
        oceanArray.shift();
    }
}

// Functie om de obstakels sneller te laten bewegen
function speedUpObstacles() {
    speedUpTimer += 1;
    if (speedUpTimer % 5 === 0) {
        velocityX -= 0.5;
    }
}

// Functie om botsingen te detecteren
function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Functie om het Game Over scherm weer te geven
function showGameOverScreen() {
    context.fillStyle = "transparent";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "white";
    context.font = "40px courier";
    context.fillText("Game Over", boardWidth / 2 - 100, boardHeight / 2 - 20);

    context.font = "20px courier";
    context.fillText(
        "Druk op R om opnieuw te starten",
        boardWidth / 2 - 100,
        boardHeight / 2 + 20
    );

    document.addEventListener("keydown", function(e) {
        if (e.key === "r" || e.key === "R") {
            restartGame();
        }
    });
}

// Functie om het spel te herstarten
function restartGame() {
    gameOver = false;
    score = 0;
    fish.y = fishY;
    velocityY = 0;
    velocityX = -5;
    oceanArray = [];
    document.addEventListener("keydown", function(e) {
        if (e.key === "r" || e.key === "R") {
            restartGame();
        }
    });
}

// Start het spel
startGame();