// ============================================================
// FIREBASE CONFIGURATION — Criatório Igarapava
// ============================================================
// IMPORTANTE: Substitua os valores abaixo pelas credenciais
// do seu projeto Firebase. Acesse:
// https://console.firebase.google.com → Configurações do projeto
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCb7diz7zfAudmkZPw5mQdq594QJA9nbz8",
  authDomain: "banco-de-dados-dos-passaros.firebaseapp.com",
  projectId: "banco-de-dados-dos-passaros",
  storageBucket: "banco-de-dados-dos-passaros.firebasestorage.app",
  messagingSenderId: "912763977397",
  appId: "1:912763977397:web:5ded034a8a6572649a48fc"
};

// Detecta se as credenciais foram configuradas (vê se não é mais o placeholder original)
export const FIREBASE_CONFIGURED = true;

const app = FIREBASE_CONFIGURED ? initializeApp(firebaseConfig) : null;
export const db = FIREBASE_CONFIGURED ? getFirestore(app) : null;
