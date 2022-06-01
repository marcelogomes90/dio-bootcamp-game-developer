const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const playStart = document.querySelector('.play-game')
const enemiesImg = ['./img/enemy1.png', './img/enemy2.png', './img/enemy3.png'];
const divScore = document.querySelector('#placar');

let enemyInterval;
let disparo = false;
let divGameOver;
let score = 0;

//função que chama outras funções de movimento e tiro da nave
function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown()
    } else if (event.key === ' ') {
        event.preventDefault();
        if (disparo === false) {
            disparo = true;
            fireLaser();
        }
    }
}

//função de movimento para cima
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === '20px') {
        return;
    } else {
        let position = parseInt(topPosition);
        position -= 20;
        yourShip.style.top = `${position}px`;
    }
}

//função de movimento para baixo
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === '440px') {
        return;
    } else {
        let position = parseInt(topPosition);
        position += 20;
        yourShip.style.top = `${position}px`;
    }
}

//funcoes de tiro
function fireLaser() {
    let laser = creatLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function creatLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/laser.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition - 50}px`;
    newLaser.style.top = `${yPosition - 25}px`
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let enemies = document.querySelectorAll('.enemy');

        enemies.forEach((enemy) => {
            if (checkLaserColision(laser, enemy)) {
                enemy.src = 'img/explosion.png';
                enemy.classList.remove('enemy');
                enemy.classList.add('dead-enemy');
                score++;
                document.getElementById('placar').innerHTML = 'SCORE: ' + score;
                laser.remove();
                disparo = false;
            }
        });

        if (xPosition === 650) {
            laser.remove();
            disparo = false;
        } else {
            laser.style.left = `${xPosition + 10}px`;
        }
    }, 10);
}

//função que cria os inimigos
function createEnemies() {
    let newEnemy = document.createElement('img');
    let enemySprite = enemiesImg[Math.floor(Math.random() * enemiesImg.length)];
    newEnemy.src = enemySprite;
    newEnemy.classList.add('enemy')
    newEnemy.classList.add('enemy-transition');
    newEnemy.style.left = '610px'
    newEnemy.style.top = `${Math.floor(Math.random() * 400 + 30)}px`;
    playArea.appendChild(newEnemy);
    moveEnemy(newEnemy);
}

//funcao para mover os inimigos
function moveEnemy(enemy) {
    let moveEnemiesInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
        if (xPosition <= 0) {
            if(Array.from(enemy.classList).includes('dead-enemy')) {
                enemy.remove();
            } else {
                enemy.remove();
                gameOver();
            }
        } else {
            enemy.style.left = `${xPosition - 10}px`
        }
    }, 35);
}

//funçao para detectar colisões
function checkLaserColision(laser, enemy) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let enemyTop = parseInt(enemy.style.top);
    let enemyLeft = parseInt(enemy.style.left);
    let enemyBottom = enemyTop - 50;
    if(laserLeft != 650 && laserLeft + 60 >= enemyLeft) {
        if(laserTop <= enemyTop && laserTop >= enemyBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//função que inicia o jogo
function playGame() {
    playStart.remove();
    document.getElementById('placar').innerHTML = 'SCORE: ' + score;
    playArea.classList.add('paralax');
    yourShip.style.height = `${60}px`;
    yourShip.style.width = `${100}px`;
    createEnemies();

    //Escuta as teclas de movimento e tiro
    window.addEventListener('keydown', flyShip);

    enemyInterval = setInterval(() => {
        createEnemies();
    }, 2700)
}

//função de fim de jogo
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(enemyInterval);
    yourShip.style.height = `${0}`;
    yourShip.style.width = `${0}`;
    playArea.classList.remove('paralax');
    document.getElementById('placar').innerHTML = '';
    divGameOver = document.createElement('div');
    divGameOver.id = 'game-over';
    playArea.appendChild(divGameOver);
    document.getElementById('game-over').innerHTML = '<h2><br>GAME OVER</h2><p><br>Sua pontuação foi ' + score + '!</p><h5 class="button-play" type="button" onclick="playAgain()">RESTART</h5>';
}

//função jogar novamente após o game over
function playAgain() {
    divGameOver.remove();
    score = 0;
    document.getElementById('placar').innerHTML = 'SCORE: ' + score;
    playArea.classList.add('paralax');
    yourShip.style.height = `${60}px`;
    yourShip.style.width = `${100}px`;
    createEnemies();

    //Escuta as teclas de movimento e tiro
    window.addEventListener('keydown', flyShip);

    enemyInterval = setInterval(() => {
        createEnemies();
    }, 2700)
}


