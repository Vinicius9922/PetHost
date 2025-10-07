import { app } from "./firebase-config.js";
import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth(app);

const guestLinks = document.getElementById("guest-links");
const userInfo = document.getElementById("user-info");
const usernameSpan = document.querySelector(".username");

// Observa mudanças no login
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Se estiver logado → mostra user-info e esconde guest-links
    guestLinks.style.display = "none";
    userInfo.classList.remove("hidden");

    // Mostra o nome (ou e-mail se não tiver displayName)
    usernameSpan.textContent = user.displayName || user.email;

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "index.html";
      });
    });

  } else {
    // Se não estiver logado → mostra guest-links e esconde user-info
    guestLinks.style.display = "flex";
    userInfo.classList.add("hidden");
  }
});
