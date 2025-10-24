import { app, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Elementos da Reserva
const resCheckin = document.getElementById('reserva-checkin');
const resCheckout = document.getElementById('reserva-checkout');
const resObs = document.getElementById('reserva-obs');

// Elementos do Daycare
const daycareName = document.getElementById('daycare-name');
const daycareLocation = document.getElementById('daycare-location');
const daycareDescription = document.getElementById('daycare-description');
const daycareServices = document.getElementById('daycare-services');
const daycareImage = document.getElementById('daycare-image');

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadReservaDetails();
    } else {
        window.location.href = "login.html";
    }
});

async function loadReservaDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const reservaId = urlParams.get('id');

    if (!reservaId) {
        daycareName.textContent = "Reserva não encontrada.";
        return;
    }

    try {
        // 1. Buscar a reserva
        const reservaRef = doc(db, "reservas", reservaId);
        const reservaSnap = await getDoc(reservaRef);

        if (!reservaSnap.exists()) {
            daycareName.textContent = "Detalhes da reserva não encontrados.";
            return;
        }

        const reserva = reservaSnap.data();
        
        // 2. Preencher os dados da reserva
        const checkin = new Date(reserva.checkin + 'T00:00:00-03:00').toLocaleDateString('pt-BR');
        const checkout = new Date(reserva.checkout + 'T00:00:00-03:00').toLocaleDateString('pt-BR');

        resCheckin.textContent = checkin;
        resCheckout.textContent = checkout;
        resObs.textContent = reserva.observacoes || "Nenhuma observação.";

        // 3. Buscar os dados do daycare associado
        await loadDaycareDetails(reserva.daycareId);

    } catch (error) {
        console.error("Erro ao buscar detalhes da reserva:", error);
        daycareName.textContent = "Erro ao carregar informações.";
    }
}

async function loadDaycareDetails(daycareId) {
    // Esta função é uma cópia da 'js/detalhes.js'
    try {
        const docRef = doc(db, "daycares", daycareId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const daycare = docSnap.data();

            daycareName.textContent = daycare.nome;
            daycareLocation.textContent = `📍 ${daycare.endereco}`;
            daycareDescription.textContent = daycare.descricao;
            
            if (daycare.imageUrl) {
                daycareImage.src = daycare.imageUrl;
            }

            daycareServices.innerHTML = '';
            if (daya.servicos && daycare.servicos.length > 0) {
              daycare.servicos.forEach(service => {
                  const li = document.createElement('li');
                  li.textContent = `🐾 ${service.charAt(0).toUpperCase() + service.slice(1)}`;
                  daycareServices.appendChild(li);
              });
            } else {
              daycareServices.innerHTML = '<li>Nenhum serviço cadastrado.</li>';
            }
        }
    } catch (error) {
        console.error("Erro ao buscar daycare:", error);
    }
}