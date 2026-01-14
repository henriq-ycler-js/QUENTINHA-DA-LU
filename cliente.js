let carrinhoMarmitas = [], carrinhoExtras = [], etapa = 1, indexMarmita = 0, montagem = [];

function render() {
    const app = document.getElementById('app');
    window.scrollTo(0,0);
    if (etapa === 1) renderPasso1(app);
    else if (etapa === 2) renderPasso2(app);
    else if (etapa === 3) renderPasso3(app);
    else if (etapa === 4) renderPasso4(app);
}

function renderPasso1(app) {
    let html = `<h2 class="text-zinc-500 font-bold text-[10px] uppercase mb-4 text-center tracking-widest">Selecione o Tamanho</h2>`;
    db.tamanhos.filter(t => t.status).forEach(t => {
        let item = carrinhoMarmitas.find(c => String(c.id) === String(t.id));
        let qtd = item ? item.qty : 0;
        
        // Layout ultra-compacto para não cortar no celular
        html += `
        <div class="card">
            <img src="${t.img || 'https://placehold.co/100x100/222/FFF?text=LU'}">
            <div class="card-info">
                <h3>${t.nome}</h3>
                <p>${moeda(t.preco)}</p>
            </div>
            <div class="controles">
                <button onclick="addMarmita('${t.id}', -1)" class="btn-control">-</button>
                <span class="qtd-num">${qtd}</span>
                <button onclick="addMarmita('${t.id}', 1)" class="btn-control">+</button>
            </div>
        </div>`;
    });
    
    let totalM = carrinhoMarmitas.reduce((acc, obj) => acc + obj.qty, 0);
    if (totalM > 0) {
        html += `<div class="sticky-footer"><button onclick="irMontagem()" class="btn-yellow">Montar ${totalM} Marmita(s) ➜</button></div>`;
    }
    app.innerHTML = html;
}

window.addMarmita = (id, v) => {
    let idx = carrinhoMarmitas.findIndex(c => String(c.id) === String(id));
    if (idx > -1) {
        carrinhoMarmitas[idx].qty += v;
        if (carrinhoMarmitas[idx].qty <= 0) carrinhoMarmitas.splice(idx, 1);
    } else if (v > 0) {
        carrinhoMarmitas.push({ id: id, qty: 1 });
    }
    render();
};

window.irMontagem = () => {
    montagem = [];
    carrinhoMarmitas.forEach(c => {
        const t = db.tamanhos.find(x => String(x.id) === String(c.id));
        if(t) for (let i = 0; i < c.qty; i++) montagem.push({ nome: t.nome, preco: t.preco, maxC: t.carnes || 1, itens: [], cSel: 0 });
    });
    etapa = 2; indexMarmita = 0; render();
};

function renderPasso2(app) {
    const m = montagem[indexMarmita];
    const carnes = db.cardapio.filter(i => i.status && i.tipo === 'carne');
    const acomp = db.cardapio.filter(i => i.status && i.tipo === 'acomp');
    app.innerHTML = `
        <div class="text-center mb-4">
            <h2 class="text-xl font-black uppercase">Marmita ${indexMarmita + 1}/${montagem.length}</h2>
            <p class="text-yellow-500 text-[10px] font-bold uppercase">Escolha ${m.maxC} carne(s)</p>
        </div>
        <div class="secao-titulo">Carnes</div>
        <div class="grid grid-cols-1 gap-2 mb-4">${carnes.map(i => `<div onclick="toggleComida('${i.nome}', 'carne')" class="item-vai-nao ${m.itens.includes(i.nome) ? 'selected' : ''}"><span>${i.nome}</span><b>${m.itens.includes(i.nome)?'VAI':'NÃO'}</b></div>`).join('')}</div>
        <div class="secao-titulo">Acompanhamentos</div>
        <div class="grid grid-cols-1 gap-2">${acomp.map(i => `<div onclick="toggleComida('${i.nome}', 'acomp')" class="item-vai-nao ${m.itens.includes(i.nome) ? 'selected' : ''}"><span>${i.nome}</span><b>${m.itens.includes(i.nome)?'VAI':'NÃO'}</b></div>`).join('')}</div>
        <div class="sticky-footer"><button onclick="proxM()" class="btn-yellow">Confirmar</button></div>`;
}

