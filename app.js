
let dia = new Date();
const content = document.querySelector(".content");
const div_data = document.querySelector(".div-data");

const div_destinos = document.querySelector(".div-destinos");
const btn_new = document.querySelector(".new");

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const dias = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
];

function getFormatData() {
  let data_tual = new Date();

  let dia = data_tual.getDate();
  let diaSemana = data_tual.getDay();
  let nameDia = dias[diaSemana];
  let mes = data_tual.getMonth();
  let nameMes = meses[mes];
  let ano = data_tual.getFullYear();

  return { dia, nameDia, diaSemana, mes, nameMes, ano };
}

function newcodigo() {
  if (localStorage.getItem("codigo") === null) {
    localStorage.setItem("codigo", "0");
  }

  let result = 1 + Number(localStorage.getItem("codigo"));

  localStorage.setItem("codigo", `${result}`);

  return `${result}`;
}

let opemDay = () => {
  if (localStorage.getItem("banco") === null) {
    localStorage.setItem("banco", "[]");
  }
};

opemDay();
newcodigo();

function dbLoad() {
  return JSON.parse(localStorage.getItem("banco"));
}

function dbSave(data) {
  localStorage.setItem("banco", JSON.stringify(data));
}

function getPeriodicData() {
  // RETORNA UM ARREI DE TAREFAS PARA CADA PERIODO (DIA ,SEMANA E MES)

  let data = getFormatData();

  let dados_hj = filterCorridas(data.dia, data.nameMes, data.ano);
  let dados_Semanal = filterCorridas(
    data.dia,
    data.nameMes,
    data.ano,
    data.diaSemana === 0 ? 6 : data.diaSemana
  );
  let dados_Mensal = filterCorridas(data.dia, data.nameMes, data.ano, data.dia);

  return { dados_hj, dados_Semanal, dados_Mensal };
}

function diarias(parametro = [{}]) {
  //RECEBE UM ARREY DE OBJETOS CORRIDAS
  // O VALOR A QUANTIDADE DE DIAS TRABALHADOS MULTIPLICADO POR 3  

    
    return (
        parametro.filter((item, index, arr) =>
        !index ? true : item.dia != arr[index - 1].dia)
        .length * 40
    );
    
}

function atualizeDados(
  { dados_hj, dados_Semanal, dados_Mensal } = getPeriodicData()
) {
  hj_corridas = `${dados_hj.length} Corridas`;
  hj_valor = `${calculoValor(dados_hj)},00 R$`;
  semana_corridas = `${dados_Semanal.length} Corridas`;
  semana_valor = `${calculoValor(dados_Semanal)},00 R$`;
  mes_corridas = `${dados_Mensal.length} Corridas`;
  mes_valor = `${calculoValor(dados_Mensal)},00 R$`;

  let dia = { corridas: hj_corridas, valor: hj_valor };
  let semana = { corridas: semana_corridas, valor: semana_valor };
  let mes = { corridas: mes_corridas, valor: mes_valor };

  return { dia, semana, mes };
}
//div_data.innerHTML = `${dia.getDate()}-${meses[dia.getMonth()]}-${dia.getFullYear()}`

function renderAbaDestinos() {
  const aba_destinos = document.querySelector("#aba-destinos");

  aba_destinos.style.transform = "translateY(0%)";
}

function addDestino(destino) {
  let dia = new Date();
  let data = getFormatData();

  if ("destino" === destino.target.classList.value) {
    let obj = {
      destino: `${destino.target.innerText}`,
      valor: `${destino.target.dataset.valor}`,
      dia: `${data.dia}`,
      mes: `${data.nameMes}`,
      ano: `${data.ano}`,
      hora: ` ${dia.getHours()}:${dia.getMinutes()}`,
      id: newcodigo(),
    };

    let banco = dbLoad();
    banco.push(obj);
    dbSave(banco);

    let dado = filterCorridas(data.dia, data.nameMes, data.ano);
    let dado_html = corridaToHtml(dado);

    renderCorridas(dado_html, document.querySelector(".entregas"));
  }
  if ("btn-exit-destinos" === destino.target.classList.value) {
    const aba_destinos = document.querySelector("#aba-destinos");

    aba_destinos.style.transform = "translateY(100%)";
  }
}

let teste = document.querySelector("#sitio");

let createCorrida = ({ destino, valor, dia, mes, ano, hora, id }) => {
  let corrida = `
    <div class="entrega" data-destino="${destino}" data-valor="${valor}"
    data-dia="${dia}" data-mes="${mes}" data-ano="${ano}" data-id="${id}"
    >
    <div class="content-entrega">
    ${destino} - ${hora}
    </div>
    <div class="excluir" id="1">Excluir</div>
    </div>
    `;

  const div_entregas = (document.querySelector(".entregas").innerHTML +=
    corrida);
};

function corridaToHtml(arre) {
  let dado = arre.map(
    (item) =>
      `<div class="entrega" data-destino="${item.destino}" 
        data-valor="${item.valor}"data-dia="${item.dia}" 
        data-mes="${item.mes}" data-ano="${item.ano}" 
        data-id="${item.id}"
    >
        <div class="content-entrega" data-id="${item.id}">
            ${item.destino} - ${item.hora}
        </div>
        <div class="excluir" id="${item.id}" data-id="${item.id}">Excluir</div>
    </div>`
  );

  return dado.join("");
}

