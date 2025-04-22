import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDc5E2ZHiFs8B3SxlYgVVqDh0oUz7Z0He8",
    authDomain: "dam-core.firebaseapp.com",
    projectId: "dam-core",
    storageBucket: "dam-core.firebasestorage.app",
    messagingSenderId: "325100677123",
    appId: "1:325100677123:web:340f53b4a1e7707e990636",
    measurementId: "G-PBVELGGC0Y"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db};