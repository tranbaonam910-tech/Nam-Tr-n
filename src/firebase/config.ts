import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBr2ghoXOcLW-2pwLqOYpk6wigdswZQgV0",
  authDomain: "hoamoiw.firebaseapp.com",
  projectId: "hoamoiw",
  storageBucket: "hoamoiw.firebasestorage.app",
  messagingSenderId: "246132044693",
  appId: "1:246132044693:web:ddcf6c0b48acd4b3233c9c",
  measurementId: "G-F9G81RWGFW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
