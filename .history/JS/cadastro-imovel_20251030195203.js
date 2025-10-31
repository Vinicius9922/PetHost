import { app, db } from "./firebase-config.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const form = document.getElementById("cadastroImovelForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        alert("Você precisa estar logado para cadastrar um daycare.");
        window.location.href = "login.html";
        return;
    }

    // Coletar valores dos campos
    const nome = form.nome.value;
    const endereco = form.endereco.value;
    const descricao = form.descricao.value;
    const capacidade = parseInt(form.capacidade.value, 10);
    const preco = parseFloat(form.preco.value);



    // Coletar serviços selecionados
    const servicos = [];
    const checkboxes = form.querySelectorAll('input[name="servicos"]:checked');
    checkboxes.forEach((checkbox) => {
        servicos.push(checkbox.value);
    });

    try {
        // Adicionar o documento ao Firestore
        const docRef = await addDoc(collection(db, "daycares"), {
            userId: user.uid,
            nome: nome,
            endereco: endereco,
            descricao: descricao,
            servicos: servicos,
            capacidade: capacidade,
            preco: preco,
            // Futuramente, adicionar URL da imagem aqui
            imageUrl: "img/Placeholder.png" // Placeholder
        });

        alert("Daycare cadastrado com sucesso!");
        window.location.href = "daycares.html"; // Redireciona para a listagem

    } catch (error) {
        console.error("Erro ao cadastrar daycare: ", error);
        alert("Ocorreu um erro. Tente novamente.");
    }
});