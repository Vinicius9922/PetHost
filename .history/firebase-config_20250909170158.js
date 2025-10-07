<script type="module">
            // Import the functions you need from the SDKs you need
    import {initializeApp} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
    import {getAnalytics} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyBYXU6g-6lVheD_X1hFqt0p5uk0VOhFhLk",
    authDomain: "pethost-ebb82.firebaseapp.com",
    projectId: "pethost-ebb82",
    storageBucket: "pethost-ebb82.firebasestorage.app",
    messagingSenderId: "569300696609",
    appId: "1:569300696609:web:84a10d26855acb839a6d60",
    measurementId: "G-8P2C7ESDZE"
            };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
</script>