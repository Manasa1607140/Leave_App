import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC5S2FEU73VacvJaCbOMhF7qCM6ic40Ejk",
  authDomain: "student-leave-33b6b.firebaseapp.com",
  projectId: "student-leave-33b6b",
  storageBucket: "student-leave-33b6b.firebasestorage.app",
  messagingSenderId: "1069657261477",
  appId: "1:1069657261477:web:d88f0e99c275bb6a3a144c",
  measurementId: "G-X3RHP9DEQ1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
