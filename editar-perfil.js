// editar-perfil.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona todos os elementos necessários para esta página
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

    // --- LÓGICA DE CARREGAMENTO DE DADOS ---
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile) {
        editNomeInput.value = userProfile.nome || '';
        editEmailInput.value = userProfile.email || '';
    }
    const savedPicture = localStorage.getItem('userProfilePicture');
    if (savedPicture) {
        profilePicPreview.src = savedPicture;
    }

    // --- LÓGICA DA FOTO DE PERFIL ---
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

    // --- LÓGICA DE SALVAR/DELETAR PERFIL ---
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

    deleteProfileBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja deletar seu perfil? Esta ação não pode ser desfeita.')) {
            localStorage.clear();
            alert('Perfil deletado.');
            window.location.href = 'index.html';
        }
    });

    // --- LÓGICA DO MODAL DE SENHA ---
    // Abre o modal
    changePasswordBtn.addEventListener('click', () => {
        passwordModal.classList.add('is-visible');
    });

    // Fecha o modal no botão 'X'
    closeModalBtn.addEventListener('click', () => {
        passwordModal.classList.remove('is-visible');
    });

    // Fecha o modal se clicar fora da caixa de conteúdo
    window.addEventListener('click', (event) => {
        if (event.target == passwordModal) {
            passwordModal.classList.remove('is-visible');
        }
    });
    
    // Lógica do formulário dentro do modal
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
});