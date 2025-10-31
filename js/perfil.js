import { app } from "./firebase-config.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider,
    verifyBeforeUpdateEmail // Nova função importada
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth(app);

// Campos do Formulário
const emailField = document.getElementById("email");
const newEmailField = document.getElementById("newEmail");
const newPasswordField = document.getElementById("newPassword");
const emailForm = document.getElementById("emailForm");
const passwordForm = document.getElementById("passwordForm");

let currentUser;

// Observador para pegar o usuário logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        emailField.value = user.email;
    } else {
        window.location.href = "login.html";
    }
});

// ==========================================================
// ATUALIZAR E-MAIL (FLUXO MODIFICADO)
// ==========================================================
emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newEmail = newEmailField.value;

    if (!newEmail || newEmail === currentUser.email) {
        alert("Por favor, digite um novo e-mail válido.");
        return;
    }

    try {
        // 1. Chamar a função de verificação
        await verifyBeforeUpdateEmail(currentUser, newEmail);

        // 2. Informar o usuário
        alert(`Um link de verificação foi enviado para ${newEmail}. Por favor, clique no link para completar a alteração do seu e-mail.`);
        
        newEmailField.value = "";
        
    } catch (error) {
        console.error("Erro ao enviar verificação de e-mail:", error.message);
        
        // Se o erro for 'auth/requires-recent-login', pedimos a senha
        if (error.code === 'auth/requires-recent-login') {
            alert("Esta é uma operação sensível. Por favor, digite sua senha atual para confirmar.");
            
            const password = prompt("Digite sua senha atual:");
            if (!password) return;

            try {
                const credential = EmailAuthProvider.credential(currentUser.email, password);
                // Reautentica
                await reauthenticateWithCredential(currentUser, credential);
                // Tenta enviar o e-mail de verificação novamente
                await verifyBeforeUpdateEmail(currentUser, newEmail);
                
                alert(`Um link de verificação foi enviado para ${newEmail}. Por favor, clique no link para completar a alteração do seu e-mail.`);
                newEmailField.value = "";

            } catch (reauthError) {
                alert("Erro ao reautenticar: " + reauthError.message);
            }
            
        } else {
            alert("Erro: " + error.message);
        }
    }
});

// ==========================================================
// ATUALIZAR SENHA (Permanece igual e funcional)
// ==========================================================
passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = newPasswordField.value;

    if (newPassword.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres.");
        return;
    }
    
    const password = prompt("Para confirmar, digite sua senha ATUAL:");
    if (!password) return;

    try {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);

        await updatePassword(currentUser, newPassword);
        alert("Senha atualizada com sucesso!");
        newPasswordField.value = "";
    } catch (error) {
        console.error("Erro ao atualizar senha:", error.message);
        alert("Erro: " + error.message);
    }
});