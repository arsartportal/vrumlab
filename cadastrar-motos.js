import { app } from "./firebase.js";

import {
  getFirestore,
  doc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const db = getFirestore(app);

async function cadastrarMotos() {
  try {
    const resposta = await fetch("./motos.json");
    const motos = await resposta.json();

    let batch = writeBatch(db);

    motos.forEach((moto) => {
      const ref = doc(db, "motos", moto.id);
      batch.set(ref, moto);
    });

    await batch.commit();

    console.log("Motos cadastradas com sucesso!");
  } catch (erro) {
    console.error("Erro ao cadastrar motos:", erro);
  }
}

cadastrarMotos();