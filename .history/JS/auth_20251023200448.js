import { app } from "./firebase-config.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth(app);

// Elementos do header
const guestLinks = document.getElementById("guest-links");
const userInfo = document.getElementById("user-info");
const usernameSpan = document.querySelector("#user-info .username");
const userAvatar = document.querySelector("#user-info .avatar");
const logoutBtn = document.getElementById("logoutBtn");

// Observa mudanças no login
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (guestLinks) guestLinks.style.display = "none";
    if (userInfo) userInfo.style.display = "flex"; // Usar flex para alinhar
    if (usernameSpan) usernameSpan.textContent = user.displayName || user.email;
    
    // Mostra a foto de perfil
    if (userAvatar && user.photoURL) {
      userAvatar.src = user.photoURL;
    } else {
      // Imagem padrão (Data URI para evitar erros de rede)
      userAvatar.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iI2NjYyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiLz48L3N2Zz4=";
    }

  } else {
    if (guestLinks) guestLinks.style.display = "flex";
    if (userInfo) userInfo.style.display = "none";
  }
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });
}

// ==========================================================
// LÓGICA DE LOGIN QUE ESTAVA FALTANDO
// ==========================================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-message");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        if (errorMsg) {
            errorMsg.textContent = "Erro: " + error.message;
        } else {
            alert("Erro ao logar: " + error.message);
        }
      });
  });
}

// ==========================================================
// LÓGICA DE CADASTRO QUE TAMBÉM ESTAVA FALTANDO
// (Importante para o auth.js original)
// ==========================================================
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  // Nota: Isso pode conflitar com o script da página cadastro.html.
  // Estamos apenas restaurando o auth.js ao seu estado original.
  cadastroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-message");

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Conta criada com sucesso!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        if (errorMsg) {
            errorMsg.textContent = "Erro: " + error.message;
        } else {
            alert("Erro ao cadastrar: " + error.message);
        }
      });
  });
}