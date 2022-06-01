//Função para iniciar o jogo

function start() {

    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='inimigo2' class=''></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Principais variáveis do jogo

    var podeAtirar = true;
    var jogo = {};
    var fimdejogo = false;
    var pontos = 0
    var salvos = 0
    var perdidos = 0
    var energiaAtual = 3;
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 300);
    var TECLA = {
        UP: 38,
        DOWN: 40,
        SPACE: 32
    }

    jogo.pressionou = [];

    //Variáveis dos sons

     var somDisparo=document.getElementById("somDisparo");
     var somExplosao=document.getElementById("somExplosao");
     var musica=document.getElementById("musica");
     var somGameover=document.getElementById("somGameover");
     var somPerdido=document.getElementById("somPerdido");
     var somResgate=document.getElementById("somResgate");

    // Música de Fundo em Loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    //Verifica se o usário pressionou alguma tecla

    $(document).keydown(function(e) {
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e) {
        jogo.pressionou[e.which] = false;
    });

    //Game loop

    jogo.timer = setInterval(loop,30);

    function loop() {
        movefundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
    }

    //Função que movimenta o fundo do jogo

    function movefundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda-1);
    }

    //Função que movimenta o jogador

    function moveJogador() {

        if (jogo.pressionou[TECLA.UP]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo-10)

            if (topo<=10) {
                $("#jogador").css("top", topo+10)
            }
        }

        if (jogo.pressionou[TECLA.DOWN]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo+10)

            if (topo>=400) {
                $("#jogador").css("top", topo-10)
            }
        }

        if (jogo.pressionou[TECLA.SPACE]) {

            //Chama Função disparo
            disparo();
        }

    }

    //Funções que movem os inimigos e amigo

    function moveInimigo1() {

        posicaoX = parseInt($('#inimigo1').css("left"));
        $("#inimigo1").css("left", posicaoX-velocidade);
        $("#inimigo1").css("top", posicaoY);

            if (posicaoX<=0) {
                posicaoY = parseInt(Math.random() * 300);
                $("#inimigo1").css("left", 634);
                $("#inimigo1").css("top", posicaoY);
            }

        }

        function moveInimigo2() {
        posicaoX = parseInt($('#inimigo2').css("left"));
        $("#inimigo2").css("left", posicaoX-3);

        if (posicaoX<=25) {
            $("#inimigo2").css("left", 760);
        }

    }

    function moveAmigo() {
        posicaoX = parseInt($('#amigo').css("left"));
        $("#amigo").css("left", posicaoX+1);

        if (posicaoX>=870) {
            $("#amigo").css("left", 15);
        }
    
    }

    //Funções de disparo e tempo de disparo

    function disparo() {

        if (podeAtirar == true) {

            somDisparo.play();
            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            tempoDisparo = window.setInterval (executaDisparo, 20);

        }
    }

    function executaDisparo() {
        posicaoX = parseInt($("#disparo").css("left"));
        $("#disparo").css("left", posicaoX + 15);

        if (posicaoX>860) {
            window.clearInterval(tempoDisparo);
            tempoDisparo=null;
            $("#disparo").remove();
            podeAtirar = true;
        }
    }

    //Funções de colisões

    function colisao() {

        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        // Jogador com inimigo 1

        if (colisao1.length>0) {

            energiaAtual--;
            somExplosao.play();
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 300);
            $("#inimigo1").css("left", 634);
            $("#inimigo1").css("top", posicaoY);
        }

        // Jogador com inimigo 2

        if (colisao2.length>0) {

            energiaAtual--;
            somExplosao.play();
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            
            $("#inimigo2").remove();

            reposicionaInimigo2();
        }

        // Disparo com o Inimigo 1
        
        if (colisao3.length>0) {	

            velocidade = velocidade + 0.1;
            pontos = pontos + 100;
            somExplosao.play();
            
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));  
            explosao1(inimigo1X,inimigo1Y);
            
            $("#disparo").css("left", 900);
                
            posicaoY = parseInt(Math.random() * 300);

            $("#inimigo1").css("left", 634);
            $("#inimigo1").css("top", posicaoY);
        }

        // Disparo com o Inimigo 2

        if (colisao4.length>0) {

            velocidade = velocidade + 0.1;
            pontos = pontos + 50;
            somExplosao.play();
            
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            
            $("#inimigo2").remove();
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            
            reposicionaInimigo2();
        }

        // Jogador com o Amigo

        if (colisao5.length > 0) {
        
            velocidade = velocidade + 0.1;
            salvos++;
            somResgate.play();
            
            reposicionaAmigo();
            $("#amigo").remove();

        }

        // Inimigo 2 com o Amigo

        if (colisao6.length > 0) {

            perdidos++;
            somPerdido.play();

            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            
            explosao3(amigoX, amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();            
        }
    }


    //Explosão1

    function explosao1(inimigo1X, inimigo1Y) {

        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(img/explosao.png)");

        var div=$("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }

    }

    // Explosão2

    function explosao2(inimigo2X, inimigo2Y) {
        
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(img/explosao.png)");
    
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
    
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
    
        function removeExplosao2() 
        {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    // Reposiciona Inimigo 2

    function reposicionaInimigo2() {
        
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);
            
        function reposiciona4() {
            
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
                
            if (fimdejogo == false) {

                $("#fundoGame").append("<div id=inimigo2></div");

            }      
        }	
    }

    // Função reposiciona Amigo

    function reposicionaAmigo() {
        
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
        
            if (fimdejogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }
    
    // Explosão 3
    
    function explosao3(amigoX, amigoY) {

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
            
        function resetaExplosao3() {

            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;   
        }    
    }

    // Função placar

    function placar() {

        $("#placar").html("<h2> Pontos: " + pontos + " - Salvos: " + salvos + " - Perdidos: " + perdidos + "</h2>");
    
    }

     // Energia

     function energia() {
         
        if (energiaAtual == 3) {
             $("#energia").css("background-image", "url(img/energia3.png)");
        }
 
         if (energiaAtual == 2) {
             $("#energia").css("background-image", "url(img/energia2.png)");
        }
 
        if (energiaAtual == 1) {    
             $("#energia").css("background-image", "url(img/energia1.png)");
        }
 
         if (energiaAtual == 0) {    
             $("#energia").css("background-image", "url(img/energia0.png)");   
             // Game Over
             gameOver()
        }
    }

    function gameOver() {

        fimdejogo = true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><h3>Pontuação: " + pontos + "</h3>" + 
        "<h3>Jogar Novamente</h3></div>" + "<button onclick=reiniciaJogo() type=button><img src=img/start.png width=120px height=40px></button>");
    }
    
}

function reiniciaJogo() {
    
    somGameover.pause();
    $("#fim").remove();
    $("#placar").remove();
    start();
} 
