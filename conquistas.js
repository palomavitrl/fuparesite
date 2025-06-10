document.addEventListener('DOMContentLoaded', function() {
    // --- 1. RECUPERAR DADOS DO USUÁRIO ---
    const dataParadaString = localStorage.getItem('dataParada');
    const cigarrosPorDia = parseFloat(localStorage.getItem('cigarrosPorDia'));
    const precoMaco = parseFloat(localStorage.getItem('precoMaco'));
    const cigarrosPorMaco = parseFloat(localStorage.getItem('cigarrosPorMaco'));

    // --- 2. VERIFICAR SE OS DADOS EXISTEM ---
    if (!dataParadaString || isNaN(cigarrosPorDia) || isNaN(precoMaco) || isNaN(cigarrosPorMaco)) {
        console.error("ERRO: Dados de progresso não encontrados ou inválidos no localStorage. Verifique se os dados foram salvos corretamente na página 'Dados'.");
        // Opcional: Avisar o usuário visualmente
        // alert("Seus dados de progresso não foram encontrados. Por favor, preencha-os novamente.");
        // window.location.href = 'dados.html';
        return; 
    }

    // --- 3. CALCULAR PROGRESSO ATUAL ---
    const dataParada = new Date(dataParadaString);
    const hoje = new Date();
    const diffTempo = hoje.getTime() - dataParada.getTime();
    
    // Progresso total do usuário
    const diasSemFumar = Math.max(0, Math.floor(diffTempo / (1000 * 60 * 60 * 24)));
    const cigarrosEvitados = diasSemFumar * cigarrosPorDia;
    const dinheiroEconomizado = (cigarrosEvitados / cigarrosPorMaco) * precoMaco;

    // --- MENSAGENS DE DEPURAÇÃO (Pressione F12 no navegador para ver) ---
    console.log("--- DADOS DE PROGRESSO ATUAL ---");
    console.log(`Dias sem fumar: ${diasSemFumar}`);
    console.log(`Cigarros evitados: ${cigarrosEvitados}`);
    console.log(`Dinheiro economizado: R$ ${dinheiroEconomizado.toFixed(2)}`);
    console.log("---------------------------------");


    // --- 4. DEFINIR TODAS AS CONQUISTAS POSSÍVEIS ---
    const conquistas = [
        { id: 'conquista-dias-1', tipo: 'dias', valor: 1 }, { id: 'conquista-dias-3', tipo: 'dias', valor: 3 }, { id: 'conquista-dias-7', tipo: 'dias', valor: 7 }, { id: 'conquista-dias-14', tipo: 'dias', valor: 14 }, { id: 'conquista-dias-30', tipo: 'dias', valor: 30 }, { id: 'conquista-dias-90', tipo: 'dias', valor: 90 }, { id: 'conquista-dias-182', tipo: 'dias', valor: 182 }, { id: 'conquista-dias-365', tipo: 'dias', valor: 365 },
        { id: 'conquista-cigarros-10', tipo: 'cigarros', valor: 10 }, { id: 'conquista-cigarros-20', tipo: 'cigarros', valor: 20 }, { id: 'conquista-cigarros-50', tipo: 'cigarros', valor: 50 }, { id: 'conquista-cigarros-100', tipo: 'cigarros', valor: 100 }, { id: 'conquista-cigarros-500', tipo: 'cigarros', valor: 500 }, { id: 'conquista-cigarros-1000', tipo: 'cigarros', valor: 1000 },
        { id: 'conquista-dinheiro-10', tipo: 'dinheiro', valor: 10 }, { id: 'conquista-dinheiro-50', tipo: 'dinheiro', valor: 50 }, { id: 'conquista-dinheiro-100', tipo: 'dinheiro', valor: 100 }, { id: 'conquista-dinheiro-500', tipo: 'dinheiro', valor: 500 },
        { id: 'conquista-saude-pulmao', tipo: 'dias', valor: 1 }, { id: 'conquista-saude-paladar', tipo: 'dias', valor: 2 }, { id: 'conquista-saude-energia', tipo: 'dias', valor: 14 }
    ];

    // --- 5. VERIFICAR CADA CONQUISTA E ATUALIZAR A PÁGINA ---
    conquistas.forEach(conquista => {
        const elemento = document.getElementById(conquista.id);
        if (!elemento) {
            console.warn(`Aviso: Elemento HTML com id '${conquista.id}' não foi encontrado.`);
            return;
        }

        let progressoAtingido = false;

        if (conquista.tipo === 'dias' && diasSemFumar >= conquista.valor) {
            progressoAtingido = true;
        } else if (conquista.tipo === 'cigarros' && cigarrosEvitados >= conquista.valor) {
            progressoAtingido = true;
        } else if (conquista.tipo === 'dinheiro' && dinheiroEconomizado >= conquista.valor) {
            progressoAtingido = true;
        }

        if (progressoAtingido) {
            elemento.classList.remove('locked');
            elemento.classList.add('unlocked');
        } else {
            elemento.classList.remove('unlocked');
            elemento.classList.add('locked');
        }
    });
});