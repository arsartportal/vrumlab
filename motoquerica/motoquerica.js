
import { app } from "./firebase.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const db = getFirestore(app);

const botao = document.getElementById("salvarRegistro");
const mensagem = document.getElementById("mensagemSalva");

const campoData = document.querySelector('input[type="date"]');
const campoKm = document.querySelector('input[type="number"]');
const campoEvolucao = document.querySelector("select");
const campoObs = document.querySelector("textarea");

let kmAtual = 0;

const badges = [
  "👣 Primeiros Passos",
  "🛵 Primeiros Metros",
  "🙂 Menos Medo",
  "🔑 Virou a Chave",
  "🏁 Primeira Volta",
  "🧡 Coragem Ligada",
  "⚙️ Primeira Troca de Marcha",
  "🚦 Parou e Saiu Sozinha",
  "🌱 Começando a Confiar",
  "✨ Já Parece Natural",

  "🔥 Sem Medo da Embreagem",
  "🛞 Rainha das Curvas",
  "💨 Sentindo o Vento",
  "🚗 Passando Pelos Carros",
  "🛣️ Primeira Reta Longa",
  "🎯 Mais Controle",
  "🧍‍♀️ Equilíbrio Perfeito",
  "🌤️ Primeiro Passeio de Dia",
  "😎 Já Está Curtindo",
  "💪 Mais Confiante",

  "🌙 Primeiro Passeio à Noite",
  "💡 Ligou os Faróis da Coragem",
  "🛑 Sem Morrer a Moto",
  "⚡ Troca de Marchas Perfeita",
  "🎵 Já Escuta o Ronco",
  "🏘️ Dominando a Rua",
  "🧭 Já Sabe Para Onde Vai",
  "🚥 Trânsito Sem Medo",
  "📍 Primeira Ida Mais Longe",
  "🛣️ Primeira Mini Viagem",

  "🖤 Harley Girl em Treinamento",
  "🏍️ Sonhando Acordada",
  "🧡 Mais Próxima da Harley",
  "👀 Já Olha Diferente Para a Estrada",
  "🛞 Curvas Sem Hesitar",
  "🌬️ Confiança no Vento",
  "🪞 Já Nem Precisa Pensar",
  "🚀 Pilotando de Verdade",
  "📸 Momento de Orgulho",
  "🏁 Primeira Grande Marca",

  "🌄 Primeira Manhã de Moto",
  "🌇 Primeiro Fim de Tarde Pilotando",
  "🎉 Já Dá Para Comemorar",
  "🧠 Corpo e Moto em Sintonia",
  "🛣️ Mais Estrada, Menos Medo",
  "💬 “Vai Dar Certo”",
  "🫶 Confiança Construída",
  "⚙️ Cada Marcha Mais Fácil",
  "🌟 Já Impressiona",
  "🚦 Tudo Sob Controle",

  "🛵 Passeio Sem Ansiedade",
  "🏍️ Mais Motociclista a Cada Km",
  "🧡 A Harley Está Mais Perto",
  "💥 Não Parece Mais Iniciante",
  "😌 Pilotando Com Calma",
  "🪶 Leveza ao Guiar",
  "🎯 Controle Total da Embreagem",
  "🌤️ Curtindo o Caminho",
  "🛣️ Quilômetros de Coragem",
  "🏆 Vitória Sobre o Medo",

  "🚀 Já Vai Sozinha",
  "💭 Imaginando a Harley",
  "🖤 Espírito Custom",
  "🎶 O Ronco Já Faz Parte",
  "👣 Cada Km Conta",
  "🌟 Mais Forte Que Ontem",
  "🏍️ Quase Uma Harley Girl",
  "💨 Muito Mais Solta",
  "🛞 Curvas Viraram Diversão",
  "🧡 Já Dá Para Sentir o Sonho",

  "🪙 Cada Km Vale Ouro",
  "🔥 Coragem de Verdade",
  "🛣️ Mais Perto dos 10.000",
  "🎯 Não Tem Mais Volta",
  "🌈 O Sonho Está no Horizonte",
  "🧍‍♀️ Confiança Absoluta",
  "⚡ Parece Que Sempre Pilotou",
  "🏍️ A Estrada Já É Dela",
  "🧡 Já Dá Para Ver a Harley",
  "👑 Dona da Estrada",

  "🏁 Últimos Grandes Passos",
  "🖤 Alma de Motociclista",
  "🚦 Nenhum Medo Restou",
  "🌟 Brilhando na Estrada",
  "💪 Mais Forte Que Nunca",
  "🛞 O Mundo Ficou Pequeno",
  "🎉 Quase Lá",
  "🏍️ Harley Girl de Verdade",
  "🧡 Falta Muito Pouco",
  "🔥 O Sonho Está Vivo",

  "🏆 Rumo Aos Últimos Km",
  "🛣️ Cada Metro Vale a Pena",
  "👀 Já Dá Para Imaginar",
  "🌅 O Final Está Chegando",
  "🖤 O Sonho Virou Plano",
  "💫 Nascida Para Pilotar",
  "🏍️ Praticamente Pronta",
  "👑 Rainha da Estrada",
  "🧡 Última Curva",
  "🏍️ Pronta para a Harley",

  "🧡 Harley Conquistada"
];

