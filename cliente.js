let carrinhoMarmitas = [], carrinhoExtras = [], etapa = 1, indexMarmita = 0, montagem = [];

function render() {
    const app = document.getElementById('app');
    if (etapa === 1) renderPasso1(app);
    else if (etapa === 2) renderPasso2(app);
    else if (etapa === 3) renderPasso3(app);
    else if (etapa === 4) renderPasso4(app);
}

// PASSO 1: ESCOLHA DO TAMANHO
function renderPasso1(app) {
    let html = `<h2 style="text-align:center; font-weight:900; margin-bottom:20px;">CARDÁPIO DE HOJE</h2>`;
    db.tamanhos.forEach(t => {
        let item = carrinhoMarmitas.find(c => c.id === t.id);
        let qtd = item ? item.qty : 0;
        html += `
        <div class="card">
            <img src="${t.img || 'https://placehold.co/100x100/222/FFF?text=LU'}">
            <div class="card-info">
                <h3>${t.nome}</h3>
                <p>${moeda(t.preco)}</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button onclick="addMarmita('${t.id}', -1)" class="btn-control">-</button>
                <span style="font-weight:900;">${qtd}</span>
                <button onclick="addMarmita('${t.id}', 1)" class="btn-control">+</button>
            </div>
        </div>`;
    });
    if (carrinhoMarmitas.length > 0) {
        html += `<div class="sticky-footer"><button onclick="irMontagem()" class="btn-yellow">Montar Marmitas</button></div>`;
    }
    app.innerHTML = html;
}

window.addMarmita = (id, v) => {
    let idx = carrinhoMarmitas.findIndex(c => c.id === id);
    if (idx > -1) {
        carrinhoMarmitas[idx].qty += v;
        if (carrinhoMarmitas[idx].qty <= 0) carrinhoMarmitas.splice(idx, 1);
    } else if (v > 0) carrinhoMarmitas.push({ id, qty: 1 });
    render();
};

window.irMontagem = () => {
    montagem = [];
    carrinhoMarmitas.forEach(c => {
        const t = db.tamanhos.find(x => x.id === c.id);
        for (let i = 0; i < c.qty; i++) {
            montagem.push({ ...t, itens: [], cSel: 0 });
        }
    });
    etapa = 2; indexMarmita = 0; render();
};

// PASSO 2: MONTAR MARMITA (CARNES E ACOMPANHAMENTOS)
function renderPasso2(app) {
    const m = montagem[indexMarmita];
    const carnes = db.cardapio.filter(i => i.tipo === 'carne');
    const acomp = db.cardapio.filter(i => i.tipo === 'acomp');

    app.innerHTML = `
        <h2 style="text-align:center; font-weight:900;">Marmita ${indexMarmita + 1} de ${montagem.length}</h2>
        <p style="text-align:center; color:#666; font-size:12px;">Selecione suas opções abaixo:</p>

        <div class="secao-titulo">Carnes (Máx: ${m.carnes})</div>
        ${carnes.map(i => `
            <div onclick="toggleItem('${i.nome}', 'carne')" class="item-comida ${m.itens.includes(i.nome) ? 'selected' : ''}">
                <span>${i.nome}</span>
                <div class="check-circle"></div>
            </div>
        `).join('')}

        <div class="secao-titulo">Acompanhamentos</div>
        ${acomp.map(i => `
            <div onclick="toggleItem('${i.nome}', 'acomp')" class="item-comida ${m.itens.includes(i.nome) ? 'selected' : ''}">
                <span>${i.nome}</span>
                <div class="check-circle"></div>
            </div>
        `).join('')}

        <div class="sticky-footer">
            <button onclick="proxima()" class="btn-yellow">Confirmar Marmita</button>
        </div>
    `;
}

window.toggleItem = (nome, tipo) => {
    const m = montagem[indexMarmita];
    if (m.itens.includes(nome)) {
        m.itens = m.itens.filter(x => x !== nome);
        if (tipo === 'carne') m.cSel--;
    } else {
        if (tipo === 'carne' && m.cSel >= m.carnes) {
            alert(`Você só pode escolher ${m.carnes} carne(s)!`);
            return;
        }
        m.itens.push(nome);
        if (tipo === 'carne') m.cSel++;
    }
    render();
};

