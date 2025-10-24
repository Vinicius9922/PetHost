import { app, db } from "./firebase-config.js"; // Importar 'db'
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Elementos da página
const daycareName = document.getElementById('daycare-name');
const daycareLocation = document.getElementById('daycare-location');
const daycareDescription = document.getElementById('daycare-description');
const daycareServices = document.getElementById('daycare-services');
const daycareImage = document.getElementById('daycare-image');
const reservarBtn = document.getElementById('reservarBtn'); // Pegar o botão

async function loadDaycareDetails() {
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

            daycareName.textContent = daycare.nome;
            daycareLocation.textContent = `📍 ${daycare.endereco}`;
            daycareDescription.textContent = daycare.descricao;
            
            if (daycare.imageUrl) {
                daycareImage.src = daycare.imageUrl;
            }

            daycareServices.innerHTML = '';
            if (daycare.servicos && daycare.servicos.length > 0) {
              daycare.servicos.forEach(service => {
                  const li = document.createElement('li');
                  li.textContent = `🐾 ${service.charAt(0).toUpperCase() + service.slice(1)}`;
                  daycareServices.appendChild(li);
              });
            } else {
              daycareServices.innerHTML = '<li>Nenhum serviço cadastrado.</li>';
            }
            
            // ATUALIZAR LINK DE PAGAMENTO
            if(reservarBtn) {
              reservarBtn.href = `pagamento.html?daycareId=${daycareId}`;
            }

        } else {
            console.log("Nenhum documento encontrado!");
            daycareName.textContent = "Detalhes não disponíveis.";
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        daycareName.textContent = "Erro ao carregar informações.";
    }
}

loadDaycareDetails();