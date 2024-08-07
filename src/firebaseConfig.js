import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

console.log('API Key:', process.env.REACT_APP_API_KEY);  // This should log your API key
console.log('Auth Domain:', process.env.REACT_APP_AUTH_DOMAIN);  // This should log your Auth Domain

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
