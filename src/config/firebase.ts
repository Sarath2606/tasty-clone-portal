import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCW-d7tx90AvJz_rExKUfyZj4XLIxvNMis",
  authDomain: "cloud-aa10b.firebaseapp.com",
  projectId: "cloud-aa10b",
  storageBucket: "cloud-aa10b.firebasestorage.app",
  messagingSenderId: "840863135722",
  appId: "1:840863135722:web:35d60c199c9623799de493"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 