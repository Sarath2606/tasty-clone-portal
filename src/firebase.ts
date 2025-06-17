import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

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

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Initialize Firestore
const db = getFirestore(app);

// Enable Firestore offline persistence
try {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      }
    });
} catch (error) {
  console.warn('Error enabling persistence:', error);
}

// Set language to browser default
auth.useDeviceLanguage();

export { auth, db }; 