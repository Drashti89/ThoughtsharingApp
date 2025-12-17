import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmV95cXXygv-3mAdKvBmSlNRcIbVVfqkE",
  authDomain: "notesapp-55415.firebaseapp.com",
  projectId: "notesapp-55415",
  storageBucket: "notesapp-55415.appspot.com", // ✅ FIXED
  messagingSenderId: "794965930860",
  appId: "1:794965930860:web:bc49d3021acb5f421df949",
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
