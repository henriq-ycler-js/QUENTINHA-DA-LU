import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const appDiv = document.getElementById("app");

async function carregarCardapio() {
  const ref = doc(db, "cardapio", "hoje");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    appDiv.innerHTML = "<p>Cardápio indisponível</p>";
    return;
  }

  const c = snap.data();

  appDiv.innerHTML = `
    <h2 class="text-xl font-bold mb-2">🍛 Cardápio de Hoje</h2>

    <ul class="space-y-1">
      <li><b>Acompanhamento:</b> ${c.acompanhamento}</li>
      <li><b>Carne:</b> ${c.carne}</li>
      ${c.suco ? `<li>🧃 <b>Suco:</b> ${c.suco}</li>` : ""}
    </ul>
  `;
}

carregarCardapio();

function render() {
    const app = document.getElementById('app');
    window.scrollTo(0,0);
    
    if (etapa === 1) renderPasso1(app);
    else if (etapa === 2) renderPasso2(app);
    else if (etapa === 3) renderPasso3(app);
    else if (etapa === 4) renderPasso4(app);
}

// --- PASSO 1 ---
function renderPasso1(app) {
    let html = `<h2 class="text-zinc-500 font-bold text-[10px] uppercase mb-4 text-center tracking-widest">Selecione o Tamanho</h2><div class="space-y-3">`;
    
    const ativos = db.tamanhos.filter(t => t.status);
    if (ativos.length === 0) {
        html += `<p class="text-center text-zinc-600 py-10">Nenhum tamanho disponível no momento.</p>`;
    }

    ativos.forEach(t => {
        let itemNoCarrinho = carrinhoMarmitas.find(c => String(c.id) === String(t.id));
        let qtd = itemNoCarrinho ? itemNoCarrinho.qty : 0;

        html += `
        <div class="card p-3 flex items-center gap-4">
            <img src="${t.img || 'https://placehold.co/100x100/222/FFF?text=LU'}" class="w-20 h-20 rounded-lg object-cover bg-zinc-800">
            <div class="flex-1">
                <h3 class="font-bold text-base">${t.nome}</h3>
                <p class="text-yellow-500 font-black text-lg">${moeda(t.preco)}</p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="addMarmita('${t.id}', -1)" class="bg-zinc-800 w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center">-</button>
                <span class="font-black text-lg w-6 text-center">${qtd}</span>
                <button onclick="addMarmita('${t.id}', 1)" class="bg-zinc-800 w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center">+</button>
            </div>
        </div>`;
    });

    html += `</div>`;

    let totalMarmitas = carrinhoMarmitas.reduce((acc, obj) => acc + obj.qty, 0);

    if (totalMarmitas > 0) {
        html += `<div class="sticky-footer">
            <button onclick="irMontagem()" class="btn-yellow">
                Montar ${totalMarmitas} Marmita(s) ➜
            </button>
        </div>`;
    }

    app.innerHTML = html;
}

window.addMarmita = (id, v) => {
    let index = carrinhoMarmitas.findIndex(c => String(c.id) === String(id));
    if (index > -1) {
        carrinhoMarmitas[index].qty += v;
        if (carrinhoMarmitas[index].qty <= 0) {
            carrinhoMarmitas.splice(index, 1);
        }
    } else if (v > 0) {
        carrinhoMarmitas.push({ id: id, qty: 1 });
    }
    render();
};

window.irMontagem = () => {
    montagem = [];
    carrinhoMarmitas.forEach(c => {
        const t = db.tamanhos.find(x => String(x.id) === String(c.id));
        if(t) {
            for (let i = 0; i < c.qty; i++) {
                montagem.push({ 
                    nome: t.nome, 
                    preco: t.preco, 
                    maxC: t.carnes || 1, 
                    itens: [], 
                    cSel: 0 
                });
            }
        }
    });
    etapa = 2; indexMarmita = 0; render();
};

// --- PASSO 2 ---
function renderPasso2(app) {
    const m = montagem[indexMarmita];
    const carnes = db.cardapio.filter(i => i.status && i.tipo === 'carne');
    const acomp = db.cardapio.filter(i => i.status && i.tipo === 'acomp');
    
    app.innerHTML = `
        <div class="mb-4 text-center">
            <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase">Marmita ${indexMarmita + 1} de ${montagem.length}</span>
            <h2 class="text-2xl font-black uppercase mt-2">${m.nome}</h2>
            <p class="text-zinc-500 font-bold text-xs uppercase">Escolha até ${m.maxC} carne(s)</p>
        </div>
        <div class="secao-titulo">Carnes (${m.cSel}/${m.maxC})</div>
        <div class="grid grid-cols-1 gap-2 mb-4">
            ${carnes.map(i => `<div onclick="toggleComida('${i.nome}', 'carne')" class="item-vai-nao ${m.itens.includes(i.nome) ? 'selected' : ''}"><span>${i.nome}</span><b>${m.itens.includes(i.nome)?'VAI':'NÃO'}</b></div>`).join('')}
        </div>
        <div class="secao-titulo">Acompanhamentos</div>
        <div class="grid grid-cols-1 gap-2">
            ${acomp.map(i => `<div onclick="toggleComida('${i.nome}', 'acomp')" class="item-vai-nao ${m.itens.includes(i.nome) ? 'selected' : ''}"><span>${i.nome}</span><b>${m.itens.includes(i.nome)?'VAI':'NÃO'}</b></div>`).join('')}
        </div>
        <div class="sticky-footer">
            <button onclick="proxM()" class="btn-yellow">${indexMarmita + 1 === montagem.length ? 'Ir para Bebidas ➜' : 'Próxima Marmita ➜'}</button>
        </div>`;
}

