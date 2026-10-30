import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKEb5hVoGO1sNZ44HMbbGsg3r5QCAMvNY",
  authDomain: "parkertech-cyber-defense.firebaseapp.com",
  projectId: "parkertech-cyber-defense",
  storageBucket: "parkertech-cyber-defense.firebasestorage.app",
  messagingSenderId: "608165034741",
  appId: "1:608165034741:web:aea16d2e906c7cbdd6a3bc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);