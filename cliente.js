// ... (mantenha suas funções addMarmita e irMontagem iguais) ...

function renderPasso4(app) {
    let total = montagem.reduce((a, b) => a + b.preco, 0);
    carrinhoExtras.forEach(c => { const ex = db.extras.find(e => e.nome === c.nome); if(ex) total += (ex.preco * c.qty); });

    app.innerHTML = `
        <h2 style="text-align:center; font-weight:900;">FINALIZAR PEDIDO</h2>
        
        <input id="cli_n" class="input-pedido" type="text" placeholder="SEU NOME">
        <input id="cli_e" class="input-pedido" type="text" placeholder="ENDEREÇO DE ENTREGA">
        
        <select id="cli_p" class="input-pedido">
            <option value="" disabled selected>PAGAMENTO</option>
            <option>Pix</option>
            <option>Dinheiro</option>
            <option>Cartão</option>
        </select>

        <div style="background:#111; padding:20px; border-radius:15px; text-align:center; margin:20px 0;">
            <h3 style="font-size:35px; color:#eab308; margin:0;">${moeda(total)}</h3>
        </div>

        <div class="sticky-footer">
            <button onclick="enviarZap('${total}')" class="btn-yellow">🚀 ENVIAR PEDIDO</button>
        </div>`;
}

window.enviarZap = (total) => {
    const n = document.getElementById('cli_n').value;
    const e = document.getElementById('cli_e').value;
    const p = document.getElementById('cli_p').value;

    if (!n || !e) { alert("Nome e Endereço obrigatórios!"); return; }

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
