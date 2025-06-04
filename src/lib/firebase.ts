
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBvx3r1VKki40EFV61jOpvFC8VFrnXXmpQ",
  authDomain: "mornin-771f1.firebaseapp.com",
  projectId: "mornin-771f1",
  storageBucket: "mornin-771f1.firebasestorage.app",
  messagingSenderId: "926215125281",
  appId: "1:926215125281:web:1fc2a1a1ca06e0f6cce660",
  measurementId: "G-1P7RNTKP80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
