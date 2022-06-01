let order = [];
let clickedOrder = [];
let score = 0;
let nivelAtual = 0;
let recorde = 0;
let lose = false;

var audioWin = document.getElementById("somCerto");
var audioLose = document.getElementById("somErro");

//0 - verde
//1 - vermelho
//2 - amarelo
//3 - azul

const blue = document.querySelector('.blue');
const red = document.querySelector('.red');
const green = document.querySelector('.green');
const yellow = document.querySelector('.yellow');

//cria ordem aletoria de cores
let shuffleOrder = () => {
    let colorOrder = Math.floor(Math.random() * 4);
    order[order.length] = colorOrder;
    clickedOrder = [];

    for(let i in order) {
        let elementColor = createColorElement(order[i]);
        lightColor(elementColor, Number(i) + 1);
    }
}

//acende a proxima cor
let lightColor = (element, number) => {
    number = number * 500;
    setTimeout(() => {
        element.classList.add('selected');
    }, number - 50);
    setTimeout(() => {
        element.classList.remove('selected');
    }, number + 400);
}

//checa se os botoes clicados são os mesmos da ordem gerada no jogo
let checkOrder = () => {
    for(let i in clickedOrder) {
        if(clickedOrder[i] != order[i]) {
            lose = true;
            gameOver();
            break;
        }
    }
    if(clickedOrder.length == order.length && lose == false) {
        setTimeout(() => {
            nextLevel();
        }, 1500);
    }
}

//funcao para o clique do usuario
let click = (color) => {
    clickedOrder[clickedOrder.length] = color;

    setTimeout(() => {
    createColorElement(color).classList.add('selected');
    
    },-50);

    setTimeout(() => {
        createColorElement(color).classList.remove('selected');
        checkOrder();
    },350);
}

//funcao que retorna a cor
let createColorElement = (color) => {
    if(color == 0) {
        return green;
    } else if(color == 1) {
        return red;
    } else if (color == 2) {
        return yellow;
    } else if (color == 3) {
        return blue;
    }
}

//funcao para proximo nivel do jogo
let nextLevel = () => {
    score++;
    audioWin.play();
    document.querySelector('#nvplacar').innerHTML = `<p>Placar: ${score}</p>`;

    setTimeout(() => {
    shuffleOrder();
    },1000);
}

//funcao para game over
let gameOver = () => {

    setTimeout(() => {
    audioLose.play();
    },-200);

    setTimeout(() => {
    alert(`Pontuação: ${score}\nVocê perdeu o jogo!`);
    },700);
    
    order = [];
    clickedOrder = [];

    document.querySelector('#novoJogo').innerHTML = 'Novo Jogo';
    if (score > recorde){
        recorde = score;
        document.querySelector('#nvrecorde').innerHTML = `<p>Recorde: ${recorde}</p>`;
    }
}

//funcao de inicio do jogo
let playGame = () => {
    document.querySelector('#nvplacar').innerHTML = `<p>Placar: 0</p>`;
    document.querySelector('#novoJogo').innerHTML = '';
    lose = false
    score = 0;
    shuffleOrder();
}

//eventos de clique para as cores
green.onclick = () => click(0);
red.onclick = () => click(1);
yellow.onclick = () => click(2);
blue.onclick = () => click(3);
