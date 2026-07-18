// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

// Authentication
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Firestore
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Firebase Storage
import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX0eN3KvrFnPXV00i4MAXqJuVb8j3-nts",
  authDomain: "cybernotes-c51e7.firebaseapp.com",
  projectId: "cybernotes-c51e7",
  storageBucket: "cybernotes-c51e7.firebasestorage.app",
  messagingSenderId: "814205267539",
  appId: "1:814205267539:web:6b4492ec79dec94fa920a6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);