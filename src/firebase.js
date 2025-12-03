// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBatHAE6-KqFil5Otl0UHJRuXZEE0hAz7U",
  authDomain: "optimetry-67d51.firebaseapp.com",
  projectId: "optimetry-67d51",
  storageBucket: "optimetry-67d51.firebasestorage.app",
  messagingSenderId: "151605706866",
  appId: "1:151605706866:web:0312e0dcee87c0635042eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
