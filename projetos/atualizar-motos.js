const fs = require("fs");

/* ===================================================== */
/* JSON ORIGINAL                                         */
/* ===================================================== */

const motos = require("./motos.json");

/* ===================================================== */
/* VALORES PADRÃO DOS NOVOS CAMPOS                       */
/* ===================================================== */

const camposExtras = {
  tipoMotor: "",
  numeroCilindros: 0,
  transmissao: "Manual",
  embreagem: "",
  tracao: "Corrente",
  garantia: "3 anos",
  cores: [],
  consumoCidade: 0,
  consumoEstrada: 0,
  painel: "Digital",
  controleTracao: false,
  modosPilotagem: false,
  quickshifter: false,
  pilotoAutomatico: false
};

/* ===================================================== */
/* REGRAS AUTOMÁTICAS PARA PREENCHER MELHOR              */
/* ===================================================== */

function gerarCamposMoto(moto) {
  let tipoMotor = "Monocilíndrico";
  let numeroCilindros = 1;

  if (moto.cilindrada >= 1200) {
    tipoMotor = "Bicilíndrico em V";
    numeroCilindros = 2;
  } else if (moto.cilindrada >= 900) {
    tipoMotor = "4 cilindros em linha";
    numeroCilindros = 4;
  } else if (moto.cilindrada >= 700 && moto.marca === "Triumph") {
    tipoMotor = "3 cilindros em linha";
    numeroCilindros = 3;
  } else if (moto.cilindrada >= 500) {
    tipoMotor = "Bicilíndrico";
    numeroCilindros = 2;
  }

  let transmissao = moto.categoria === "Scooter"
    ? "CVT"
    : "Manual";

  let embreagem = moto.categoria === "Scooter"
    ? "Automática"
    : "Multidisco banhada a óleo";

  let tracao = "Corrente";

  if (
    moto.marca === "BMW" &&
    (moto.modelo.includes("GS") || moto.modelo.includes("R 1250") || moto.modelo.includes("R 1300"))
  ) {
    tracao = "Cardã";
  }

  if (moto.marca === "Harley-Davidson") {
    tracao = "Correia";
  }

  let garantia = "3 anos";

  if (moto.marca === "Honda") garantia = "3 anos";
  if (moto.marca === "Yamaha") garantia = "4 anos";
  if (moto.marca === "Royal Enfield") garantia = "3 anos";
  if (moto.marca === "BMW") garantia = "3 anos";
  if (moto.marca === "Kawasaki") garantia = "2 anos";
  if (moto.marca === "Triumph") garantia = "2 anos";
  if (moto.marca === "Harley-Davidson") garantia = "2 anos";

  let painel = "Digital";

  if (moto.categoria === "Classic" || moto.categoria === "Custom") {
    painel = "Analógico + Digital";
  }

  const controleTracao =
    moto.cilindrada >= 650 ||
    moto.modelo.includes("GS") ||
    moto.modelo.includes("Hayabusa") ||
    moto.modelo.includes("Panigale") ||
    moto.modelo.includes("S 1000 RR");

  const modosPilotagem = moto.cilindrada >= 650;

  const quickshifter =
    moto.cilindrada >= 900 ||
    moto.modelo.includes("Street Triple") ||
    moto.modelo.includes("Panigale") ||
    moto.modelo.includes("S 1000 RR");

  const pilotoAutomatico =
    moto.modelo.includes("GS") ||
    moto.categoria === "Touring";

  return {
    tipoMotor,
    numeroCilindros,
    transmissao,
    embreagem,
    tracao,
    garantia,
    cores: [],
    consumoCidade: moto.consumo || 0,
    consumoEstrada: moto.consumo
      ? Number((moto.consumo * 1.15).toFixed(1))
      : 0,
    painel,
    controleTracao,
    modosPilotagem,
    quickshifter,
    pilotoAutomatico
  };
}

/* ===================================================== */
/* GERA NOVO JSON COMPLETO                               */
/* ===================================================== */

const motosAtualizadas = motos.map(moto => ({
  ...moto,
  ...camposExtras,
  ...gerarCamposMoto(moto)
}));

/* ===================================================== */
/* SALVA O NOVO ARQUIVO                                  */
/* ===================================================== */

fs.writeFileSync(
  "motos-completo.json",
  JSON.stringify(motosAtualizadas, null, 2),
  "utf8"
);

console.log("Arquivo motos-completo.json criado com sucesso!");
