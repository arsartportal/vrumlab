import { app } from "./firebase.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  increment
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/* ====================================================== */
/* FIREBASE                                               */
/* ====================================================== */

const db = getFirestore(app);

/* ====================================================== */
/* ELEMENTOS DA PÁGINA                                    */
/* ====================================================== */

const selects = [
  document.getElementById("moto1"),
  document.getElementById("moto2"),
  document.getElementById("moto3"),
  document.getElementById("moto4"),
  document.getElementById("moto5")
];

const botaoComparar = document.getElementById("compararBtn");
const resultado = document.getElementById("resultadoComparacao");

const totalMotosEl = document.getElementById("totalMotos");
const totalComparacoesEl = document.getElementById("totalComparacoes");

/* ====================================================== */
/* LISTA DE MOTOS                                         */
/* ====================================================== */

let motos = [];

/* ====================================================== */
/* CARREGA TODAS AS MOTOS DO FIRESTORE                    */
/* ====================================================== */

async function carregarMotos() {
  try {
    const snapshot = await getDocs(collection(db, "motos"));

    motos = snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    }));

    /* Ordena alfabeticamente */
    motos.sort((a, b) => {
      const nomeA = `${a.marca} ${a.modelo} ${a.ano}`;
      const nomeB = `${b.marca} ${b.modelo} ${b.ano}`;

      return nomeA.localeCompare(nomeB);
    });

    /* Preenche todos os selects */
    selects.forEach(select => {
      select.innerHTML = `<option value="">Escolha uma moto</option>`;

      motos.forEach(moto => {
        select.innerHTML += `
          <option value="${moto.id}">
            ${moto.marca} ${moto.modelo} ${moto.ano}
          </option>
        `;
      });
    });

  } catch (erro) {
    console.error("Erro ao carregar motos:", erro);

    resultado.innerHTML = `
      <div class="aviso-box">
        Não foi possível carregar as motos do banco de dados.
      </div>
    `;
  }
}

/* ====================================================== */
/* CARREGA ESTATÍSTICAS                                   */
/* ====================================================== */

async function carregarEstatisticas() {
  try {
    totalMotosEl.textContent = motos.length.toLocaleString("pt-BR");

    const statsRef = doc(db, "estatisticas", "vrumlab");
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      totalComparacoesEl.textContent = (
        statsSnap.data().totalComparacoes || 0
      ).toLocaleString("pt-BR");
    } else {
      await setDoc(statsRef, {
        totalComparacoes: 0
      });

      totalComparacoesEl.textContent = "0";
    }

  } catch (erro) {
    console.error("Erro ao carregar estatísticas:", erro);
  }
}

/* ====================================================== */
/* COMPARAÇÃO                                             */
/* ====================================================== */

