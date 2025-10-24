import { app, db } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const auth = getAuth(app);
const reservasList = document.getElementById('reservas-list');
const loadingMessage = document.getElementById('loading-message');

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadReservas(user.uid);
    } else {
        loadingMessage.textContent = "Você precisa estar logado para ver suas reservas.";
        window.location.href = "login.html";
    }
});

async function loadReservas(userId) {
    try {
        // 1. Buscar as reservas do usuário
        const q = query(collection(db, "reservas"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            loadingMessage.textContent = "Você ainda não fez nenhuma reserva.";
            return;
        }

        loadingMessage.style.display = 'none'; // Esconde msg de 'carregando'

        // 2. Para cada reserva, buscar os detalhes do daycare
        for (const reservaDoc of querySnapshot.docs) {
            const reserva = reservaDoc.data();
            const reservaId = reservaDoc.id; // ID da reserva

            // Buscar o daycare associado
            const daycareRef = doc(db, "daycares", reserva.daycareId);
            const daycareSnap = await getDoc(daycareRef);

            if (daycareSnap.exists()) {
                const daycare = daycareSnap.data();
                renderReservaItem(reserva, reservaId, daycare);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar reservas: ", error);
        loadingMessage.textContent = "Erro ao carregar suas reservas.";
    }
}

function renderReservaItem(reserva, reservaId, daycare) {
    // Formatar datas
    const checkin = new Date(reserva.checkin + 'T00:00:00-03:00').toLocaleDateString('pt-BR');
    const checkout = new Date(reserva.checkout + 'T00:00:00-03:00').toLocaleDateString('pt-BR');

    const item = document.createElement('a');
    item.href = `detalhes-reserva.html?id=${reservaId}`;
    item.className = 'reserva-item';
    
    item.innerHTML = `
        <img src="${daycare.imageUrl || 'img/placeholder-pethost-neutro.png'}" alt="Foto ${daycare.nome}">
        <div class="reserva-info">
            <h3>${daycare.nome}</h3>
            <p><strong>Check-in:</strong> ${checkin}</p>
            <p><strong>Check-out:</strong> ${checkout}</p>
            <p><strong>Status:</strong> ${reserva.status}</p>
        </div>
    `;
    
    reservasList.appendChild(item);
}