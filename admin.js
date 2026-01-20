import { db } from "./firebase.js";
import { doc, setDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.salvar = async () => {
  const carnes = document.getElementById("carne").value.split(",");
  const acomp = document.getElementById("acomp").value.split(",");
  const sucos = document.getElementById("suco").value.split(",");

  await setDoc(doc(db, "cardapio", "hoje"), {
    carnes: carnes.map(v => v.trim()),
    acompanhamentos: acomp.map(v => v.trim()),
    sucos: sucos.map(v => v.trim())
  });

  document.getElementById("status").innerText = "✅ Cardápio salvo";
};
