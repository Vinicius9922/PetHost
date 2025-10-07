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
const usernameSpan = document.querySelector(".username");
const logoutBtn = document.getElementById("logoutBtn");

// Observa mudanças no login
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (guestLinks) guestLinks.style.display = "none";
    if (userInfo) userInfo.classList.remove("hidden");
    if (usernameSpan) usernameSpan.textContent = user.displayName || user.email;
  } else {
    if (guestLinks) guestLinks.style.display = "flex";
    if (userInfo) userInfo.classList.add("hidden");
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

// Login (somente na tela login.html)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("Erro ao logar: " + error.message);
      });
  });
}

// Cadastro (somente na tela cadastro.html)
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Conta criada com sucesso!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("Erro ao cadastrar: " + error.message);
      });
  });
}
