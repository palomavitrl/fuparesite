// progresso.js (CORRIGIDO)

// Aguarda o carregamento completo do HTML para rodar o script
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. RECUPERAR DADOS ---
    const dataParadaString = localStorage.getItem('dataParada');
    const cigarrosPorDia = parseFloat(localStorage.getItem('cigarrosPorDia'));
    const precoMaco = parseFloat(localStorage.getItem('precoMaco'));
    const cigarrosPorMaco = parseFloat(localStorage.getItem('cigarrosPorMaco'));

    if (!dataParadaString || !cigarrosPorDia || !precoMaco || !cigarrosPorMaco) {
        alert("Por favor, preencha seus dados primeiro.");
        window.location.href = 'dados.html';
        return;
    }
    
    const dataParada = new Date(dataParadaString);
    const hoje = new Date();

    // --- 2. CÁLCULO PRINCIPAL ---
    const diffTempo = hoje.getTime() - dataParada.getTime();
    const diasTotaisSemFumar = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
    
    // --- LÓGICA CORRIGIDA ---
    // Agora, o progresso da semana e do mês refletem o acumulado REAL.

    // Para o progresso da semana, usamos o menor valor entre os dias totais e 7.
    const diasParaCalculoSemana = Math.min(diasTotaisSemFumar, 7);
    // Para o progresso do mês, usamos o menor valor entre os dias totais e 30.
    const diasParaCalculoMes = Math.min(diasTotaisSemFumar, 30);


    // --- 3. CÁLCULOS COM A LÓGICA CORRIGIDA ---

    // Cigarros evitados
    const cigarrosEvitadosTotal = diasTotaisSemFumar * cigarrosPorDia;
    const cigarrosEvitadosSemana = diasParaCalculoSemana * cigarrosPorDia;
    const cigarrosEvitadosMes = diasParaCalculoMes * cigarrosPorDia;

    // Dinheiro economizado
    const dinheiroEconomizadoTotal = (cigarrosEvitadosTotal / cigarrosPorMaco) * precoMaco;
    const dinheiroEconomizadoSemana = (cigarrosEvitadosSemana / cigarrosPorMaco) * precoMaco;
    const dinheiroEconomizadoMes = (cigarrosEvitadosMes / cigarrosPorMaco) * precoMaco;
    
    // Tempo de vida recuperado (suposição: 5 minutos por cigarro)
    const minutosRecuperadosTotal = cigarrosEvitadosTotal * 5;
    const minutosRecuperadosSemana = cigarrosEvitadosSemana * 5;
    const minutosRecuperadosMes = cigarrosEvitadosMes * 5;


    // --- 4. FUNÇÃO AUXILIAR PARA FORMATAR TEMPO ---
    function formatarTempo(totalMinutos) {
        if (totalMinutos < 1) return "0 minutos";
        if (totalMinutos < 60) return `${Math.floor(totalMinutos)} minutos`;
        
        const horas = Math.floor(totalMinutos / 60);
        const dias = Math.floor(horas / 24);
        const meses = Math.floor(dias / 30);

        const horasRestantes = horas % 24;
        const diasRestantes = dias % 30;

        let resultado = "";
        if (meses > 0) resultado += `${meses} ${meses > 1 ? 'meses' : 'mês'}, `;
        if (diasRestantes > 0) resultado += `${diasRestantes} ${diasRestantes > 1 ? 'dias' : 'dia'}, `;
        if (horasRestantes > 0) resultado += `${horasRestantes} ${horasRestantes > 1 ? 'horas' : 'hora'}`;
        
        // Remove a vírgula e o espaço no final da string, se houver
        return resultado.replace(/,(\s*)$/, "").trim(); 
    }
    
    // --- 5. ATUALIZAR A PÁGINA ---
    const formatarDinheiro = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Cigarros evitados
    document.getElementById('cigarros-evitados-total').innerText = Math.round(cigarrosEvitadosTotal).toLocaleString('pt-BR');
    document.getElementById('cigarros-evitados-semana').innerText = Math.round(cigarrosEvitadosSemana).toLocaleString('pt-BR');
    document.getElementById('cigarros-evitados-mes').innerText = Math.round(cigarrosEvitadosMes).toLocaleString('pt-BR');
    
    // Dinheiro economizado
    document.getElementById('dinheiro-economizado-total').innerText = formatarDinheiro(dinheiroEconomizadoTotal);
    document.getElementById('dinheiro-economizado-semana').innerText = formatarDinheiro(dinheiroEconomizadoSemana);
    document.getElementById('dinheiro-economizado-mes').innerText = formatarDinheiro(dinheiroEconomizadoMes);

    // Tempo recuperado
    document.getElementById('tempo-recuperado-total').innerText = formatarTempo(minutosRecuperadosTotal);
    document.getElementById('tempo-recuperado-semana').innerText = formatarTempo(minutosRecuperadosSemana);
    document.getElementById('tempo-recuperado-mes').innerText = formatarTempo(minutosRecuperadosMes);
});