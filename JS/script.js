// DADOS DOS CANDIDATOS
const candidatos = {
  // Candidatos a Presidente
  "11": {
    nome: "Sócrates",
    partido: "Verdade e Virtude",
    cargo: "Presidente",
    foto: "IMG/socrates.jpeg"
  },
  "21": {
    nome: "Friedrich Nietzsche",
    partido: "Vontade de Potência",
    cargo: "Presidente",
    foto: "IMG/Friedrich Nietzsche.jpg"
  },
  // Candidatos a Governador
  "31": {
    nome: "Clarice Lispector",
    partido: "Literário",
    cargo: "Governador",
    foto: "IMG/Clarice Lispector.jpeg"
  },
  "41": {
    nome: "Fiodor Dostoiévsky",
    partido: "Realismo",
    cargo: "Governador",
    foto: "IMG/Fiodor Dostoievski.jpg"
  }
};

// VARIÁVEIS DE ESTADO E REFERÊNCIAS 
const cargosVotacao = ["Presidente", "Governador"];
let cargoAtualIndex = 0;
let numeroDigitado = "";
let votacaoFinalizada = false;

const digitos = document.querySelectorAll(".digito");
const nome = document.getElementById("nome");
const partido = document.getElementById("partido");
const cargo = document.getElementById("cargo");
const foto = document.getElementById("foto");
const botoesNumericos = document.querySelectorAll(".numero");
const btCorrige = document.querySelector(".corrige");
const btBranco = document.querySelector(".branco");
const btConfirma = document.querySelector(".confirma");
const btProximo = document.getElementById("proximo");
const btFinalizar = document.getElementById("finalizar");
const btProximoFinalizar = document.getElementById("btProximoFinalizar");
const telaResultados = document.getElementById("telaResultados");
const resultadosConteudo = document.getElementById("resultadosConteudo");

const contagemVotos = {
  Presidente: { validos: {}, brancos: 0, nulos: 0 },
  Governador: { validos: {}, brancos: 0, nulos: 0 }
};

// FUNÇÕES PRINCIPAIS 

function iniciarVotacao() {
  cargoAtualIndex = 0;
  numeroDigitado = "";
  votacaoFinalizada = false;
  btProximoFinalizar.style.display = "none";
  telaResultados.style.display = "none";
  document.querySelector(".urna").style.display = "flex";
  atualizarTela();
}

function atualizarTela() {
  const cargoAtual = cargosVotacao[cargoAtualIndex];
  cargo.textContent = `${cargoAtual.toUpperCase()}`;

  // Limpa os campos
  nome.textContent = "Nome: ";
  partido.textContent = "Partido: ";
  foto.style.display = 'none';
  foto.src = "";

  // Reseta os dígitos na tela
  digitos.forEach((d) => {
    d.textContent = "0";
  });
}

function atualizaInfoCandidato(numero) {
  const candidato = candidatos[numero];
  const cargoAtual = cargosVotacao[cargoAtualIndex];

  if (candidato && candidato.cargo === cargoAtual) {
    nome.textContent = `Nome: ${candidato.nome}`;
    partido.textContent = `Partido: ${candidato.partido}`;
    foto.style.display = 'block';
    foto.src = candidato.foto;
  } else {
    nome.textContent = "Voto Nulo";
    partido.textContent = "";
    foto.style.display = 'none';
  }
}

function registrarVoto() {
  const cargoAtual = cargosVotacao[cargoAtualIndex];

  if (numeroDigitado === "") {
    // Voto em branco
    contagemVotos[cargoAtual].brancos++;
    console.log(`Voto em branco para ${cargoAtual} registrado.`);
  } else {
    const candidato = candidatos[numeroDigitado];
    if (candidato && candidato.cargo === cargoAtual) {
      // Voto válido
      if (!contagemVotos[cargoAtual].validos[numeroDigitado]) {
        contagemVotos[cargoAtual].validos[numeroDigitado] = 0;
      }
      contagemVotos[cargoAtual].validos[numeroDigitado]++;
      console.log(`Voto para ${candidato.nome} (${numeroDigitado}) registrado.`);
    } else {
      // Voto nulo
      contagemVotos[cargoAtual].nulos++;
      console.log(`Voto nulo para ${cargoAtual} registrado.`);
    }
  }

  numeroDigitado = "";
  proximoCargo();
}
// ATUALIZAR A VOTAÇÃO PARA PROXÍMO CARGO
function proximoCargo() {
  cargoAtualIndex++;

  if (cargoAtualIndex < cargosVotacao.length) {
    atualizarTela();
  } else {
    // Todos os cargos foram votados, mostrar botões
    btProximoFinalizar.style.display = "flex";
  }
}

