import { app } from "./firebase-config.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const db = getFirestore(app);
const daycaresGrid = document.getElementById('daycares-grid');
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.getElementById('pagination-container');

const CARDS_PER_PAGE = 15;
let allDaycares = [];
let currentPage = 1;

// Função para renderizar os cards na tela
function renderCards(daycaresToRender) {
    daycaresGrid.innerHTML = ''; // Limpa o grid
    
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    const paginatedDaycares = daycaresToRender.slice(start, end);

    if (paginatedDaycares.length === 0) {
        daycaresGrid.innerHTML = '<p>Nenhum daycare encontrado.</p>';
        return;
    }

    paginatedDaycares.forEach(doc => {
        const daycare = doc.data();
        const card = `
            <div class="card">
                <img src="${daycare.imageUrl || 'img/Hero-PetHost.webp'}" alt="Foto de ${daycare.nome}">
                <div class="card-body">
                    <h3>${daycare.nome}</h3>
                    <p>${daycare.endereco}</p>
                    <p class="price">R$ ${daycare.preco.toFixed(2).replace('.',',')}/dia</p>
                    <a href="detalhes.html?id=${doc.id}" class="btn btn-primary">Ver detalhes</a>
                </div>
            </div>
        `;
        daycaresGrid.innerHTML += card;
    });
}

// Função para renderizar os controles de paginação
function renderPagination(totalDaycares) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalDaycares / CARDS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            filterAndRender();
        });
        paginationContainer.appendChild(button);
    }
}

// Função para filtrar e renderizar os resultados
function filterAndRender() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredDaycares = allDaycares.filter(doc => {
        return doc.data().nome.toLowerCase().includes(searchTerm);
    });

    renderCards(filteredDaycares);
    renderPagination(filteredDaycares.length);
}

// Carregar os daycares do Firestore
async function loadDaycares() {
    try {
        const querySnapshot = await getDocs(collection(db, "daycares"));
        allDaycares = querySnapshot.docs;
        filterAndRender();
    } catch (error) {
        console.error("Erro ao buscar daycares: ", error);
        daycaresGrid.innerHTML = '<p>Erro ao carregar os daycares. Tente novamente mais tarde.</p>';
    }
}

// Event listener para a busca
searchInput.addEventListener('input', () => {
    currentPage = 1; // Reseta para a primeira página ao buscar
    filterAndRender();
});

// Carregamento inicial
loadDaycares();