function gerarMetas() {
  const container = document.getElementById("timelineMetas");

  if (!container) return;

  container.innerHTML = "";

  const metas = [];

  // Primeira meta especial
  metas.push({
    km: 1,
    titulo: "👣 Primeiros Passos",
    textoDesbloqueado: "Ela já começou a jornada rumo à Harley! ❤️",
    textoBloqueado: "Basta 1 km para começar oficialmente essa aventura."
  });

  // Demais metas de 100 em 100 km
  for (let metaKm = 100; metaKm <= 10000; metaKm += 100) {
  const badgeIndex = (metaKm / 100);

  metas.push({
    km: metaKm,
    titulo: badges[badgeIndex],
    textoDesbloqueado: "Conquista desbloqueada!",
    textoBloqueado: `Faltam ${(metaKm - kmAtual).toLocaleString("pt-BR")} km`
  });
}

  const desbloqueadas = metas.filter(meta => kmAtual >= meta.km);
  const bloqueadas = metas.filter(meta => kmAtual < meta.km);

  // Mostrar todas desbloqueadas + apenas as próximas 3
  const metasVisiveis = [
    ...desbloqueadas,
    ...bloqueadas.slice(0, 3)
  ];

  metasVisiveis.forEach((meta) => {
    const concluida = kmAtual >= meta.km;

    const card = document.createElement("div");
    card.className = `card ${concluida ? "concluida" : "bloqueada"}`;

    card.innerHTML = `
      <div class="meta-topo">
        <strong class="meta-km">
          ${meta.km.toLocaleString("pt-BR")} km
        </strong>

        <span class="meta-status">
          ${concluida ? "✅" : "🔒"}
        </span>
      </div>

      <p class="meta-titulo">
        ${meta.titulo}
      </p>

      <p class="meta-texto">
        ${
          concluida
            ? meta.textoDesbloqueado
            : meta.textoBloqueado
        }
      </p>
    `;

    container.appendChild(card);
  });
}

async function carregarKmTotal() {
  try {
    const q = query(
      collection(db, "treinos-erikinha"),
      orderBy("criadoEm", "desc")
    );

    const snapshot = await getDocs(q);

    kmAtual = 0;

    const timelineRegistros = document.getElementById("timelineRegistros");

    if (timelineRegistros) {
      timelineRegistros.innerHTML = "";
    }

    snapshot.forEach((doc) => {
      const dados = doc.data();

      kmAtual += Number(dados.km || 0);

      if (!timelineRegistros) return;

      const item = document.createElement("div");
      item.className = "registro-item";

      item.innerHTML = `
        <div class="registro-ponto"></div>

        <div class="registro-card">

          <div class="registro-topo">
            <span class="registro-data">
              📅 ${dados.data}
            </span>

            <span class="registro-km">
              +${dados.km} km
            </span>
          </div>

          <div class="registro-evolucao">
            ${dados.evolucao}
          </div>

          <div class="registro-obs">
            ${dados.observacoes || "Sem observações."}
          </div>

        </div>
      `;

      timelineRegistros.appendChild(item);
    });

    const kmAtualIntro = document.getElementById("kmAtualIntro");
const kmFaltandoIntro = document.getElementById("kmFaltandoIntro");
const porcentagemIntro = document.getElementById("porcentagemIntro");

const kmMeta = 10000;
const kmFaltando = Math.max(0, kmMeta - kmAtual);
const porcentagem = Math.min(100, (kmAtual / kmMeta) * 100);

if (kmAtualIntro) {
  kmAtualIntro.textContent = `${kmAtual.toLocaleString("pt-BR")} km`;
}

if (kmFaltandoIntro) {
  kmFaltandoIntro.textContent = `${kmFaltando.toLocaleString("pt-BR")} km`;
}

if (porcentagemIntro) {
  porcentagemIntro.textContent = `${porcentagem.toFixed(1)}%`;
}

    gerarMetas();

  } catch (erro) {
    console.error("Erro ao carregar quilômetros:", erro);
  }
}

