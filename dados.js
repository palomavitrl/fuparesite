// Aguarda o carregamento completo do HTML para rodar o script
document.addEventListener('DOMContentLoaded', function() {
    // Pega a referência do formulário pelo seu ID
    const dataForm = document.getElementById('dataForm');

    // Adiciona um "ouvinte" para o evento de "submit" (envio) do formulário
    dataForm.addEventListener('submit', function(event) {
        // Previne o comportamento padrão do formulário, que é recarregar a página
        event.preventDefault();

        // Pega os valores digitados pelo usuário nos inputs
        const cigarrosPorDia = document.getElementById('cigarros-dia').value;
        // Substitui vírgula por ponto para garantir que seja um número válido
        const precoMaco = document.getElementById('preco-maco').value.replace(',', '.'); 
        const cigarrosPorMaco = document.getElementById('cigarros-maco').value;
        const diasSemFumar = document.getElementById('dias-sem-fumar').value;

        // --- Lógica Chave ---
        // Calcula a data exata em que o usuário parou de fumar.
        // Isso permite que o progresso continue atualizando sozinho com o passar dos dias.
        const hoje = new Date();
        // Subtrai os dias informados da data de hoje para encontrar a data de início
        const dataParada = new Date(hoje.setDate(hoje.getDate() - parseInt(diasSemFumar)));
        
        // Salva as informações no localStorage do navegador.
        // Os dados ficam guardados mesmo se o navegador for fechado.
        localStorage.setItem('dataParada', dataParada.toISOString()); // Salva como texto padrão ISO
        localStorage.setItem('cigarrosPorDia', cigarrosPorDia);
        localStorage.setItem('precoMaco', precoMaco);
        localStorage.setItem('cigarrosPorMaco', cigarrosPorMaco);

        // Redireciona o usuário para a página de progresso
        window.location.href = 'progresso.html';
    });
});