function filterCorridas(dia, nameMes, ano, prazo = 0) {
  let db = dbLoad();
  data = getFormatData();

  let dado = [];

  if (prazo === 0) {
    return db.filter(
      (corrida) =>
        corrida.ano === `${ano}` &&
        corrida.mes === `${nameMes}` &&
        corrida.dia === `${dia}`
    );
  } else {
    for (let i = 0; i <= prazo; i++) {
      let getdia = dia - i;

      newdia = new Date(ano, data.mes, getdia);

      let tratarDados = db.filter(
        (corrida) =>
          corrida.ano === `${newdia.getFullYear()}` &&
          corrida.mes === `${meses[newdia.getMonth()]}` &&
          corrida.dia === `${newdia.getDate()}`
      );

      tratarDados.forEach((element) => {
        dado.push(element);
      });
    }

    return dado;
  }
}

function calculoValor(lista) {
  return lista.reduce(
    (acumulator, valorAtual) => acumulator + parseInt(valorAtual.valor),
    0
  );
}

function renderData() {
  let nome_dia = document.querySelector(".name-dia");
  let complete_data = document.querySelector(".complete-data");

  let data = getFormatData();

  nome_dia.innerHTML = `${data.nameDia}`;

  let data_completa = `${("0" + data.dia).slice(-2)} - ${data.nameMes} - ${
    data.ano
  }`;

  complete_data.innerHTML = data_completa;
}

function conteDestinos(arr) {
    // RECEBE UM ARREY DE OBJETOS CORRIDAS
    //RETORNA UM ARREY COM A QUANTIDAE DE CORRIDAS POR DESTINO

  return [
    `Sitio: ${
      arr.filter((item) => item.destino === "Sitio do Gama").length
    }`,
    `T-Ville: ${
      arr.filter((item) => item.destino === "Total Ville").length
    }`,
    `Norte: ${
      arr.filter((item) => item.destino === "Sta Norte").length
    }`,
    //`Norte I: ${
    //  arr.filter((item) => item.destino === "Norte Ifood").length
    //}`,
    `Sul: ${arr.filter((item) => item.destino === "Sta Sul").length}`,
    //`Sul+: ${
    //  arr.filter((item) => item.destino === "Sta Sul+").length
    //}`,
  ];
}

function renderInicio() {
  
    dadosCorridas = atualizeDados();

    (document.querySelector(".corridas-hj").innerText = dadosCorridas.dia.corridas);
    (document.querySelector(".saldo-hj").innerText = dadosCorridas.dia.valor);
    (document.querySelector(".total-hj").innerText = `Total: ${calculoValor(getPeriodicData().dados_hj) + diarias(getPeriodicData.dados_hj)},00 R$`);
    (document.querySelector("#corridas-semana").innerText = dadosCorridas.semana.corridas);
    (document.querySelector("#saldo-semana").innerText = dadosCorridas.semana.valor);
    (document.querySelector(".total-semana").innerText = `Total: ${ calculoValor(getPeriodicData().dados_Semanal) + diarias(getPeriodicData().dados_Semanal)},00 R$`);
    (document.querySelector("#corridas-mes").innerText = dadosCorridas.mes.corridas);
    (document.querySelector("#saldo-mes").innerText = dadosCorridas.mes.valor);
    (document.querySelector(".total-mes").innerText = `Total: ${calculoValor(getPeriodicData().dados_Mensal) + diarias(getPeriodicData().dados_Mensal)},00 R$`);

  renderData();
    (document.querySelector('#card-mes-destinos').innerHTML
     = conteDestinos(getPeriodicData().dados_Mensal)
     .map(item => `<div class="info-card-destinos">${item}</div>`).join(''))
}

function renderCorridas(lista, elemento) {
  elemento.innerHTML = lista;
  renderCorridasHj()
}

function renderHoje() {
  renderData();
  let data = getFormatData();
  let dia = data.dia;
  let diaSemana = data.diaSemana;
  let nameMes = data.nameMes;
  let ano = data.ano;

  let dado = filterCorridas(dia, nameMes, ano);
  let dado_html = corridaToHtml(dado);

  renderCorridas(dado_html, document.querySelector(".entregas"));
  renderCorridasHj()
}

function ativeBtnExcluir(elemento) {
  if (
    elemento.target.classList != "entrega" &&
    elemento.target.classList != "content-entrega" &&
    elemento.target.classList != "excluir"
  ) {
    return;
  }

  let todos = document.querySelectorAll(".excluir");
  todos.forEach((item) => (item.style.transform = "translateX(100%)"));

  setTimeout(() => {
    let id = elemento.target.dataset.id;
    document.getElementById(`${id}`).style.transform = "translateX(100%)";
  }, 4000);

  if (elemento.target.classList != "excluir") {
    let id = elemento.target.dataset.id;
    document.getElementById(`${id}`).style.transform = "translateX(0%)";

    return;
  }

  let dado = dbLoad();

  let confirma = window.prompt('Digite "SIM" se deseja excluir');

  if (confirma.toUpperCase() === "SIM") {
    let novo_dado = dado.filter(
      (item) => item.id != elemento.target.dataset.id
    );

    dbSave(novo_dado);
    renderHoje();
  }
}

function renderCorridasHj(){
  
    (document.querySelector('#corridas-hj-hj').innerText = `${atualizeDados().dia.corridas} | ${atualizeDados().dia.valor}`)

}

function consulta(dia, mes, ano, periodo = 0) {
  let banco = dbLoad();

  filterCorridas(dia, mes, ano, periodo);
}



console.log(addMilissegundos)