async function compararMotos() {

  /* ==================================================== */
  /* PEGA AS MOTOS ESCOLHIDAS                             */
  /* ==================================================== */

  const motosSelecionadas = selects
    .map(select => motos.find(moto => moto.id === select.value))
    .filter(Boolean);

  /* Pelo menos 2 motos */
  if (motosSelecionadas.length < 2) {
    resultado.innerHTML = `
      <div class="aviso-box">
        Escolha pelo menos 2 motos para comparar.
      </div>
    `;
    return;
  }

  /* Não permitir repetir a mesma moto */
  const ids = motosSelecionadas.map(moto => moto.id);

  if (ids.length !== new Set(ids).size) {
    resultado.innerHTML = `
      <div class="aviso-box">
        Você selecionou a mesma moto mais de uma vez.
      </div>
    `;
    return;
  }

  /* ==================================================== */
  /* REGISTRA COMPARAÇÃO                                  */
  /* ==================================================== */

  try {
    const statsRef = doc(db, "estatisticas", "vrumlab");

    await setDoc(
      statsRef,
      {
        totalComparacoes: increment(1)
      },
      { merge: true }
    );

    /* ==================================================== */
/* REGISTRA QUANTAS VEZES CADA MOTO FOI COMPARADA       */
/* ==================================================== */

for (const moto of motosSelecionadas) {
  const rankingRef = doc(
    db,
    "estatisticas",
    "vrumlab",
    "motosComparadas",
    moto.id
  );

  await setDoc(
    rankingRef,
    {
      id: moto.id,
      marca: moto.marca,
      modelo: moto.modelo,
      ano: moto.ano,
      comparacoes: increment(1)
    },
    { merge: true }
  );
}

    const valorAtual = Number(
      totalComparacoesEl.textContent.replace(/\./g, "")
    ) || 0;

    totalComparacoesEl.textContent = (
      valorAtual + 1
    ).toLocaleString("pt-BR");

  } catch (erro) {
    console.error("Erro ao registrar comparação:", erro);
  }

  /* ==================================================== */
  /* CONFIGURAÇÃO DOS CAMPOS                              */
  /* ==================================================== */

  const configuracaoCampos = {
    id: { ocultar: true },
    imagem: { ocultar: true },
    cores: { ocultar: true },

    marca: { label: "Marca", tipo: "texto" },
    modelo: { label: "Modelo", tipo: "texto" },
    ano: { label: "Ano", tipo: "numero", melhor: "maior" },
    categoria: { label: "Categoria", tipo: "texto" },
    versao: { label: "Versão", tipo: "texto" },
    descricao: { label: "Descrição", tipo: "texto" },

    cilindrada: { label: "Cilindrada", tipo: "numero", unidade: " cc", melhor: "maior" },
    potencia: { label: "Potência", tipo: "numero", unidade: " cv", melhor: "maior" },
    torque: { label: "Torque", tipo: "numero", unidade: " kgfm", melhor: "maior" },
    velocidadeMaxima: { label: "Velocidade máxima", tipo: "numero", unidade: " km/h", melhor: "maior" },
    aceleracao0a100: { label: "0–100 km/h", tipo: "numero", unidade: " s", melhor: "menor" },

    peso: { label: "Peso", tipo: "numero", unidade: " kg", melhor: "menor" },
    pesoEmOrdemDeMarcha: { label: "Peso em ordem de marcha", tipo: "numero", unidade: " kg", melhor: "menor" },
    alturaBanco: { label: "Altura do banco", tipo: "numero", unidade: " mm", melhor: "menor" },
    distanciaSolo: { label: "Distância do solo", tipo: "numero", unidade: " mm", melhor: "maior" },
    entreEixos: { label: "Entre-eixos", tipo: "numero", unidade: " mm", melhor: "maior" },

    tanque: { label: "Tanque", tipo: "numero", unidade: " L", melhor: "maior" },
    consumo: { label: "Consumo", tipo: "numero", unidade: " km/l", melhor: "maior" },
    consumoCidade: { label: "Consumo cidade", tipo: "numero", unidade: " km/l", melhor: "maior" },
    consumoEstrada: { label: "Consumo estrada", tipo: "numero", unidade: " km/l", melhor: "maior" },
    autonomia: { label: "Autonomia", tipo: "numero", unidade: " km", melhor: "maior" },

    cambio: { label: "Câmbio", tipo: "numero", unidade: " marchas", melhor: "maior" },
    precoMedio: { label: "Preço médio", tipo: "numero", melhor: "menor", dinheiro: true },

    partida: { label: "Partida", tipo: "texto" },
    freioDianteiro: { label: "Freio dianteiro", tipo: "texto" },
    freioTraseiro: { label: "Freio traseiro", tipo: "texto" },
    pneuDianteiro: { label: "Pneu dianteiro", tipo: "texto" },
    pneuTraseiro: { label: "Pneu traseiro", tipo: "texto" },
    refrigeracao: { label: "Refrigeração", tipo: "texto" },
    combustivel: { label: "Combustível", tipo: "texto" },
    paisOrigem: { label: "País de origem", tipo: "texto" },
    melhorPara: { label: "Melhor para", tipo: "texto" },
    tipoMotor: { label: "Tipo de motor", tipo: "texto" },
    transmissao: { label: "Transmissão", tipo: "texto" },
    embreagem: { label: "Embreagem", tipo: "texto" },
    tracao: { label: "Tração", tipo: "texto" },
    garantia: { label: "Garantia", tipo: "texto" },
    painel: { label: "Painel", tipo: "texto" },

    numeroCilindros: { label: "Número de cilindros", tipo: "numero", melhor: "maior" },
    lancamento: { label: "Ano de lançamento", tipo: "numero", melhor: "maior" },

    injecao: { label: "Injeção eletrônica", tipo: "boolean" },
    abs: { label: "ABS", tipo: "boolean" },
    controleTracao: { label: "Controle de tração", tipo: "boolean" },
    modosPilotagem: { label: "Modos de pilotagem", tipo: "boolean" },
    quickshifter: { label: "Quickshifter", tipo: "boolean" },
    pilotoAutomatico: { label: "Piloto automático", tipo: "boolean" },
    descontinuada: { label: "Descontinuada", tipo: "boolean", inverter: true }
  };

  /* ==================================================== */
  /* GERA TODOS OS CAMPOS EXISTENTES                      */
  /* ==================================================== */

  const todosCampos = [...new Set(
    motosSelecionadas.flatMap(moto => Object.keys(moto))
  )];

  /* ==================================================== */
  /* GERA LINHAS DA TABELA                                */
  /* ==================================================== */

  const linhasComparacao = todosCampos
    .filter(campo => !configuracaoCampos[campo]?.ocultar)
    .map(campo => {

      const config = configuracaoCampos[campo] || {
        label: campo,
        tipo: typeof motosSelecionadas[0][campo] === "boolean"
          ? "boolean"
          : typeof motosSelecionadas[0][campo] === "number"
            ? "numero"
            : "texto"
      };

      let melhorValor = null;

      if (config.tipo === "numero") {
        const valores = motosSelecionadas
          .map(moto => Number(moto[campo]))
          .filter(valor => !isNaN(valor));

        if (valores.length) {
          melhorValor = config.melhor === "menor"
            ? Math.min(...valores)
            : Math.max(...valores);
        }
      }

      return `
        <tr>
          <td>${config.label}</td>

          ${motosSelecionadas.map(moto => {
            const valor = moto[campo];

            let texto = "-";
            let classe = "";

            if (config.tipo === "numero") {
              if (!isNaN(Number(valor))) {
                classe = Number(valor) === melhorValor
                  ? "melhor"
                  : "pior";
              }

              texto = config.dinheiro
                ? `R$ ${Number(valor).toLocaleString("pt-BR")}`
                : `${valor}${config.unidade || ""}`;
            }

            else if (config.tipo === "boolean") {
              const positivo = config.inverter ? !valor : valor;

              classe = positivo ? "melhor" : "pior";
              texto = valor ? "Sim" : "Não";
            }

            else {
              texto = Array.isArray(valor)
                ? (valor.length ? valor.join(", ") : "-")
                : (valor ?? "-");
            }

            return `
              <td class="${classe}">
                ${texto}
              </td>
            `;
          }).join("")}
        </tr>
      `;
    })
    .join("");

  /* ==================================================== */
  /* RESUMO AUTOMÁTICO                                    */
  /* ==================================================== */

/* ====================================================
   RESUMO VISUAL (AAA)
==================================================== */

const comentarios = `
  <div class="destaque-section">

    <h3>🏆 Quem vence em cada aspecto?</h3>

    <div class="destaque-grid">

      ${motosSelecionadas.map(moto => {

        const vantagens = [];

        Object.entries(configuracaoCampos)
          .filter(([_, config]) => config.tipo === "numero")
          .forEach(([campo, config]) => {

            const valores = motosSelecionadas
              .map(item => Number(item[campo]))
              .filter(valor => !isNaN(valor));

            if (!valores.length) return;

            const melhorValor = config.melhor === "menor"
              ? Math.min(...valores)
              : Math.max(...valores);

            if (Number(moto[campo]) === melhorValor) {
              vantagens.push(config.label);
            }
          });

        /* destaque vencedor geral */
        const classe = vantagens.length >= 3 ? "vencedor" : "";

        return `
          <div class="destaque-card ${classe}">

            <div class="destaque-header">
              🏍️ ${moto.marca} ${moto.modelo} ${moto.ano}
            </div>

            ${
              vantagens.length === 0
              ? `<p class="destaque-neutro">
                   Equilibrada, sem dominar critérios específicos.
                 </p>`
              : `
                <div class="destaque-tags">
                  ${vantagens.slice(0,6).map(v => `
                    <span>${v}</span>
                  `).join("")}
                </div>
              `
            }

          </div>
        `;
      }).join("")}

    </div>

  </div>
`;

  /* ==================================================== */
  /* HTML FINAL                                            */
  /* ==================================================== */

resultado.innerHTML = `
  <div class="resultado-comparacao">

    <table class="tabela-comparacao">

      <table class="tabela-comparacao">
        <thead>
          <tr>
            <th>Critério</th>

            ${motosSelecionadas.map(moto => `
              <th>
                <div style="display:flex; flex-direction:column; gap:6px; align-items:center;">
                  <strong>${moto.marca}</strong>
                  <span>${moto.modelo}</span>
                  <small style="opacity:.7;">${moto.ano}</small>
                </div>
              </th>
            `).join("")}
          </tr>
        </thead>

        <tbody>
          ${linhasComparacao}
        </tbody>
      </table>

    <div class="comentarios-comparacao">
      <h3>Quem se destaca em cada ponto?</h3>
      ${comentarios}
    </div>

  </div>
`;

await carregarRanking();
}