window.proxima = () => {
    if (indexMarmita + 1 < montagem.length) { indexMarmita++; render(); }
    else { etapa = 3; render(); }
};

// PASSO 3: BEBIDAS
function renderPasso3(app) {
    let html = `<h2 style="text-align:center; font-weight:900;">Bebidas e Extras</h2>`;
    db.extras.forEach(e => {
        let item = carrinhoExtras.find(c => c.nome === e.nome);
        let qtd = item ? item.qty : 0;
        html += `
        <div class="card">
            <div class="card-info"><h3>${e.nome}</h3><p>${moeda(e.preco)}</p></div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button onclick="addExtra('${e.nome}', -1)" class="btn-control">-</button>
                <span style="font-weight:900;">${qtd}</span>
                <button onclick="addExtra('${e.nome}', 1)" class="btn-control">+</button>
            </div>
        </div>`;
    });
    html += `<div class="sticky-footer"><button onclick="etapa=4;render()" class="btn-yellow">Finalizar Pedido</button></div>`;
    app.innerHTML = html;
}

window.addExtra = (n, v) => {
    let it = carrinhoExtras.find(c => c.nome == n);
    if (!it && v > 0) carrinhoExtras.push({ nome: n, qty: 1 });
    else if (it) { it.qty += v; if (it.qty <= 0) carrinhoExtras = carrinhoExtras.filter(c => c.nome != n); }
    render();
};

// PASSO 4: FINALIZAR (CAMPOS BRANCOS COM LETRAS PRETAS)
function renderPasso4(app) {
    let total = montagem.reduce((a, b) => a + b.preco, 0);
    carrinhoExtras.forEach(c => { const ex = db.extras.find(e => e.nome === c.nome); if(ex) total += (ex.preco * c.qty); });

    app.innerHTML = `
        <h2 style="text-align:center; font-weight:900; margin-bottom:20px;">FINALIZAR</h2>
        
        <input id="cli_n" class="input-pedido" type="text" placeholder="SEU NOME">
        <input id="cli_e" class="input-pedido" type="text" placeholder="ENDEREÇO DE ENTREGA">
        
        <select id="cli_p" class="input-pedido">
            <option value="" disabled selected>PAGAMENTO</option>
            <option>Pix</option>
            <option>Dinheiro</option>
            <option>Cartão</option>
        </select>

        <div style="background:#111; padding:20px; border-radius:15px; text-align:center; margin:20px 0;">
            <p style="color:#666; font-size:10px; font-weight:bold;">TOTAL</p>
            <h3 style="font-size:35px; color:#eab308; margin:0; font-weight:900;">${moeda(total)}</h3>
        </div>

        <div class="sticky-footer">
            <button onclick="enviarZap('${total}')" class="btn-yellow">🚀 Enviar Pedido</button>
        </div>`;
}

// MENSAGEM ORIGINAL DO WHATSAPP
window.enviarZap = (total) => {
    const n = document.getElementById('cli_n').value;
    const e = document.getElementById('cli_e').value;
    const p = document.getElementById('cli_p').value;

    if (!n || !e) { alert("Preencha nome e endereço!"); return; }

    let msg = `*NOVO PEDIDO - #${db.config.pedidoAtual}*\n\n`;
    msg += `*Cliente:* ${n}\n`;
    msg += `*Endereço:* ${e}\n`;
    msg += `*Pagamento:* ${p}\n\n`;
    msg += `*--- ITENS ---*\n`;

    montagem.forEach((m, i) => {
        msg += `\n*${i + 1}. ${m.nome}*\n- ${m.itens.join('\n- ')}\n`;
    });

    if (carrinhoExtras.length > 0) {
        msg += `\n*Extras:*\n`;
        carrinhoExtras.forEach(ex => { msg += `- ${ex.qty}x ${ex.nome}\n`; });
    }

    msg += `\n*TOTAL: ${moeda(parseFloat(total))}*`;

    db.config.pedidoAtual++;
    db.config.lucroTotal += parseFloat(total);
    saveToDisk();

    window.open(`https://wa.me/${db.config.tel}?text=${encodeURIComponent(msg)}`);
    window.location.reload();
};

render();
