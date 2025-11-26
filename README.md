# PetHost 🐾

Este projeto é uma plataforma web inspirada no Airbnb para **hospedagem de pets**. O sistema conecta tutores a anfitriões, permitindo cadastro de daycares, busca, reservas e gestão de anúncios, utilizando **Firebase** como backend.

## Pré-requisitos

- **Visual Studio Code** instalado. [Download VS Code](https://code.visualstudio.com/)
- Extensão **Live Server** instalada no VS Code.
- Uma **Conta Google** para acesso ao console do Firebase.

## Instalação

1. Clone o repositório para o seu ambiente local:

    ```bash
    git clone [https://github.com/SEU-USUARIO/pethost.git](https://github.com/SEU-USUARIO/pethost.git)
    cd pethost
    ```

2. Crie um projeto no [Console do Firebase](https://console.firebase.google.com/):
    - Ative o **Authentication** (Provedor E-mail/Senha).
    - Crie um **Firestore Database** (Modo de Teste).

3. Configure as credenciais no arquivo `js/firebase-config.js`.

## Estrutura do Projeto

O sistema é dividido em dois perfis principais com as seguintes ações:

1. **Cliente:** Busca daycares, visualiza detalhes, realiza reservas e acompanha histórico.
2. **Anfitrião (Host):** Cadastra novos anúncios, define preços/serviços e edita informações dos seus daycares.

## Execução do Projeto

Como o projeto utiliza Módulos ES6, ele precisa de um servidor local. Para executar:

1. Abra a pasta do projeto no **VS Code**.
2. Clique com o botão direito no arquivo `index.html`.
3. Selecione a opção:

```text
Open with Live Server
```
O navegador abrirá automaticamente em http://127.0.0.1:5500.

Exemplo de Configuração (Firebase)
No arquivo js/firebase-config.js, substitua o objeto de configuração pelas chaves do seu projeto:
```text
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```
## Regras de Segurança
Para garantir que anfitriões só editem seus próprios anúncios, configure as regras no Firestore:
```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /daycares/{daycareId} {
      allow read: if true;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId;
    }
  }
```
## Notas
1. O upload de imagens reais foi substituído por placeholders automáticos para evitar erros de CORS em ambiente local.
2. O sistema de pagamento é demonstrativo e não realiza cobranças reais.