window.toggleComida = (n, t) => {
    const m = montagem[indexMarmita];
    if (m.itens.includes(n)) { if (t === 'carne') m.cSel--; m.itens = m.itens.filter(x => x !== n); }
    else { if (t === 'carne' && m.cSel >= m.maxC) return alert("Limite de carnes!"); if (t === 'carne') m.cSel++; m.itens.push(n); }
    render();
};

window.proxM = () => { if (indexMarmita + 1 < montagem.length) { indexMarmita++; render(); } else { etapa = 3; render(); } };

function renderPasso3(app) {
    let html = `<h2 class="text-xl font-black uppercase mb-6 text-center">Bebidas</h2>`;
    db.extras.filter(e => e.status).forEach(e => {
        let item = carrinhoExtras.find(c => c.nome === e.nome);
        let qtd = item ? item.qty : 0;
        html += `
        <div class="card">
            <div class="card-info"><h3>${e.nome}</h3><p>${moeda(e.preco)}</p></div>
            <div class="controles">
                <button onclick="addExtra('${e.nome}', -1)" class="btn-control">-</button>
                <span class="qtd-num">${qtd}</span>
                <button onclick="addExtra('${e.nome}', 1)" class="btn-control">+</button>
            </div>
        </div>`;
    });
    html += `<div class="sticky-footer"><button onclick="etapa=4;render()" class="btn-yellow">Finalizar ➜</button></div>`;
    app.innerHTML = html;
}

window.addExtra = (n, v) => {
    let it = carrinhoExtras.find(c => c.nome == n);
    if (!it && v > 0) carrinhoExtras.push({ nome: n, qty: 1 });
    else if (it) { it.qty += v; if (it.qty <= 0) carrinhoExtras = carrinhoExtras.filter(c => c.nome != n); }
    render();
};

function renderPasso4(app) {
    let total = montagem.reduce((a, b) => a + b.preco, 0);
    carrinhoExtras.forEach(c => { 
        const ex = db.extras.find(e => e.nome === c.nome); 
        if(ex) total += (ex.preco * c.qty); 
    });

    app.innerHTML = `
        <h2 class="text-2xl font-black uppercase mb-8 text-center text-white">Finalizar Pedido</h2>
        
        <div class="checkout-form">
            <div>
                <label class="label-premium">Quem está pedindo?</label>
                <input id="cli_n" class="input-premium" type="text" placeholder="Seu nome completo">
            </div>

            <div>
                <label class="label-premium">Endereço de Entrega</label>
                <input id="cli_e" class="input-premium" type="text" placeholder="Rua, nº, bairro e referência">
            </div>

            <div>
                <label class="label-premium">Forma de Pagamento</label>
                <select id="cli_p" class="input-premium">
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão de Débito/Crédito</option>
                </select>
            </div>
        </div>

        <div class="resumo-total">
            <p class="text-zinc-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Total a pagar</p>
            <h3 class="text-5xl font-black text-yellow-500">${moeda(total)}</h3>
        </div>

        <div class="sticky-footer">
            <button onclick="enviarZap('${total}')" class="btn-yellow" style="box-shadow: 0 10px 30px rgba(234, 179, 8, 0.3);">
                 Confirmar e Enviar Pedido
            </button>
        </div>
    `;
}

window.enviarZap = (total) => {
    const n = document.getElementById('cli_n').value, e = document.getElementById('cli_e').value, p = document.getElementById('cli_p').value;
    if(!n || !e) return alert("Preencha tudo!");
    let msg = `*PEDIDO #${db.config.pedidoAtual}* \n*CLIENTE:* ${n}\n-------------------------\n`;
    montagem.forEach((m, i) => { msg += `\n*MARMITA ${i+1} (${m.nome})*\n${m.itens.join('\n')}\n`; });
    if(carrinhoExtras.length > 0) { msg += `\n*BEBIDAS:*\n`; carrinhoExtras.forEach(c => { msg += `${c.qty}x ${c.nome}\n`; }); }
    msg += `\n*TOTAL:* ${moeda(parseFloat(total))}\n*PAGAMENTO:* ${p}\n*ENDEREÇO:* ${e}`;
    db.config.pedidoAtual++; saveToDisk();
    window.open(`https://wa.me/${db.config.tel}?text=${encodeURIComponent(msg)}`);
    location.reload();
};
render();

