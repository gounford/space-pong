// Variáveis para as raquetes, bola e barras horizontais
let raqueteJogador, raqueteComputador, bola, barraSuperior, barraInferior;
let fundoImg, bolaImg, barra1Img, barra2Img;
let bounceSound, golSound;

let placarJogador = 0;
let placarComputador = 0;

let jogoIniciado = false;
let botaoInicio;

let telaInicialImg;

let coresTexto = ["#3498db","#3498db","#3498db","#3498db", "#f1c40f", "#f1c40f", "#f1c40f","#f1c40f", "#2ecc71", "#2ecc71", "#2ecc71", "#2ecc71", "#e74c3c", "#e74c3c", "#e74c3c","#e74c3c", "#A76E3C", "#A76E3C", "#A76E3C", "#A76E3C", "#9b59b6", "#9b59b6", "#9b59b6", "#9b59b6"];
let corAtual = 0;
let bordaTexto = 0.5; // Largura da borda preta



function preload() {
  fundoImg = loadImage('fundo1.png');
  bolaImg = loadImage('bola.png');
  barra1Img = loadImage('barra01.png');
  barra2Img = loadImage('barra02.png');
  bounceSound = loadSound('446100__justinvoke__bounce.wav');
  golSound = loadSound('274178__littlerobotsoundfactory__jingle_win_synth_02.wav');
  telaInicialImg = loadImage('fundo2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  raqueteJogador = new Raquete(30, height / 2, 10, 60);
  raqueteComputador = new Raquete(width - 40, height / 2, 10, 60);
  bola = new Bola(10);
  barraSuperior = new Barra(0, 0, width, 5);
  barraInferior = new Barra(0, height, width, 5);

  botaoInicio = createButton('Iniciar Jogo');
  botaoInicio.position(width / 2 - 60, height / 2 + 50);
  botaoInicio.mousePressed(iniciarJogo);
}

function drawPlacar() {
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text(`${placarComputador} - ${placarJogador}`, width / 2, 50);
}

function draw() {
  let escala = Math.max(width / fundoImg.width, height / fundoImg.height);
  let imgWidth = fundoImg.width * escala;
  let imgHeight = fundoImg.height * escala;
  let imgX = (width - imgWidth) / 2;
  let imgY = (height - imgHeight) / 2;
  image(fundoImg, imgX, imgY, imgWidth, imgHeight);

  if (!jogoIniciado) {
    exibirTelaInicial();
  } else {
    raqueteJogador.atualizar();
    raqueteComputador.atualizar();
    bola.atualizar(barraSuperior, barraInferior);
    bola.verificarColisaoRaquete(raqueteJogador);
    bola.verificarColisaoRaquete(raqueteComputador);

    raqueteJogador.exibir();
    raqueteComputador.exibir();
    bola.exibir();
    barraSuperior.exibir();
    barraInferior.exibir();

    drawPlacar();

    if ((placarJogador >= 3 || placarComputador >= 3) && Math.abs(placarJogador - placarComputador) >= 2) {
      // Adicione um atraso de 5 segundos antes de retornar à tela inicial
      setTimeout(retornarTelaInicial, 5000);
      textSize(getTextSize());
      fill(255);
      textAlign(CENTER, CENTER);
      let vencedor = placarJogador > placarComputador ? "Computador" : "Jogador";
      text(`O ${vencedor} venceu!`, width / 2, height / 2);
      noLoop();

      if (placarJogador >= 3) {
        const mensagemDerrota = `Que pena, o Jogador perdeu!`;
        falarTexto(mensagemDerrota);
      } else {
        if (placarComputador >= 3) {
          const mensagemVitoria = `Parabéns, o Jogador venceu!`;
          falarTexto(mensagemVitoria);
        }
      }
    }
  }
}

// Função para obter o tamanho de texto responsivo
function getTextSize() {
  // Defina um tamanho de texto com base na largura da tela
  return min(width / 15, 64);
}


function exibirTelaInicial() {
  background(255);

  // Desenhe a imagem de background
  image(telaInicialImg, 0, 0, width, height);

  textAlign(CENTER, CENTER);

  // Função para desenhar texto com borda
  function desenharTextoComBorda(texto, x, y, tamanho) {
    textSize(tamanho);

    for (let i = 0; i < 8; i++) {
      fill(0);
      text(texto, x - bordaTexto, y - bordaTexto);
      text(texto, x + bordaTexto, y - bordaTexto);
      text(texto, x + bordaTexto, y + bordaTexto);
      text(texto, x - bordaTexto, y + bordaTexto);
    }

    fill(coresTexto[corAtual]);
    text(texto, x, y);
  }

  // Desenha os textos com bordas e tamanhos diferentes
  desenharTextoComBorda('Space Pong', width / 2, height / 2 - 140, getTextSize());
  desenharTextoComBorda('By Gounford', width / 1.5, height / 2.7, getTextSize() * 0.3);
  desenharTextoComBorda('Inicie o maior desafio de sua vida!', width / 2, height / 2, getTextSize() * 0.7);

  // Atualiza a cor para a próxima vez que a tela inicial for exibida
  corAtual = (corAtual + 1) % coresTexto.length;
}


function iniciarJogo() {
  jogoIniciado = true;
  botaoInicio.remove();
  loop();
}

function retornarTelaInicial() {
  placarJogador = 0;
  placarComputador = 0;
  jogoIniciado = false;
  setup();
  loop();
}

class Raquete {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  atualizar() {
    if (this === raqueteJogador) {
      this.y = mouseY || touchY; // Usa mouseY se disponível, senão, usa touchY
    } else {
      if (bola.y > this.y + this.h / 2) {
        this.y += 3;
      } else if (bola.y < this.y - this.h / 2) {
        this.y -= 3;
      }
    }
    this.y = constrain(this.y, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
  }

  exibir() {
    let img;
    if (this === raqueteJogador) {
      img = barra1Img;
    } else {
      img = barra2Img;
    }
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    scale(this.h / 400.0);
    image(img, 0, 0, img.width, img.height);
    pop();
  }
}

class Bola {
  constructor(r) {
    this.r = r;
    this.reiniciar();
  }

  aumentarVelocidade() {
    const fatorAumento = 1.2;
    this.velocidadeX *= fatorAumento;
    this.velocidadeY *= fatorAumento;
  }

  reiniciar() {
    this.anguloRotacao = 0;
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-4, -3, 3, 4]);
    this.velocidadeY = random(-3, 3);
  }

  atualizar(barraSuperior, barraInferior) {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

    if (
      this.y - this.r / 2 <= barraSuperior.y + barraSuperior.h ||
      this.y + this.r / 2 >= barraInferior.y - barraInferior.h
    ) {
      this.velocidadeY *= -1;
    }

    if (this.x + this.r / 2 >= width) {
      this.reiniciar();
      tocarSomDeGol();
      placarComputador++;
      narrarPlacar();
    } else if (this.x - this.r / 2 <= 0) {
      raqueteComputador.y = random(height - raqueteComputador.h);
      this.reiniciar();
      tocarSomDeGol();
      placarJogador++;
      narrarPlacar();
    }

    this.anguloRotacao += Math.atan2(this.velocidadeY, this.velocidadeX) / 5;
  }

  verificarColisaoRaquete(raquete) {
    if (
      this.x - this.r / 2 <= raquete.x + raquete.w / 2 &&
      this.x + this.r / 2 >= raquete.x - raquete.w / 2 &&
      this.y + this.r / 2 >= raquete.y - raquete.h / 2 &&
      this.y - this.r / 2 <= raquete.y + raquete.h / 2
    ) {
      this.velocidadeX *= -1;
      let posicaoRelativa = (this.y - raquete.y) / raquete.h;
      let anguloBola = posicaoRelativa * PI / 3 * 2.3;
      this.velocidadeY = this.velocidadeX * Math.tan(anguloBola);
      this.aumentarVelocidade();
      tocarSomColisao();
    }
  }

  exibir() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    scale(2 * this.r / 318);
    rotate(this.anguloRotacao);
    image(bolaImg, 0, 0, bolaImg.width, bolaImg.height);
    pop();
  }
}

class Barra {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  exibir() {
    fill(color("#2B3FD6"));
    rectMode(CENTER);
    rect(this.x + this.w / 2, this.y, this.w, this.h);
  }
}

function tocarSomColisao() {
  bounceSound.play();
}

function tocarSomDeGol() {
  golSound.play();
}

function narrarPlacar() {
  const mensagem = `${placarComputador} a ${placarJogador}`;
  falarTexto(mensagem);
}

function falarTexto(texto) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR';
  synth.speak(utterance);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}