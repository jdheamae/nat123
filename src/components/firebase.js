import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7fhn6Z9VxOG6h29MMtKYAEPcy_Tm_vO0",
  authDomain: "agin-13a05.firebaseapp.com",
  projectId: "agin-13a05",
  storageBucket: "agin-13a05.firebasestorage.app",
  messagingSenderId: "13478630976",
  appId: "1:13478630976:web:00cd3a0c383ea3e727f1a5",
  measurementId: "G-DCCK4ZTZWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export { db };