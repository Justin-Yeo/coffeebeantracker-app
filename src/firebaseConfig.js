import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBPeyCf9q3lWOtOPgelVd_zg1DCIg93ZAY",
  authDomain: "coffeetracker-app.firebaseapp.com",
  projectId: "coffeetracker-app",
  storageBucket: "coffeetracker-app.appspot.com",
  messagingSenderId: "209831934733",
  appId: "1:209831934733:web:9d4bc8371da55f3b320e44",
  measurementId: "G-3XMQRTJN14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
