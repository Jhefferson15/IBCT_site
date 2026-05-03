// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Substitua pelos valores do seu console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7NNvc3sFwD1hJU8NzuNrqrP9MD0sCjXs",
  authDomain: "ibct-website-oficial.firebaseapp.com",
  projectId: "ibct-website-oficial",
  storageBucket: "ibct-website-oficial.firebasestorage.app",
  messagingSenderId: "973935717965",
  appId: "1:973935717965:web:b9f5ec7346d1ec9982f604",
  measurementId: "G-7WBWDYWDS4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Conectar aos emuladores se estiver rodando localmente
if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname.startsWith("192.168.")) {
    console.log("Ambiente local detectado. Tentando conectar aos emuladores do Firebase...");
    // Descomente as linhas abaixo se estiver usando os emuladores locais (firebase emulators:start)
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectAuthEmulator(auth, "http://localhost:9099");
}


