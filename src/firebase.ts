import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAAAJ_pGzJgrBCBfl79qBtYs-7CEB7UM0",
  authDomain: "cloud-tasty.firebaseapp.com",
  projectId: "cloud-tasty",
  storageBucket: "cloud-tasty.firebasestorage.app",
  messagingSenderId: "702139220568",
  appId: "1:702139220568:web:09b2d321e3bef1c287c02d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.useDeviceLanguage(); 