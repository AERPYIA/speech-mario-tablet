const mario = document.querySelector(".mario"); 
const pipe = document.querySelector(".pipe"); 
const moeda = document.querySelector("#moeda"); 

//voz
const webkitSpeechRecognition = document.querySelector(".speechApi")
const textarea = document.querySelector("#textarea")
const btnGravar = document.querySelector("#btnGravar")
const btnParar = document.querySelector("#btnParar")
const btnGravarmodal = document.querySelector("#btnGravarmodal")
const btnPararmodal = document.querySelector("#btnPararmodal")
const textareamodal = document.querySelector("#textareamodal")
const btnGravargover = document.querySelector("#btnGravargover")
const btnParargover = document.querySelector("#btnParargover")


const btnStart = document.querySelector("#btnStart")
const modal = document.querySelector('#modal');
const modalStart = document.querySelector('#modalStart');
const modalGameOver = document.querySelector('#modalGameOver');
const modalRanking = document.querySelector('#modalRanking');
const btnReiniciar = document.querySelectorAll('#btnReiniciar');
const btnRanking = document.querySelector('#btnRanking');
const cenario = document.querySelector('#cenario');
const pontuacao = document.querySelector('#pontuacao');
const tempo = document.querySelector('#tempo');
const tabelaHTML = document.querySelector('#main-tabela');

let nomeJogador = 'bobalhão';
let cronometro = 0;
let points = 0;



const jump = () => {
  mario.classList.add("jump");
  playSom('somPulo')

  setTimeout(() => {
    mario.classList.remove("jump");
  }, 2500);
};
document.addEventListener('keydown', jump);

const validaJogador = ({ target }) => {

    if (target.value.length > 0) {
        // Habilita o botão
        btnStart.removeAttribute('disabled')

        // Acesso pelo click do mouse. Chama a função que inicia o jogo.
        btnStart.addEventListener('click', comecar);
        // Pega o nome do jogador
        nomeJogador = target.value.trim().toUpperCase();

    } else {
        // Desabilita o botão
        btnStart.setAttribute('disabled', '');
    }
}; 
inputJogador.addEventListener('input', validaJogador);

const limpaTexto = () => {
    inputJogador.value = '';
};

const nomevoz = () =>{
  textareamodal.value = textareamodal.value.replace(/nome/, '')

  inputJogador.value = textareamodal.value.trim()

  nomeJogador = inputJogador.value.trim().toUpperCase();
}
const cleantextaera = (
  setInterval(() => {
    document.getElementById('textareamodal').value = ' '
  }, 1000)
)

const loopDoJogo = setInterval(() => {
  const pipePosition = pipe.offsetLeft; 
  const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", ""); 
  const moedaPosition = +window.getComputedStyle(moeda).bottom.replace("px", ""); 
  pipe.classList.add('desabilitar')
  moeda.classList.add('desabilitar')

  dificuldade()

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition > 80 && moedaPosition <=103){
    moeda.style.bottom = "572px"
    points++
    pontuacao.innerHTML = points

    setTimeout(() => {
      moeda.style.bottom = "102px"
    }, 1000);
  }
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    stopSom('somCenario')
    playSom('somGameover')
    playSom('marioStart')

    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = "none";
    mario.style.bottom = `${marioPosition}px`; 

    mario.src = "./img/game-over.png";
    mario.style.width = "80px";
    mario.style.marginLeft = "50px";

    moeda.style.animation ='none'
    moeda.classList.remove('active')

    clearInterval(loopDoJogo); 
    clearInterval(timer)


    bancoTemp(nomeJogador, points, cronometro)

    modal.classList.remove('desabilitar'); 
    modalGameOver.classList.add('active'); 

  }
});

const dificuldade = () =>{
  if (cronometro <= 15) {
    pipe.style.animation = `pipe-animation 5s infinite linear`;
  } 
  else if (cronometro <= 30 && pipe.offsetLeft <= 0) {
    pipe.style.rigth = '-90px';
    pipe.style.animation = `pipe-animation 4s infinite linear`;
  } 
  else if (cronometro > 31 && pipe.offsetLeft <= 0) {
    pipe.style.rigth = '-90px';
    pipe.style.animation = `pipe-animation 3.5s infinite linear`;
  }
}
const comecar = () => {
  modal.classList.add('desabilitar');
  modalStart.classList.remove('active');
  pipe.classList.add('active')
  moeda.classList.add('active')
  limpaTexto();
  textarea.value = ""

  stopSom('marioStart')
  playSom('somCenario');

  timer = setInterval(() => {
    cronometro++
    
    tempo.innerHTML = cronometro
  }, 1000);
};
const reiniciar = () => {
  location.reload();
};
btnReiniciar.forEach((btn) => {
  btn.addEventListener('click', reiniciar);
});

const ranking = () => {
  modalGameOver.classList.remove('active'); 
  modalRanking.classList.add('active');
  
  tabelaRanking(); 
};
btnRanking.addEventListener('click', ranking);


//banco de dados

const bancoTemp = (nome, pontuacao, tempo) => {

  let banco = getBanco();

  dados = {nomeJogador: nome, points: pontuacao, cronometro: tempo};

  //acrescentando conteudo dentro dele sem apagar o que tem dentro dele
  banco.unshift(dados)

  setBanco(JSON.stringify(banco));
};
//colocar itens dentro do banco
const setBanco = (banco) => {
  localStorage.setItem('bd-mario', banco);
};

const getBanco = () => {
  //retorna oq vem de dentro do bd local convertendo a string em seu formato original
  return JSON.parse(localStorage.getItem('bd-mario')) ?? []; //se não encontrar retorne uma lista vazia)
};



const criarTabela = (posicao, nome, pontuacao, tempo) => {
  const itemHTML = document.createElement('tr');
  itemHTML.classList.add('dados');

  itemHTML.innerHTML = `
      <td class = "posicao-tabela">${posicao}</td>
      <td class = "nome-tabela">${nome}</td>
      <td class = "pontuacao-tabela">${pontuacao}</td>
      <td class = "tempo-tabela">${tempo}</td>
  `
  tabelaHTML.appendChild(itemHTML);
};


const tabelaRanking = () => {
  // Variavel que recebe o banco depois de ser reorganizado na ordem crescente;
  const sorted = getBanco().sort(colocacao).reverse();

  sorted.forEach((item, index) => {
      let posicao = index + 1;
      let nome = item.nomeJogador;
      let pontuacao = item.points;
      let tempo = item.cronometro;


      criarTabela(posicao, nome, pontuacao, tempo);

  });
}


const colocacao = (a, b) => {
  return a.points < b.points
      ? -1
      : a.points > b.points
          ? 1
          : 0;
}



//musica
const playSom = (elemento) => {
  const element = document.querySelector(`#${elemento}`)

  element.play()
}

const stopSom = (elemento) => {
  const element = document.querySelector(`#${elemento}`);

  element.pause();
}
playSom('marioStart')