botao.addEventListener("click", async () => {
  const data = campoData.value;
  const km = Number(campoKm.value);
  const evolucao = campoEvolucao.value;
  const observacoes = campoObs.value;

  if (!data || !km || evolucao === "Escolha...") {
    alert("Preencha a data, os quilômetros e a evolução.");
    return;
  }

  try {
    await addDoc(collection(db, "treinos-erikinha"), {
      data,
      km,
      evolucao,
      observacoes,
      criadoEm: serverTimestamp()
    });

    kmAtual += km;
    gerarMetas();
    await carregarKmTotal();

    mensagem.style.display = "block";
    mensagem.textContent = `Registro salvo! Total acumulado: ${kmAtual.toLocaleString("pt-BR")} km 🧡`;

    campoData.value = "";
    campoKm.value = "";
    campoEvolucao.selectedIndex = 0;
    campoObs.value = "";

    setTimeout(() => {
      mensagem.style.display = "none";
    }, 4000);

  } catch (erro) {
    console.error("Erro ao salvar:", erro);
    alert("Não foi possível salvar o registro.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  carregarKmTotal();
});
import { app } from "./firebase.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const db = getFirestore(app);

const botao = document.getElementById("salvarRegistro");
const mensagem = document.getElementById("mensagemSalva");

const campoData = document.querySelector('input[type="date"]');
const campoKm = document.querySelector('input[type="number"]');
const campoEvolucao = document.querySelector("select");
const campoObs = document.querySelector("textarea");

let kmAtual = 0;

const badges = [
  "👣 Primeiros Passos",
  "🛵 Primeiros Metros",
  "🙂 Menos Medo",
  "🔑 Virou a Chave",
  "🏁 Primeira Volta",
  "🧡 Coragem Ligada",
  "⚙️ Primeira Troca de Marcha",
  "🚦 Parou e Saiu Sozinha",
  "🌱 Começando a Confiar",
  "✨ Já Parece Natural",

  "🔥 Sem Medo da Embreagem",
  "🛞 Rainha das Curvas",
  "💨 Sentindo o Vento",
  "🚗 Passando Pelos Carros",
  "🛣️ Primeira Reta Longa",
  "🎯 Mais Controle",
  "🧍‍♀️ Equilíbrio Perfeito",
  "🌤️ Primeiro Passeio de Dia",
  "😎 Já Está Curtindo",
  "💪 Mais Confiante",

  "🌙 Primeiro Passeio à Noite",
  "💡 Ligou os Faróis da Coragem",
  "🛑 Sem Morrer a Moto",
  "⚡ Troca de Marchas Perfeita",
  "🎵 Já Escuta o Ronco",
  "🏘️ Dominando a Rua",
  "🧭 Já Sabe Para Onde Vai",
  "🚥 Trânsito Sem Medo",
  "📍 Primeira Ida Mais Longe",
  "🛣️ Primeira Mini Viagem",

  "🖤 Harley Girl em Treinamento",
  "🏍️ Sonhando Acordada",
  "🧡 Mais Próxima da Harley",
  "👀 Já Olha Diferente Para a Estrada",
  "🛞 Curvas Sem Hesitar",
  "🌬️ Confiança no Vento",
  "🪞 Já Nem Precisa Pensar",
  "🚀 Pilotando de Verdade",
  "📸 Momento de Orgulho",
  "🏁 Primeira Grande Marca",

  "🌄 Primeira Manhã de Moto",
  "🌇 Primeiro Fim de Tarde Pilotando",
  "🎉 Já Dá Para Comemorar",
  "🧠 Corpo e Moto em Sintonia",
  "🛣️ Mais Estrada, Menos Medo",
  "💬 “Vai Dar Certo”",
  "🫶 Confiança Construída",
  "⚙️ Cada Marcha Mais Fácil",
  "🌟 Já Impressiona",
  "🚦 Tudo Sob Controle",

  "🛵 Passeio Sem Ansiedade",
  "🏍️ Mais Motociclista a Cada Km",
  "🧡 A Harley Está Mais Perto",
  "💥 Não Parece Mais Iniciante",
  "😌 Pilotando Com Calma",
  "🪶 Leveza ao Guiar",
  "🎯 Controle Total da Embreagem",
  "🌤️ Curtindo o Caminho",
  "🛣️ Quilômetros de Coragem",
  "🏆 Vitória Sobre o Medo",

  "🚀 Já Vai Sozinha",
  "💭 Imaginando a Harley",
  "🖤 Espírito Custom",
  "🎶 O Ronco Já Faz Parte",
  "👣 Cada Km Conta",
  "🌟 Mais Forte Que Ontem",
  "🏍️ Quase Uma Harley Girl",
  "💨 Muito Mais Solta",
  "🛞 Curvas Viraram Diversão",
  "🧡 Já Dá Para Sentir o Sonho",

  "🪙 Cada Km Vale Ouro",
  "🔥 Coragem de Verdade",
  "🛣️ Mais Perto dos 10.000",
  "🎯 Não Tem Mais Volta",
  "🌈 O Sonho Está no Horizonte",
  "🧍‍♀️ Confiança Absoluta",
  "⚡ Parece Que Sempre Pilotou",
  "🏍️ A Estrada Já É Dela",
  "🧡 Já Dá Para Ver a Harley",
  "👑 Dona da Estrada",

  "🏁 Últimos Grandes Passos",
  "🖤 Alma de Motociclista",
  "🚦 Nenhum Medo Restou",
  "🌟 Brilhando na Estrada",
  "💪 Mais Forte Que Nunca",
  "🛞 O Mundo Ficou Pequeno",
  "🎉 Quase Lá",
  "🏍️ Harley Girl de Verdade",
  "🧡 Falta Muito Pouco",
  "🔥 O Sonho Está Vivo",

  "🏆 Rumo Aos Últimos Km",
  "🛣️ Cada Metro Vale a Pena",
  "👀 Já Dá Para Imaginar",
  "🌅 O Final Está Chegando",
  "🖤 O Sonho Virou Plano",
  "💫 Nascida Para Pilotar",
  "🏍️ Praticamente Pronta",
  "👑 Rainha da Estrada",
  "🧡 Última Curva",
  "🏍️ Pronta para a Harley",

  "🧡 Harley Conquistada"
];

function gerarMetas() {
  const container = document.getElementById("timelineMetas");

  if (!container) return;

  container.innerHTML = "";

  const metas = [];

  // Primeira meta especial
  metas.push({
    km: 1,
    titulo: "👣 Primeiros Passos",
    textoDesbloqueado: "Ela já começou a jornada rumo à Harley! ❤️",
    textoBloqueado: "Basta 1 km para começar oficialmente essa aventura."
  });

  // Demais metas de 100 em 100 km
  for (let metaKm = 100; metaKm <= 10000; metaKm += 100) {
  const badgeIndex = (metaKm / 100);

  metas.push({
    km: metaKm,
    titulo: badges[badgeIndex],
    textoDesbloqueado: "Conquista desbloqueada!",
    textoBloqueado: `Faltam ${(metaKm - kmAtual).toLocaleString("pt-BR")} km`
  });
}

  const desbloqueadas = metas.filter(meta => kmAtual >= meta.km);
  const bloqueadas = metas.filter(meta => kmAtual < meta.km);

  // Mostrar todas desbloqueadas + apenas as próximas 3
  const metasVisiveis = [
    ...desbloqueadas,
    ...bloqueadas.slice(0, 3)
  ];

  metasVisiveis.forEach((meta) => {
    const concluida = kmAtual >= meta.km;

    const card = document.createElement("div");
    card.className = `card ${concluida ? "concluida" : "bloqueada"}`;

    card.innerHTML = `
      <div class="meta-topo">
        <strong class="meta-km">
          ${meta.km.toLocaleString("pt-BR")} km
        </strong>

        <span class="meta-status">
          ${concluida ? "✅" : "🔒"}
        </span>
      </div>

      <p class="meta-titulo">
        ${meta.titulo}
      </p>

      <p class="meta-texto">
        ${
          concluida
            ? meta.textoDesbloqueado
            : meta.textoBloqueado
        }
      </p>
    `;

    container.appendChild(card);
  });
}

async function carregarKmTotal() {
  try {
    const q = query(
      collection(db, "treinos-erikinha"),
      orderBy("criadoEm", "desc")
    );

    const snapshot = await getDocs(q);

    kmAtual = 0;

    const timelineRegistros = document.getElementById("timelineRegistros");

    if (timelineRegistros) {
      timelineRegistros.innerHTML = "";
    }

    snapshot.forEach((doc) => {
      const dados = doc.data();

      kmAtual += Number(dados.km || 0);

      if (!timelineRegistros) return;

      const item = document.createElement("div");
      item.className = "registro-item";

      item.innerHTML = `
        <div class="registro-ponto"></div>

        <div class="registro-card">

          <div class="registro-topo">
            <span class="registro-data">
              📅 ${dados.data}
            </span>

            <span class="registro-km">
              +${dados.km} km
            </span>
          </div>

          <div class="registro-evolucao">
            ${dados.evolucao}
          </div>

          <div class="registro-obs">
            ${dados.observacoes || "Sem observações."}
          </div>

        </div>
      `;

      timelineRegistros.appendChild(item);
    });

    const kmAtualIntro = document.getElementById("kmAtualIntro");
const kmFaltandoIntro = document.getElementById("kmFaltandoIntro");
const porcentagemIntro = document.getElementById("porcentagemIntro");

const kmMeta = 10000;
const kmFaltando = Math.max(0, kmMeta - kmAtual);
const porcentagem = Math.min(100, (kmAtual / kmMeta) * 100);

if (kmAtualIntro) {
  kmAtualIntro.textContent = `${kmAtual.toLocaleString("pt-BR")} km`;
}

if (kmFaltandoIntro) {
  kmFaltandoIntro.textContent = `${kmFaltando.toLocaleString("pt-BR")} km`;
}

if (porcentagemIntro) {
  porcentagemIntro.textContent = `${porcentagem.toFixed(1)}%`;
}

    gerarMetas();

  } catch (erro) {
    console.error("Erro ao carregar quilômetros:", erro);
  }
}

botao.addEventListener("click", async () => {
  const data = campoData.value;
  const km = Number(campoKm.value);
  const evolucao = campoEvolucao.value;
  const observacoes = campoObs.value;

  if (!data || !km || evolucao === "Escolha...") {
    alert("Preencha a data, os quilômetros e a evolução.");
    return;
  }

  try {
    await addDoc(collection(db, "treinos-erikinha"), {
      data,
      km,
      evolucao,
      observacoes,
      criadoEm: serverTimestamp()
    });

    kmAtual += km;
    gerarMetas();
    await carregarKmTotal();

   mensagem.style.display = "block";
mensagem.textContent = `Registro salvo! Total acumulado: ${kmAtual.toLocaleString("pt-BR")} km 🧡`;

    campoData.value = "";
    campoKm.value = "";
    campoEvolucao.selectedIndex = 0;
    campoObs.value = "";

    setTimeout(() => {
      mensagem.style.display = "none";
    }, 4000);

  } catch (erro) {
    console.error("Erro ao salvar:", erro);
    alert("Não foi possível salvar o registro.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  carregarKmTotal();

});