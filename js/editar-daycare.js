import { app, db } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const auth = getAuth(app);

// Formulário
const form = document.getElementById("editarDaycareForm");
const nomeField = document.getElementById("nome");
const enderecoField = document.getElementById("endereco");
const descricaoField = document.getElementById("descricao");
const capacidadeField = document.getElementById("capacidade");
const precoField = document.getElementById("preco");
const servicosGroup = document.getElementById("servicos-group");

let daycareRef;
let currentUser;

// Pega o ID do daycare da URL
const urlParams = new URLSearchParams(window.location.search);
const daycareId = urlParams.get('id');

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        if (daycareId) {
            daycareRef = doc(db, "daycares", daycareId);
            loadDaycareData();
        } else {
            alert("Daycare não encontrado.");
            window.location.href = "meus-daycares.html";
        }
    } else {
        window.location.href = "login.html";
    }
});

// 1. Carregar e preencher os dados do daycare
async function loadDaycareData() {
    try {
        const docSnap = await getDoc(daycareRef);

        if (!docSnap.exists()) {
            alert("Este daycare não existe.");
            return;
        }

        const daycare = docSnap.data();

        // Verificar se o usuário logado é o dono do daycare
        if (daycare.userId !== currentUser.uid) {
            alert("Você não tem permissão para editar este daycare.");
            window.location.href = "meus-daycares.html";
            return;
        }

        // Preencher o formulário
        nomeField.value = daycare.nome;
        enderecoField.value = daycare.endereco;
        descricaoField.value = daycare.descricao;
        capacidadeField.value = daycare.capacidade;
        precoField.value = daycare.preco;

        // Marcar os checkboxes de serviços
        const checkboxes = servicosGroup.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (daycare.servicos.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });

    } catch (error) {
        console.error("Erro ao carregar daycare:", error);
    }
}

// 2. Salvar as alterações
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Coletar serviços selecionados
    const servicos = [];
    const checkboxes = servicosGroup.querySelectorAll('input[name="servicos"]:checked');
    checkboxes.forEach((checkbox) => {
        servicos.push(checkbox.value);
    });

    try {
        await updateDoc(daycareRef, {
            nome: nomeField.value,
            endereco: enderecoField.value,
            descricao: descricaoField.value,
            capacidade: parseInt(capacidadeField.value, 10),
            preco: parseFloat(precoField.value),
            servicos: servicos
        });

        alert("Daycare atualizado com sucesso!");
        window.location.href = "meus-daycares.html";

    } catch (error) {
        console.error("Erro ao atualizar daycare: ", error);
        alert("Erro ao salvar. Tente novamente.");
    }
});