import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYxtv04kEkfTiFhryyZqVHeLZP3OCfqEQ",
  authDomain: "notesapp-55415.firebaseapp.com",
  projectId: "notesapp-55415",
  storageBucket: "notesapp-55415.firebasestorage.app",
  messagingSenderId: "794965930860",
  appId: "1:794965930860:web:6f9430308de127d51df949"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
