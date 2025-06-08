// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDE4FHfaOI0pV7HGFcekmGIrOlEc8dE71A",
    authDomain: "real-estate-app-aa9b2.firebaseapp.com",
    projectId: "real-estate-app-aa9b2",
    storageBucket: "real-estate-app-aa9b2.firebasestorage.app",
    messagingSenderId: "856070996185",
    appId: "1:856070996185:web:70c1299e6165cf95bb3ec8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;