function exibirResultados() {
  document.querySelector(".urna").style.display = "none";
  btProximoFinalizar.style.display = "none";
  telaResultados.style.display = "block";

  let htmlResultados = "";

  // Processar resultados para cada cargo
  cargosVotacao.forEach(cargo => {
    htmlResultados += `<div class="resultados-cargo">`;
    htmlResultados += `<h2>${cargo}</h2>`;

    // Encontrar o vencedor
    let votosValidos = 0;
    let maiorVotos = 0;
    let vencedor = null;

    // Contar votos válidos
    for (const numero in contagemVotos[cargo].validos) {
      votosValidos += contagemVotos[cargo].validos[numero];
      if (contagemVotos[cargo].validos[numero] > maiorVotos) {
        maiorVotos = contagemVotos[cargo].validos[numero];
        vencedor = numero;
      }
    }

    // Exibir candidatos e seus votos
    for (const numero in contagemVotos[cargo].validos) {
      const candidato = candidatos[numero];
      const classeVencedor = numero === vencedor ? "vencedor" : "";
      htmlResultados += `<div class="candidato-resultado ${classeVencedor}">`;
      htmlResultados += `<span>${candidato.nome} (${numero}) - ${candidato.partido}</span>`;
      htmlResultados += `<span>${contagemVotos[cargo].validos[numero]} voto(s)</span>`;
      htmlResultados += `</div>`;
    }

    // Exibir votos brancos e nulos
    htmlResultados += `<div class="candidato-resultado">`;
    htmlResultados += `<span>Votos em Branco</span>`;
    htmlResultados += `<span>${contagemVotos[cargo].brancos} voto(s)</span>`;
    htmlResultados += `</div>`;

    htmlResultados += `<div class="candidato-resultado">`;
    htmlResultados += `<span>Votos Nulos</span>`;
    htmlResultados += `<span>${contagemVotos[cargo].nulos} voto(s)</span>`;
    htmlResultados += `</div>`;

    // Exibir total de votos
    const totalVotos = votosValidos + contagemVotos[cargo].brancos + contagemVotos[cargo].nulos;
    htmlResultados += `<div class="total-votos">Total de votos: ${totalVotos}</div>`;

    // Exibir vencedor
    if (vencedor) {
      htmlResultados += `<div class="vencedor">Vencedor: ${candidatos[vencedor].nome} - ${candidatos[vencedor].partido}</div>`;
    }

    htmlResultados += `</div>`;
  });

  resultadosConteudo.innerHTML = htmlResultados;
}

// Botões numéricos
botoesNumericos.forEach(botao => {
  botao.addEventListener("click", () => {
    if (numeroDigitado.length < 2) {
      numeroDigitado += botao.dataset.valor;
      digitos[numeroDigitado.length - 1].textContent = botao.dataset.valor;

      if (numeroDigitado.length === 2) {
        atualizaInfoCandidato(numeroDigitado);
      }
    }
  });
});

// Botão CORRIGE
btCorrige.addEventListener("click", () => {
  numeroDigitado = "";
  atualizarTela();
});

// Botão BRANCO
btBranco.addEventListener("click", () => {
  if (numeroDigitado.length === 0) {
    nome.textContent = "Voto em Branco";
    partido.textContent = "";
    foto.style.display = 'none';
  } else {
    alert("Para votar em branco, o campo de número deve estar vazio.");
  }
});

// Botão CONFIRMA
btConfirma.addEventListener("click", () => {
  if (numeroDigitado.length === 2) {
    registrarVoto();
  } else if (numeroDigitado.length === 0 && nome.textContent === "Voto em Branco") {
    // Voto em branco é confirmado
    registrarVoto();
  } else {
    // Voto nulo por número incompleto
    alert("Número incompleto. Registrando voto nulo.");
    numeroDigitado = "";
    registrarVoto();
  }
});

// Botão PRÓXIMO VOTO
btProximo.addEventListener("click", () => {
  // Inicia nova votação
  iniciarVotacao();
});

// Botão FINALIZAR
btFinalizar.addEventListener("click", () => {
  exibirResultados();
});

// 
window.onload = iniciarVotacao;