window.toggleComida = (n, t) => {
    const m = montagem[indexMarmita];
    if (m.itens.includes(n)) {
        if (t === 'carne') m.cSel--;
        m.itens = m.itens.filter(x => x !== n);
    } else {
        if (t === 'carne' && m.cSel >= m.maxC) return alert("Limite de carnes atingido!");
        if (t === 'carne') m.cSel++;
        m.itens.push(n);
    }
    render();
};

window.proxM = () => {
    if (indexMarmita + 1 < montagem.length) {
        indexMarmita++; render();
    } else {
        etapa = 3; render();
    }
};

// --- PASSO 3 ---
function renderPasso3(app) {
    let html = `<h2 class="text-xl font-black uppercase mb-6 text-center">Bebidas e Extras</h2><div class="space-y-3">`;
    db.extras.filter(e => e.status).forEach(e => {
        let item = carrinhoExtras.find(c => c.nome === e.nome);
        let qtd = item ? item.qty : 0;
        html += `
        <div class="card p-4 flex items-center gap-4">
            <div class="flex-1"><b class="uppercase text-base">${e.nome}</b><br><span class="text-yellow-500 font-black text-lg">${moeda(e.preco)}</span></div>
            <div class="flex items-center gap-3">
                <button onclick="addExtra('${e.nome}', -1)" class="bg-zinc-800 w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center">-</button>
                <span class="font-black text-lg w-6 text-center">${qtd}</span>
                <button onclick="addExtra('${e.nome}', 1)" class="bg-zinc-800 w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center">+</button>
            </div>
        </div>`;
    });
    html += `</div><div class="sticky-footer"><button onclick="etapa=4;render()" class="btn-yellow">Ir para Pagamento ➜</button></div>`;
    app.innerHTML = html;
}

window.addExtra = (n, v) => {
    let it = carrinhoExtras.find(c => c.nome == n);
    if (!it && v > 0) {
        carrinhoExtras.push({ nome: n, qty: 1 });
    } else if (it) {
        it.qty += v;
        if (it.qty <= 0) carrinhoExtras = carrinhoExtras.filter(c => c.nome != n);
    }
    render();
};

// --- PASSO 4 ---
function renderPasso4(app) {
    let total = montagem.reduce((a, b) => a + b.preco, 0);
    carrinhoExtras.forEach(c => { 
        const ex = db.extras.find(e => e.nome === c.nome); 
        if(ex) total += (ex.preco * c.qty); 
    });

    app.innerHTML = `
        <h2 class="text-xl font-black uppercase mb-6 text-center">Finalizar Pedido</h2>
        <div class="space-y-4">
            <input id="cli_n" placeholder="Seu Nome">
            <input id="cli_e" placeholder="Endereço de Entrega">
            <select id="cli_p"><option>Pix</option><option>Dinheiro</option><option>Cartão</option></select>
        </div>
        <div class="p-8 card text-center my-6 border-yellow-500/30">
            <p class="text-zinc-500 text-xs uppercase font-bold">Total a Pagar</p>
            <h3 class="text-5xl font-black text-yellow-500">${moeda(total)}</h3>
        </div>
        <button onclick="enviarZap('${total}')" class="btn-yellow !py-6 text-xl">Enviar no WhatsApp</button>`;
}

// --- FUNÇÕES AUX ---
function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

window.enviarZap = (total) => {
    const n = document.getElementById('cli_n').value, e = document.getElementById('cli_e').value, p = document.getElementById('cli_p').value;
    if(!n || !e) return alert("Preencha nome e endereço!");
    
    const d = new Date().toLocaleDateString(), h = new Date().toLocaleTimeString().slice(0,5);
    
    let msg = `------------------------- \n***QUENTINHA DA LU***\n------------------------- \n\nPedido n ${db.config.pedidoAtual} \nCliente: ${n} \n\n${d} Hora: ${h} \n\nForma de Pagamento: "${p}" \nEndereço: "${e}" \n`;
    
    montagem.forEach((m, idx) => { 
        msg += `\nMARMITA ${idx+1} (${m.nome.toUpperCase()}) \n------------------------- \n${m.itens.join('\n')} \n`; 
    });
    
    if(carrinhoExtras.length > 0) {
        msg += `\n------------------------- \nBEBIDAS / EXTRAS \n`;
        carrinhoExtras.forEach(c => { msg += `${c.qty}x ${c.nome}\n`; });
    }
    
    msg += `\n------------------------- \nTotal:${moeda(parseFloat(total))}\n\n***OBRIGADO PELA PREFERÊNCIA, VOLTE SEMPRE!!!***`;
    
    db.config.lucroTotal += parseFloat(total); 
    db.config.pedidoAtual++; 
    saveToDisk();
    
    const msgLimpa = removerAcentos(msg);
    window.open(`https://wa.me/${db.config.tel}?text=${encodeURIComponent(msgLimpa)}`);
    location.reload();
};

// ---- CHAMADA INICIAL ----
render(); // <<< ESSENCIAL para carregar a primeira tela

