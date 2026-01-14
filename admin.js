let tempDb = null;

function render() {
    const app = document.getElementById('app');
    if (!tempDb) tempDb = JSON.parse(JSON.stringify(db));
    
    app.innerHTML = `
        <h2 style="text-align:center; font-weight:900; color:var(--primary); margin-bottom:20px;">PAINEL DE CONTROLE</h2>
        
        <div class="stats-grid">
            <div class="stat-card">
                <small>Nº de Pedidos</small>
                <p>#${tempDb.config.pedidoAtual}</p>
            </div>
            <div class="stat-card">
                <small>Lucro Total</small>
                <p>${moeda(tempDb.config.lucroTotal || 0)}</p>
            </div>
        </div>

        <div style="background:#111; padding:15px; border-radius:12px; margin-bottom:20px; border:1px solid #222;">
            <label style="font-size:10px; color:#666; font-weight:bold; text-transform:uppercase;">Seu WhatsApp (Ex: 55839...)</label>
            <input type="text" value="${tempDb.config.tel}" oninput="tempDb.config.tel=this.value" 
                   style="background:black; border:1px solid #333; color:white; width:100%; padding:10px; border-radius:8px; margin-top:5px;">
        </div>

        <h3 style="font-size:12px; text-transform:uppercase; color:#444;">Gerenciar Tamanhos</h3>
        ${tempDb.tamanhos.map((t, idx) => `
            <div style="background:#111; padding:10px; border-radius:10px; margin-bottom:8px; display:flex; align-items:center; gap:10px;">
                <img src="${t.img}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
                <input type="text" value="${t.nome}" oninput="tempDb.tamanhos[${idx}].nome=this.value" style="background:transparent; border:none; color:white; flex:1;">
                <input type="number" value="${t.preco}" oninput="tempDb.tamanhos[${idx}].preco=parseFloat(this.value)" style="background:transparent; border:none; color:var(--primary); width:60px; font-weight:bold;">
                <button onclick="tempDb.tamanhos.splice(${idx},1);render()" style="color:#ff4444; background:none; border:none;">✕</button>
            </div>
        `).join('')}

        <div class="sticky-footer">
            <button onclick="salvarTudo()" class="btn-yellow">💾 Salvar Alterações</button>
        </div>
    `;
}

window.salvarTudo = () => {
    db = JSON.parse(JSON.stringify(tempDb));
    saveToDisk();
    alert("Dados salvos com sucesso!");
    window.location.href = 'index.html';
};

render();
