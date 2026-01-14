function render() {
    const app = document.getElementById('app');
    let tempDb = JSON.parse(JSON.stringify(db));

    app.innerHTML = `
        <h2 style="text-align:center; color:var(--primary);">PAINEL ADMINISTRATIVO</h2>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
            <div class="card-adm" style="text-align:center;">
                <small>PEDIDO ATUAL</small>
                <p style="font-size:20px; font-weight:bold;">#${db.config.pedidoAtual}</p>
            </div>
            <div class="card-adm" style="text-align:center;">
                <small>LUCRO TOTAL</small>
                <p style="font-size:20px; font-weight:bold; color:var(--primary);">${moeda(db.config.lucroTotal || 0)}</p>
            </div>
        </div>

        <div class="card-adm">
            <small>TELEFONE WHATSAPP:</small>
            <input type="text" value="${db.config.tel}" oninput="db.config.tel=this.value" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:5px;">
        </div>

        <button onclick="saveToDisk();alert('Salvo!');location.reload()" class="btn-yellow" style="margin-top:20px;">SALVAR CONFIGURAÇÕES</button>
        <button onclick="location.href='index.html'" style="width:100%; background:none; color:#666; border:none; margin-top:15px;">Voltar ao Site</button>
    `;
}
render();
