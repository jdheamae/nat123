import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpKi8Ov9hoyknyjdPuprHeMdQESCeTl3M",
  authDomain: "nat-crud-app.firebaseapp.com",
  projectId: "nat-crud-app",
  storageBucket: "nat-crud-app.appspot.com",
  messagingSenderId: "483383507852",
  appId: "1:483383507852:web:e4f088882a6cd356e834a9",
  measurementId: "G-1C2SYZMG4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export { db };