let carrinhoMarmitas = [], carrinhoExtras = [], etapa = 1, indexMarmita = 0, montagem = [];

function render() {
    const app = document.getElementById('app');
    if (etapa === 1) renderPasso1(app);
    else if (etapa === 2) renderPasso2(app);
    else if (etapa === 3) renderPasso3(app);
    else if (etapa === 4) renderPasso4(app);
}

function renderPasso1(app) {
    let html = `<h2>Escolha o Tamanho</h2>`;
    db.tamanhos.forEach(t => {
        let item = carrinhoMarmitas.find(c => c.id === t.id);
        let qtd = item ? item.qty : 0;
        html += `<div class="card">
            <div><b>${t.nome}</b><br>${moeda(t.preco)}</div>
            <div>
                <button onclick="addMarmita('${t.id}', -1)" class="btn-control">-</button>
                <span style="margin: 0 10px">${qtd}</span>
                <button onclick="addMarmita('${t.id}', 1)" class="btn-control">+</button>
            </div>
        </div>`;
    });
    if (carrinhoMarmitas.length > 0) html += `<div class="sticky-footer"><button onclick="irMontagem()" class="btn-yellow">Montar Marmitas</button></div>`;
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
        for (let i = 0; i < c.qty; i++) montagem.push({ ...t, itens: [] });
    });
    etapa = 2; indexMarmita = 0; render();
};

function renderPasso2(app) {
    const m = montagem[indexMarmita];
    const itens = db.cardapio;
    app.innerHTML = `<h2>Marmita ${indexMarmita + 1}/${montagem.length}</h2>
    ${itens.map(i => `<div onclick="toggleItem('${i.nome}')" class="item-vai-nao ${m.itens.includes(i.nome)?'selected':''}">
        ${i.nome} <b>${m.itens.includes(i.nome)?'VAI':'NÃO'}</b>
    </div>`).join('')}
    <div class="sticky-footer"><button onclick="proxima()" class="btn-yellow">Confirmar</button></div>`;
}

window.toggleItem = (nome) => {
    const m = montagem[indexMarmita];
    if (m.itens.includes(nome)) m.itens = m.itens.filter(x => x !== nome);
    else m.itens.push(nome);
    render();
};

window.proxima = () => {
    if (indexMarmita + 1 < montagem.length) { indexMarmita++; render(); }
    else { etapa = 3; render(); }
};

function renderPasso3(app) {
    let html = `<h2>Bebidas e Extras</h2>`;
    db.extras.forEach(e => {
        let item = carrinhoExtras.find(c => c.nome === e.nome);
        let qtd = item ? item.qty : 0;
        html += `<div class="card">
            <div><b>${e.nome}</b><br>${moeda(e.preco)}</div>
            <div>
                <button onclick="addExtra('${e.nome}', -1)" class="btn-control">-</button>
                <span style="margin: 0 10px">${qtd}</span>
                <button onclick="addExtra('${e.nome}', 1)" class="btn-control">+</button>
            </div>
        </div>`;
    });
    html += `<div class="sticky-footer"><button onclick="etapa=4;render()" class="btn-yellow">Finalizar</button></div>`;
    app.innerHTML = html;
}

window.addExtra = (n, v) => {
    let it = carrinhoExtras.find(c => c.nome == n);
    if (!it && v > 0) carrinhoExtras.push({ nome: n, qty: 1 });
    else if (it) { it.qty += v; if (it.qty <= 0) carrinhoExtras = carrinhoExtras.filter(c => c.nome != n); }
    render();
};

function renderPasso4(app) {
    app.innerHTML = `<h2>Finalizar</h2>
    <input id="n" placeholder="Seu Nome">
    <input id="e" placeholder="Endereço">
    <select id="p"><option>Pix</option><option>Dinheiro</option></select>
    <button onclick="enviar()" class="btn-yellow">Pedir no WhatsApp</button>`;
}

window.enviar = () => {
    const n = document.getElementById('n').value, e = document.getElementById('e').value, p = document.getElementById('p').value;
    let msg = `Novo Pedido: ${n}\nEndereço: ${e}\nPagamento: ${p}`;
    window.open(`https://wa.me/${db.config.tel}?text=${encodeURIComponent(msg)}`);
};

render();
