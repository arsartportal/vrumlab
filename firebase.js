import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhMe8JecoL2sIw7dLWddnvFwfryxjReio",
  authDomain: "vrumlab.firebaseapp.com",
  projectId: "vrumlab",
  storageBucket: "vrumlab.firebasestorage.app",
  messagingSenderId: "577291346123",
  appId: "1:577291346123:web:d33617fc256b255add7b4e",
  measurementId: "G-MFHP4YJ6BB"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);