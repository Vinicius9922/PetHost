import { db } from "./firebase-config.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const paymentForm = document.querySelector(".payment-form");
const modal = document.getElementById("reservaModal");
const closeModalBtn = document.getElementById("closeModalBtn");

paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        alert("Você precisa estar logado para fazer uma reserva.");
        window.location.href = "login.html";
        return;
    }

    // Pegar o daycareId da URL
    const urlParams = new URLSearchParams(window.location.search);
    const daycareId = urlParams.get('daycareId');

    if (!daycareId) {
        alert("Erro: Daycare não especificado.");
        return;
    }

    // Pegar dados do formulário
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const observacoes = document.getElementById("observacoes").value;

    try {
        // Salvar na coleção 'reservas'
        await addDoc(collection(db, "reservas"), {
            userId: user.uid,
            daycareId: daycareId,
            checkin: checkin,
            checkout: checkout,
            observacoes: observacoes,
            status: "confirmada",
            dataReserva: serverTimestamp() // Salva a data atual
        });

        // Mostrar o modal
        modal.classList.add("visible");

    } catch (error) {
        console.error("Erro ao salvar reserva: ", error);
        alert("Erro ao confirmar sua reserva. Tente novamente.");
    }
});

// Fechar modal e redirecionar
closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("visible");
    window.location.href = "reservas.html"; // Redireciona para a nova pág de reservas
});