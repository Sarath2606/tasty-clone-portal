import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBAAAJ_pGzJgrBCBfl79qBtYs-7CEB7UM0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cloud-tasty.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cloud-tasty",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cloud-tasty.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "702139220568",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:702139220568:web:09b2d321e3bef1c287c02d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable authentication persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Enable Firestore offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Set language to browser default
auth.useDeviceLanguage(); 