/* ======================================================
   CARREGA O RANKING DAS MOTOS MAIS COMPARADAS
====================================================== */

async function carregarRanking() {
  try {
    const snapshot = await getDocs(
      collection(db, "estatisticas", "vrumlab", "motosComparadas")
    );

    const ranking = snapshot.docs
      .map(docItem => docItem.data())
      .sort((a, b) => b.comparacoes - a.comparacoes)
      .slice(0, 10);

    const container = document.getElementById("rankingMotos");

    if (!container) return;

    /* =========================
       SEM DADOS
    ========================= */
    if (ranking.length === 0) {
      container.innerHTML = `
        <div class="aviso-box">
          Ainda não há motos comparadas.
        </div>
      `;
      return;
    }

    /* =========================
       RENDERIZAÇÃO
    ========================= */
    container.innerHTML = `
      <div class="ranking-list">
        ${ranking.map((moto, index) => {

          /* classes do top */
          let classeTop = "";
          let medalha = "";

          if (index === 0) {
            classeTop = "top-1";
            medalha = "🥇";
          } else if (index === 1) {
            classeTop = "top-2";
            medalha = "🥈";
          } else if (index === 2) {
            classeTop = "top-3";
            medalha = "🥉";
          }

          return `
            <div class="ranking-item ${classeTop}">

              <!-- posição -->
              <div class="ranking-posicao">
                ${medalha || `#${index + 1}`}
              </div>

              <!-- info -->
              <div class="ranking-info">
                <strong>
                  ${moto.marca} ${moto.modelo}
                </strong>
                <span>${moto.ano}</span>
              </div>

              <!-- total -->
              <div class="ranking-total">
                ${moto.comparacoes.toLocaleString("pt-BR")}
                <small>comparações</small>
              </div>

            </div>
          `;
        }).join("")}
      </div>
    `;

  } catch (erro) {
    console.error("Erro ao carregar ranking:", erro);
  }
}

/* ====================================================== */
/* EVENTOS                                                */
/* ====================================================== */

botaoComparar.addEventListener("click", compararMotos);

document.addEventListener("DOMContentLoaded", async () => {
  await carregarMotos();
  await carregarEstatisticas();
  await carregarRanking();
});