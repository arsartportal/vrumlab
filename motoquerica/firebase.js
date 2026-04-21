import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDunks_5ddHx5Dtd9ldanQR72KyKJO8Y1k",
  authDomain: "motoquerica.firebaseapp.com",
  projectId: "motoquerica",
  storageBucket: "motoquerica.firebasestorage.app",
  messagingSenderId: "431543378491",
  appId: "1:431543378491:web:d6a6b33d273f562a25321e",
  measurementId: "G-KZXJ2DZN6C"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);