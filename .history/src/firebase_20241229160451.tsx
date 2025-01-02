// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config (get this from your Firebase project settings)
const firebaseConfig = {
  apiKey: "AIzaSyAPv2JB9_JeaVsaTf1IHcO-O-WVMbn8w9o",
  authDomain: "scam-archive.firebaseapp.com",
  projectId: "scam-archive",
  storageBucket: "scam-archive.firebasestorage.app",
  messagingSenderId: "847381183545",
  appId: "1:847381183545:web:2b000aeac8457e057a61e8",
  measurementId: "G-MJVNPXL0VR",
};

// Initialize Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, app, storage };
