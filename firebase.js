import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCcLX0uUA_lccTiktXMH7ZGqcoPhEtT7_M",
    authDomain: "quentinha-da-lu.firebaseapp.com",
    projectId: "quentinha-da-lu",
    storageBucket: "quentinha-da-lu.firebasestorage.app",
    messagingSenderId: "778005073352",
    appId: "1:778005073352:web:e677f1ced1bf484e1604fd",
    measurementId: "G-MFNN18B04M"
  };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
