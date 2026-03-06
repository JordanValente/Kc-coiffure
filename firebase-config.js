import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadString, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3BixZSN9w4xbrVv1YCojMInQw95SqqUg",
  authDomain: "kc-coiffure.firebaseapp.com",
  projectId: "kc-coiffure",
  storageBucket: "kc-coiffure.firebasestorage.app",
  messagingSenderId: "1055478777891",
  appId: "1:1055478777891:web:7e0c2ed0f8941950570996",
  measurementId: "G-V9BC9D96D6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
