import { app } from "./firebase-config.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const db = getFirestore(app);

// Elementos da página
const daycareName = document.getElementById('daycare-name');
const daycareLocation = document.getElementById('daycare-location');
const daycareDescription = document.getElementById('daycare-description');
const daycareServices = document.getElementById('daycare-services');
const daycareImage = document.getElementById('daycare-image');

async function loadDaycareDetails() {
    // Pega o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const daycareId = urlParams.get('id');

    if (!daycareId) {
        daycareName.textContent = "Daycare não encontrado.";
        return;
    }

    try {
        const docRef = doc(db, "daycares", daycareId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const daycare = docSnap.data();

            // Preenche os elementos com os dados
            daycareName.textContent = daycare.nome;
            daycareLocation.textContent = `📍 ${daycare.endereco}`;
            daycareDescription.textContent = daycare.descricao;
            
            if (daycare.imageUrl) {
                daycareImage.src = daycare.imageUrl;
            }

            // Preenche a lista de serviços
            daycareServices.innerHTML = '';
            daycare.servicos.forEach(service => {
                const li = document.createElement('li');
                li.textContent = `🐾 ${service.charAt(0).toUpperCase() + service.slice(1)}`; // Capitaliza a primeira letra
                daycareServices.appendChild(li);
            });

        } else {
            console.log("Nenhum documento encontrado!");
            daycareName.textContent = "Detalhes não disponíveis.";
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        daycareName.textContent = "Erro ao carregar informações.";
    }
}

// Carrega os detalhes ao iniciar a página
loadDaycareDetails();