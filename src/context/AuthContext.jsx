// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

// 🔑 FIXED ADMIN EMAIL
const ADMIN_EMAIL = "drashtimanguwala@gmail.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Auth state listener with Real-time Firestore Sync
  useEffect(() => {
    let unsubscribeFirestore = null;

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      // Unsubscribe from previous user listener if any
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      // ❌ block unverified users globally
      if (currentUser && !currentUser.emailVerified) {
        setUser(null);
        setLoading(false);
      } else if (currentUser) {
        // ✅ Real-time listener for user profile
        try {
           const userRef = doc(db, "users", currentUser.uid);
           unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
              const username = docSnap.exists() ? docSnap.data().username : null;
              
              setUser({
                ...currentUser,
                isAdmin: currentUser.email === ADMIN_EMAIL,
                username: username,
              });
              setLoading(false);
           }, (error) => {
              console.error("Error listening to user doc:", error);
              // Fallback just in case
              setUser({
                ...currentUser,
                isAdmin: currentUser.email === ADMIN_EMAIL,
                username: null,
              });
              setLoading(false);
           });

        } catch (error) {
          console.error("Error setting up user listener:", error);
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  // 📩 Email Login
  const emailLogin = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // 🆕 Email SignUp
  const signup = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // 🚪 Logout
  const logout = async () => {
    return await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,       // user + isAdmin flag + username
        loading,
        emailLogin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
