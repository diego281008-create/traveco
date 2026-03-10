// SISTEMA DE COMPETIÇÃO DE SKATE
class SistemaSkate {
    constructor() {
        this.skatistas = this.carregarDados();
        this.init();
    }

    init() {
        this.atualizarInterface();
        this.configurarEventos();
    }

    configurarEventos() {
        document.getElementById('formSkater').addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarSkatista();
        });

        document.getElementById('limparTodos').addEventListener('click', () => {
            this.limparTodos();
        });
    }

    calcularNotaFinal(notas) {
        const notasOrdenadas = [...notas].sort((a, b) => a - b);
        const notasCentrais = notasOrdenadas.slice(1, -1);
        const soma = notasCentrais.reduce((acc, nota) => acc + nota, 0);
        const media = soma / notasCentrais.length;
        return Math.round(media * 100) / 100;
    }

    adicionarSkatista() {
        const nome = document.getElementById('nome').value.trim().toUpperCase();
        const pais = document.getElementById('pais').value.trim().toUpperCase();
        const idade = parseInt(document.getElementById('idade').value);
        
        const notas = [
            parseFloat(document.getElementById('manobra1').value),
            parseFloat(document.getElementById('manobra2').value),
            parseFloat(document.getElementById('manobra3').value),
            parseFloat(document.getElementById('manobra4').value),
            parseFloat(document.getElementById('manobra5').value)
        ];

        if (!nome || !pais || !idade) {
            this.mostrarNotificacao('❌ PREENCHA TODOS OS CAMPOS!', 'erro');
            return;
        }

        for (let nota of notas) {
            if (isNaN(nota) || nota < 0 || nota > 10) {
                this.mostrarNotificacao('❌ NOTAS DEVEM SER ENTRE 0 E 10!', 'erro');
                return;
            }
        }

        const notaFinal = this.calcularNotaFinal(notas);

        const skatista = {
            id: Date.now(),
            nome,
            pais,
            idade,
            notas,
            notaFinal,
            dataRegistro: new Date().toLocaleDateString('pt-BR')
        };

        this.skatistas.push(skatista);
        this.skatistas.sort((a, b) => b.notaFinal - a.notaFinal);
        this.salvarDados();
        this.atualizarInterface();
        this.limparFormulario();
        this.mostrarNotificacao(`✅ ${nome} CADASTRADO COM ${notaFinal.toFixed(2)} PONTOS!`, 'sucesso');
    }

    removerSkatista(id) {
        const skatista = this.skatistas.find(s => s.id === id);
        this.skatistas = this.skatistas.filter(s => s.id !== id);
        this.salvarDados();
        this.atualizarInterface();
        this.mostrarNotificacao(`✖️ ${skatista.nome} REMOVIDO`, 'info');
    }

    limparTodos() {
        if (this.skatistas.length === 0) return;
        
        if (confirm('🔥 LIMPAR TODOS OS SKATISTAS?')) {
            this.skatistas = [];
            this.salvarDados();
            this.atualizarInterface();
            this.mostrarNotificacao('🔄 PISTA RESETADA!', 'info');
        }
    }

    limparFormulario() {
        document.getElementById('formSkater').reset();
    }

    atualizarInterface() {
        this.atualizarListaSkatistas();
        this.atualizarEstatisticas();
    }

    atualizarListaSkatistas() {
        const container = document.getElementById('listaSkaters');
        
        if (this.skatistas.length === 0) {
            container.innerHTML = `
                <div class="mensagem-vazia">
                    <span>🛹</span>
                    NENHUM SKATISTA CADASTRADO<br>
                    <small>CLIQUE EM DROP IN PARA COMEÇAR!</small>
                </div>
            `;
            return;
        }

        let html = '';
        this.skatistas.forEach((skatista, index) => {
            const posicao = index + 1;
            let medalha = '';
            
            if (posicao === 1) {
                medalha = '👑';
            } else if (posicao === 2) {
                medalha = '🥈';
            } else if (posicao === 3) {
                medalha = '🥉';
            } else {
                medalha = `#${posicao}`;
            }
            
            html += `
                <div class="skater-card" style="animation-delay: ${index * 0.1}s">
                    <div class="skater-info">
                        <div class="skater-nome">
                            ${medalha} ${skatista.nome}
                            <span>${skatista.pais}</span>
                        </div>
                        <div class="skater-detalhes">
                            <span><i>🗓️</i> ${skatista.idade} ANOS</span>
                            <span><i>📅</i> ${skatista.dataRegistro}</span>
                        </div>
                    </div>
                    <div class="skater-pontuacao">
                        <div class="pontuacao-valor">${skatista.notaFinal.toFixed(2)}</div>
                        <div class="pontuacao-label">PTS</div>
                    </div>
                    <button class="btn-deletar" onclick="sistema.removerSkatista(${skatista.id})">
                        ✕
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    atualizarEstatisticas() {
        const total = this.skatistas.length;
        document.getElementById('totalSkaters').innerHTML = `
            <div class="shape-stats" style="background: #5C65C0;"></div>
            <span class="stats-numero" style="color: #fff;">${total}</span>
            <span class="stats-texto" style="color: #fff;">PARTICIPANTE${total !== 1 ? 'S' : ''}</span>
        `;
    }

    mostrarNotificacao(mensagem, tipo) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        const cores = {
            sucesso: '#5C65C0',
            erro: '#ff6b6b',
            info: '#6F95FF'
        };
        
        toast.style.borderLeftColor = cores[tipo] || cores.info;
        toast.textContent = mensagem;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastEntrar 0.3s reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    salvarDados() {
        localStorage.setItem('skatefest_skatistas', JSON.stringify(this.skatistas));
    }

    carregarDados() {
        const dados = localStorage.getItem('skatefest_skatistas');
        return dados ? JSON.parse(dados) : [];
    }
}

// INICIAR SISTEMA
const sistema = new SistemaSkate();
window.sistema = sistema;