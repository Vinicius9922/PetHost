import { app } from "./firebase-config.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth(app);

// Elementos do header
const guestLinks = document.getElementById("guest-links");
const userInfo = document.getElementById("user-info");
const usernameSpan = document.querySelector("#user-info .username");
const userAvatar = document.querySelector("#user-info .avatar"); // Captura o avatar
const logoutBtn = document.getElementById("logoutBtn");

// Observa mudanças no login
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (guestLinks) guestLinks.style.display = "none";
    if (userInfo) userInfo.style.display = "flex"; // Usar flex para alinhar itens
    if (usernameSpan) usernameSpan.textContent = user.displayName || user.email;
    
    // ATUALIZAÇÃO: Mostra a foto de perfil
    if (userAvatar && user.photoURL) {
      userAvatar.src = user.photoURL;
    } else {
      userAvatar.src = "https://via.placeholder.com/32"; // Imagem padrão
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