import { app } from "./firebase-config.js";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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

// Atualizar E-mail
emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newEmail = newEmailField.value;

    if (!newEmail) {
        alert("Por favor, digite o novo e-mail.");
        return;
    }

    // Ações sensíveis (como mudar e-mail) exigem reautenticação
    const password = prompt("Para confirmar, digite sua senha atual:");
    if (!password) return;

    try {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
        
        // Se a reautenticação for bem-sucedida, atualize o e-mail
        await updateEmail(currentUser, newEmail);
        alert("E-mail atualizado com sucesso!");
        emailField.value = newEmail;
        newEmailField.value = "";
    } catch (error) {
        console.error("Erro ao atualizar e-mail:", error.message);
        alert("Erro: " + error.message);
    }
});

// Atualizar Senha
passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = newPasswordField.value;

    if (newPassword.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres.");
        return;
    }
    
    // Ações sensíveis (como mudar senha) exigem reautenticação
    const password = prompt("Para confirmar, digite sua senha ATUAL:");
    if (!password) return;

    try {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);

        // Se a reautenticação for bem-sucedida, atualize a senha
        await updatePassword(currentUser, newPassword);
        alert("Senha atualizada com sucesso!");
        newPasswordField.value = "";
    } catch (error) {
        console.error("Erro ao atualizar senha:", error.message);
        alert("Erro: " + error.message);
    }
});