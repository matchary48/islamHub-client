// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrFHAg37NYrXzfRyRa__Pw1ud4jJkhxGA",
  authDomain: "islamhub-cbc51.firebaseapp.com",
  projectId: "islamhub-cbc51",
  storageBucket: "islamhub-cbc51.appspot.com",
  messagingSenderId: "679214214037",
  appId: "1:679214214037:web:f8c976bc818692570ee49c",
  measurementId: "G-G8K10RDR64",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
