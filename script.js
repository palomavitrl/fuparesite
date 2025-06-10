document.addEventListener('DOMContentLoaded', function() {

    // --- SCRIPT ANTI-FLASH MODO ESCURO (LEMBRETE: este deve estar no <head> de cada HTML) ---
    // A lógica para o toggle está na seção de Configurações abaixo.
    
    // --- LÓGICA DE CONTROLE DE FLUXO (Executada em todas as páginas) ---
    const setupCompleto = localStorage.getItem('setupCompleto');
    if (setupCompleto === 'true' && window.location.pathname.endsWith('dados.html')) {
        window.location.href = 'progresso.html';
    }

    // --- LÓGICA DA PÁGINA DE CADASTRO ---
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email-cadastro').value;
            const senha = document.getElementById('senha-cadastro').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }
            
            localStorage.clear();
            const userProfile = { nome: nome, email: email };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            
            alert('Cadastro realizado com sucesso! Agora preencha alguns dados sobre seus hábitos.');
            window.location.href = 'dados.html';
        });
    }

    // --- LÓGICA DA PÁGINA DE LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (localStorage.getItem('setupCompleto') === 'true') {
                window.location.href = 'progresso.html';
            } else {
                alert('Login bem-sucedido! Por favor, preencha seus dados iniciais.');
                window.location.href = 'dados.html';
            }
        });
    }

    // --- LÓGICA DA PÁGINA DE DADOS ---
    const dataForm = document.getElementById('dataForm');
    if (dataForm) {
        dataForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const cigarrosPorDia = document.getElementById('cigarros-dia').value;
            const precoMaco = document.getElementById('preco-maco').value.replace(',', '.');
            const cigarrosPorMaco = document.getElementById('cigarros-maco').value;
            const diasSemFumar = document.getElementById('dias-sem-fumar').value;

            const hoje = new Date();
            const dataParada = new Date(hoje.setDate(hoje.getDate() - parseInt(diasSemFumar)));
            
            localStorage.setItem('dataParada', dataParada.toISOString());
            localStorage.setItem('cigarrosPorDia', cigarrosPorDia);
            localStorage.setItem('precoMaco', precoMaco);
            localStorage.setItem('cigarrosPorMaco', cigarrosPorMaco);
            localStorage.setItem('setupCompleto', 'true');
            
            alert('Dados salvos! Bem-vindo à sua jornada!');
            window.location.href = 'progresso.html';
        });
    }

    // --- LÓGICA DA PÁGINA DE PROGRESSO ---
    if (document.body.classList.contains('page-progresso')) {
        const dataParadaString = localStorage.getItem('dataParada');
        const cigarrosPorDia = parseFloat(localStorage.getItem('cigarrosPorDia'));
        const precoMaco = parseFloat(localStorage.getItem('precoMaco'));
        const cigarrosPorMaco = parseFloat(localStorage.getItem('cigarrosPorMaco'));

        if (!dataParadaString || isNaN(cigarrosPorDia) || isNaN(precoMaco) || isNaN(cigarrosPorMaco)) {
            alert("Dados de progresso não encontrados. Por favor, faça o login.");
            window.location.href = 'index.html'; 
            return;
        }
        
        const dataParada = new Date(dataParadaString);
        const hoje = new Date();
        const diffTempo = hoje.getTime() - dataParada.getTime();
        const diasTotaisSemFumar = Math.max(0, Math.floor(diffTempo / (1000 * 60 * 60 * 24)));
        const diasParaCalculoSemana = Math.min(diasTotaisSemFumar, 7);
        const diasParaCalculoMes = Math.min(diasTotaisSemFumar, 30);
        const cigarrosEvitadosTotal = diasTotaisSemFumar * cigarrosPorDia;
        const cigarrosEvitadosSemana = diasParaCalculoSemana * cigarrosPorDia;
        const cigarrosEvitadosMes = diasParaCalculoMes * cigarrosPorDia;
        const dinheiroEconomizadoTotal = (cigarrosEvitadosTotal / cigarrosPorMaco) * precoMaco;
        const dinheiroEconomizadoSemana = (cigarrosEvitadosSemana / cigarrosPorMaco) * precoMaco;
        const dinheiroEconomizadoMes = (cigarrosEvitadosMes / cigarrosPorMaco) * precoMaco;
        const minutosRecuperadosTotal = cigarrosEvitadosTotal * 5;
        const minutosRecuperadosSemana = diasParaCalculoSemana * 5;
        const minutosRecuperadosMes = diasParaCalculoMes * 5;

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
            return resultado.replace(/,(\s*)$/, "").trim();
        }
        
        const formatarDinheiro = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        document.getElementById('cigarros-evitados-total').innerText = Math.round(cigarrosEvitadosTotal).toLocaleString('pt-BR');
        document.getElementById('cigarros-evitados-semana').innerText = Math.round(cigarrosEvitadosSemana).toLocaleString('pt-BR');
        document.getElementById('cigarros-evitados-mes').innerText = Math.round(cigarrosEvitadosMes).toLocaleString('pt-BR');
        document.getElementById('dinheiro-economizado-total').innerText = formatarDinheiro(dinheiroEconomizadoTotal);
        document.getElementById('dinheiro-economizado-semana').innerText = formatarDinheiro(dinheiroEconomizadoSemana);
        document.getElementById('dinheiro-economizado-mes').innerText = formatarDinheiro(dinheiroEconomizadoMes);
        document.getElementById('tempo-recuperado-total').innerText = formatarTempo(minutosRecuperadosTotal);
        document.getElementById('tempo-recuperado-semana').innerText = formatarTempo(minutosRecuperadosSemana);
        document.getElementById('tempo-recuperado-mes').innerText = formatarTempo(minutosRecuperadosMes);
    }

    // --- LÓGICA DA PÁGINA DE CONQUISTAS ---
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (achievementsGrid) {
        const dataParadaString = localStorage.getItem('dataParada');
        const cigarrosPorDia = parseFloat(localStorage.getItem('cigarrosPorDia'));
        const precoMaco = parseFloat(localStorage.getItem('precoMaco'));
        const cigarrosPorMaco = parseFloat(localStorage.getItem('cigarrosPorMaco'));
        if (!dataParadaString) return;

        const dataParada = new Date(dataParadaString);
        const hoje = new Date();
        const diffTempo = hoje.getTime() - dataParada.getTime();
        const diasSemFumar = Math.max(0, Math.floor(diffTempo / (1000 * 60 * 60 * 24)));
        const cigarrosEvitados = diasSemFumar * cigarrosPorDia;
        const dinheiroEconomizado = (cigarrosEvitados / cigarrosPorMaco) * precoMaco;

        const conquistas = [
            { id: 'conquista-dias-1', tipo: 'dias', valor: 1 }, { id: 'conquista-dias-3', tipo: 'dias', valor: 3 }, { id: 'conquista-dias-7', tipo: 'dias', valor: 7 }, { id: 'conquista-dias-14', tipo: 'dias', valor: 14 }, { id: 'conquista-dias-30', tipo: 'dias', valor: 30 }, { id: 'conquista-dias-90', tipo: 'dias', valor: 90 }, { id: 'conquista-dias-182', tipo: 'dias', valor: 182 }, { id: 'conquista-dias-365', tipo: 'dias', valor: 365 },
            { id: 'conquista-cigarros-10', tipo: 'cigarros', valor: 10 }, { id: 'conquista-cigarros-20', tipo: 'cigarros', valor: 20 }, { id: 'conquista-cigarros-50', tipo: 'cigarros', valor: 50 }, { id: 'conquista-cigarros-100', tipo: 'cigarros', valor: 100 }, { id: 'conquista-cigarros-500', tipo: 'cigarros', valor: 500 }, { id: 'conquista-cigarros-1000', tipo: 'cigarros', valor: 1000 },
            { id: 'conquista-dinheiro-10', tipo: 'dinheiro', valor: 10 }, { id: 'conquista-dinheiro-50', tipo: 'dinheiro', valor: 50 }, { id: 'conquista-dinheiro-100', tipo: 'dinheiro', valor: 100 }, { id: 'conquista-dinheiro-500', tipo: 'dinheiro', valor: 500 },
            { id: 'conquista-saude-pulmao', tipo: 'dias', valor: 1 }, { id: 'conquista-saude-paladar', tipo: 'dias', valor: 2 }, { id: 'conquista-saude-energia', tipo: 'dias', valor: 14 }
        ];

        conquistas.forEach(conquista => {
            const elemento = document.getElementById(conquista.id);
            if (!elemento) return;
            let progressoAtingido = false;
            if (conquista.tipo === 'dias' && diasSemFumar >= conquista.valor) progressoAtingido = true;
            else if (conquista.tipo === 'cigarros' && cigarrosEvitados >= conquista.valor) progressoAtingido = true;
            else if (conquista.tipo === 'dinheiro' && dinheiroEconomizado >= conquista.valor) progressoAtingido = true;
            if (progressoAtingido) {
                elemento.classList.add('unlocked');
            } else {
                elemento.classList.add('locked');
            }
        });
    }

    // --- LÓGICA DA PÁGINA DE COMUNIDADE ---
    const communityTabs = document.querySelector('.community-tabs');
    if (communityTabs) {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile && document.getElementById('mentionName')) {
            document.getElementById('mentionName').textContent = `@${userProfile.nome}`;
        }
        const tabs = document.querySelectorAll('.tab-link');
        const contents = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.target;
                const targetContent = document.getElementById(targetId);
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => { c.classList.remove('active'); c.style.display = 'none'; });
                tab.classList.add('active');
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.style.display = 'block';
                }
            });
        });
        const messageInputArea = document.querySelector('.message-input-area');
        if (messageInputArea) {
            const chatWindow = document.querySelector('#chatContent .chat-window');
            const messageInput = messageInputArea.querySelector('input');
            const sendButton = messageInputArea.querySelector('button');
            sendButton.addEventListener('click', () => {
                const messageText = messageInput.value.trim();
                if (messageText && chatWindow) {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('chat-message');
                    messageElement.innerHTML = `<div class="avatar" style="background-color: #FFA726; color: white;">${userProfile ? userProfile.nome.charAt(0) : 'V'}</div><div class="message-content"><strong>${userProfile ? userProfile.nome : 'Você'}</strong><p>${messageText}</p></div>`;
                    chatWindow.appendChild(messageElement);
                    messageInput.value = '';
                    chatWindow.scrollTop = chatWindow.scrollHeight;
                }
            });
        }
        const friendSearchBtn = document.getElementById('friendSearchBtn');
        const friendSearchInput = document.getElementById('friendSearchInput');
        const friendSearchResult = document.getElementById('friendSearchResult');
        if (friendSearchBtn) {
            friendSearchBtn.addEventListener('click', () => {
                const friendName = friendSearchInput.value.trim();
                if (friendName === "") {
                    friendSearchResult.innerHTML = `<p class="error-message">Por favor, digite um nome para procurar.</p>`;
                } else {
                    friendSearchResult.innerHTML = `<p class="error-message">Usuário "${friendName}" não encontrado.</p>`;
                }
                setTimeout(() => {
                    friendSearchResult.innerHTML = '';
                }, 4000);
            });
        }
    }

    // --- LÓGICA DA PÁGINA DE CONFIGURAÇÕES ---
    if (document.body.classList.contains('page-configuracoes')) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            if (localStorage.getItem('darkMode') === 'enabled') {
                darkModeToggle.checked = true;
            }
            darkModeToggle.addEventListener('change', () => {
                if (darkModeToggle.checked) {
                    document.documentElement.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'disabled');
                }
            });
        }

        const helpBtn = document.getElementById('helpBtn');
        const aboutBtn = document.getElementById('aboutBtn');
        const privacyBtn = document.getElementById('privacyBtn');
        const helpModal = document.getElementById('helpModal');
        const aboutModal = document.getElementById('aboutModal');
        const privacyModal = document.getElementById('privacyModal');
        const closeButtons = document.querySelectorAll('.modal .close-button');

        function openModal(modal) {
            if (modal) modal.classList.add('is-visible');
        }
        function closeModal() {
            document.querySelectorAll('.modal.is-visible').forEach(modal => {
                modal.classList.remove('is-visible');
            });
        }

        if(helpBtn) helpBtn.addEventListener('click', () => openModal(helpModal));
        if(aboutBtn) aboutBtn.addEventListener('click', () => openModal(aboutModal));
        if(privacyBtn) privacyBtn.addEventListener('click', () => openModal(privacyModal));
        
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                closeModal();
            }
        });
    }
    
    // --- LÓGICA DA PÁGINA DE EDITAR PERFIL ---
    if (document.body.classList.contains('page-editar-perfil')) {
        const editProfileForm = document.getElementById('editProfileForm');
        const editNomeInput = document.getElementById('editNome');
        const editEmailInput = document.getElementById('editEmail');
        const deleteProfileBtn = document.getElementById('deleteProfileBtn');
        const profilePicInput = document.getElementById('profilePicInput');
        const profilePicPreview = document.getElementById('profilePicPreview');
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const passwordModal = document.getElementById('passwordModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const passwordChangeForm = document.getElementById('passwordChangeForm');

        // Carregar dados existentes
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile) {
            editNomeInput.value = userProfile.nome || '';
            editEmailInput.value = userProfile.email || '';
        }
        const savedPicture = localStorage.getItem('userProfilePicture');
        if (savedPicture) {
            profilePicPreview.src = savedPicture;
        }

        // Lógica para mudar a foto
        profilePicInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePicPreview.src = e.target.result;
                    localStorage.setItem('userProfilePicture', e.target.result);
                }
                reader.readAsDataURL(file);
            }
        });

        // Lógica para salvar alterações de nome/email
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const updatedProfile = {
                nome: editNomeInput.value,
                email: editEmailInput.value
            };
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            alert('Perfil atualizado com sucesso!');
            window.location.href = 'configuracoes.html';
        });

        // Lógica para deletar o perfil
        deleteProfileBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja deletar seu perfil? Esta ação não pode ser desfeita.')) {
                localStorage.clear();
                alert('Perfil deletado.');
                window.location.href = 'index.html';
            }
        });

        // Lógica do Modal de Senha
        if (changePasswordBtn && passwordModal && closeModalBtn && passwordChangeForm) {
            changePasswordBtn.addEventListener('click', () => {
                passwordModal.classList.add('is-visible');
            });
            closeModalBtn.addEventListener('click', () => {
                passwordModal.classList.remove('is-visible');
            });
            window.addEventListener('click', (event) => {
                if (event.target == passwordModal) {
                    passwordModal.classList.remove('is-visible');
                }
            });
            passwordChangeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newPassword = document.getElementById('newPassword').value;
                const confirmNewPassword = document.getElementById('confirmNewPassword').value;
                if (!newPassword || !confirmNewPassword) {
                    alert('Por favor, preencha todos os campos de senha.');
                    return;
                }
                if (newPassword !== confirmNewPassword) {
                    alert('As novas senhas não coincidem!');
                    return;
                }
                alert('Senha alterada com sucesso!');
                passwordModal.classList.remove('is-visible');
                passwordChangeForm.reset();
            });
        }
    }
});