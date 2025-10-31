import { app, db } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const auth = getAuth(app);
const daycaresList = document.getElementById('daycares-list');
const loadingMessage = document.getElementById('loading-message');

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadMeusDaycares(user.uid);
    } else {
        loadingMessage.textContent = "Você precisa estar logado para ver seus daycares.";
        window.location.href = "login.html";
    }
});

async function loadMeusDaycares(userId) {
    try {
        // Buscar os daycares onde o 'userId' é o do usuário logado
        const q = query(collection(db, "daycares"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            loadingMessage.textContent = "Você ainda não cadastrou nenhum daycare.";
            return;
        }

        loadingMessage.style.display = 'none';

        querySnapshot.forEach((doc) => {
            const daycare = doc.data();
            const daycareId = doc.id;
            renderDaycareItem(daycare, daycareId);
        });

    } catch (error) {
        console.error("Erro ao carregar daycares: ", error);
        loadingMessage.textContent = "Erro ao carregar seus daycares.";
    }
}

function renderDaycareItem(daycare, daycareId) {
    const item = document.createElement('a');
    // ATENÇÃO: Link para a nova tela de EDIÇÃO
    item.href = `editar-daycare.html?id=${daycareId}`; 
    item.className = 'reserva-item'; // Reutilizando o estilo da lista de reservas
    
    item.innerHTML = `
        <img src="${daycare.imageUrl || 'img/placeholder-pethost-neutro.png'}" alt="Foto ${daycare.nome}">
        <div class="reserva-info">
            <h3>${daycare.nome}</h3>
            <p><strong>Endereço:</strong> ${daycare.endereco}</p>
            <p><strong>Preço:</strong> R$ ${daycare.preco.toFixed(2).replace('.',',')}</p>
            <p style="font-weight: 600; color: #ff7a00; margin-top: 5px;">Clique para editar</p>
        </div>
    `;
    
    daycaresList.appendChild(item);
}