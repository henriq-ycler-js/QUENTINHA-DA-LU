import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("lista");
let itens = [];

async function carregar() {
  lista.innerHTML = "";
  itens = [];

  const snap = await getDocs(collection(db, "cardapio"));
  snap.forEach(d => {
    const item = { id: d.id, ...d.data() };
    itens.push(item);

    lista.innerHTML += `
      <label>
        <input type="checkbox" ${item.status ? "checked" : ""} 
          onchange="window.toggle('${item.id}', this.checked)">
        ${item.nome} (${item.tipo})
      </label><br>
    `;
  });
}

window.toggle = (id, status) => {
  const item = itens.find(i => i.id === id);
  if (item) item.status = status;
};

window.salvar = async () => {
  for (const item of itens) {
    await updateDoc(doc(db, "cardapio", item.id), {
      status: item.status
    });
  }
  alert("Cardápio atualizado!");
};

window.adicionar = async () => {
  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;

  if (!nome) return alert("Digite um nome");

  await addDoc(collection(db, "cardapio"), {
    nome,
    tipo,
    status: true
  });

  document.getElementById("nome").value = "";
  carregar();
};

carregar();
