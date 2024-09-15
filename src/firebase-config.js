// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth for authentication
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCD0Y7-YO9H1zMve8RWjKJ0yE4Syhhrv0M",
  authDomain: "bricks-6dadc.firebaseapp.com",
  projectId: "bricks-6dadc",
  storageBucket: "bricks-6dadc.appspot.com",
  messagingSenderId: "167684115185",
  appId: "1:167684115185:web:94adb36bed09985eb13750",
  measurementId: "G-LMPVJQCB2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export auth for authentication
export const db = getFirestore(app);
