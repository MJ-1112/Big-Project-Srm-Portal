// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJX2tmfLckWx1fjkFIDBEzlMGrDMfhz1c",
  authDomain: "portal-7fe9e.firebaseapp.com",
  projectId: "portal-7fe9e",
  storageBucket: "portal-7fe9e.firebasestorage.app",
  messagingSenderId: "83490746709",
  appId: "1:83490746709:web:40dfa0f9e782e0a6a57fdc",
  measurementId: "G-CZ1SGFBLKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
