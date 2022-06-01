const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
const principal = document.querySelector('.principal');
const textPontuacao = document.querySelector('#pontuacao');

let isJumping = false;
let position = 0;
let isGameOver = false;
let pontuacao = 0;
let level = 0;
let velLevel = 20;
let randomMult = 3500;
let keyFrame = 1200;

//função que faz o jogo evoluir de dificuldade, contar a pontuação e mudar o cenário
function levelTime() {

    let intervalLevel = setInterval(function(){
        if (isGameOver == false) {
            pontuacao++;
            keyFrame = keyFrame - 10;
            velLevel = velLevel-0.3;
            randomMult = randomMult - 10;
            document.getElementById("pontuacao").innerHTML = 'Pontuação: ' + pontuacao;
        } else {
            clearInterval(intervalLevel);
        }}, 1000);       
}

//muda o cenário a cada 30 pontos e faz o cenario rolar mais rápido
let mudaCenario1 = setInterval(() => {
    dino.style.background = 'url("./img/dino-invert.png")';
    background.style.background = 'url("./img/background-invert.png")';
    principal.style.background = 'rgb(5, 5, 5)';
    textPontuacao.style.color = 'rgb(214, 214, 214)'
}, 30000);

let mudaCenario2 = setInterval(() => {
    dino.style.background = 'url("./img/dino.png")';
    background.style.background = 'url("./img/background.png")';
    principal.style.background = 'rgb(248, 248, 248)';
    textPontuacao.style.color = 'rgb(83, 83, 83)'
}, 60000)

let rolaBackground = setInterval(() => {
    background.style.animation = 'slideright ' + keyFrame + 's infinite linear';
}, 2000);

//função que pega o mapeamento da tecla espaço para fazer o dino pular
function pressionaEspaco(event) {
    if (event.keyCode === 32) {
        if (!isJumping) {
            jump();
        }
    }
}

//função que faz o dino pular
function jump() {
    isJumping = true

    let upInterval = setInterval(() => {
        if (position >= 170) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 10;
                    dino.style.bottom = position + 'px';
                }
            }, 20)
        } else {
        position += 20; 
        dino.style.bottom = position + 'px';
        }
    }, 20);
}

//função para criar os cactos aleatoriamente e verificar se choca com o dino
function createCactus() {
    const cactus = document.createElement('div');
    let cactusPosition = 1300;
    let randomTime = (Math.random() + 0.2) * randomMult;
    console.log(randomTime);

    if (isGameOver) return;

    cactus.classList.add('cactus');
    background.appendChild(cactus);
    cactus.style.left = cactusPosition + 'px';

    let leftInterval = setInterval(() => {
        if (cactusPosition < -60) {
            clearInterval(leftInterval);
            background.removeChild(cactus);
        } else if (cactusPosition > 0 && cactusPosition < 60 && position < 60) {
            clearInterval(leftInterval);
            clearInterval(mudaCenario1);
            clearInterval(mudaCenario2);
            clearInterval(rolaBackground);
            isGameOver = true;
            document.body.innerHTML = '<div><h1 class="game-over">Game Over</h1><h3>Sua pontuação foi: ' + pontuacao + '</h3><input type="button" value="Reiniciar" id="reinicia" onClick="document.location.reload(true)"></input></div>';
        } else {
            cactusPosition -= 5;
            cactus.style.left = cactusPosition + 'px';
        }
    }, velLevel)

    setTimeout(createCactus, randomTime);
}

//chama as funções de level e criar cactus e inicia o jogo
function play() {
    let removeInicia = document.getElementById("inicia");
    removeInicia.parentNode.removeChild(removeInicia);
    createCactus();
    levelTime();
}

//mapeia a tecla espaço para fazer o dino pular
document.addEventListener('keydown', pressionaEspaco);
