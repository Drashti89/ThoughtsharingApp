// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 keep firestore unsubscribe stable across renders
  const firestoreUnsubRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // 🔥 cleanup previous firestore listener
      if (firestoreUnsubRef.current) {
        firestoreUnsubRef.current();
        firestoreUnsubRef.current = null;
      }

      // ❌ no user
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // ❌ block unverified users globally
      if (!currentUser.emailVerified) {
        setUser(null);
        setLoading(false);
        return;
      }

      // ✅ attach firestore listener ONLY after auth is ready
      const userRef = doc(db, "users", currentUser.uid);

      firestoreUnsubRef.current = onSnapshot(
        userRef,
        (docSnap) => {
          const data = docSnap.exists() ? docSnap.data() : {};

          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
            isAdmin: data.role === "admin",
            username: data.username || null,
          });

          setLoading(false);
        },
        (error) => {
          console.error("🔥 Firestore user listener error:", error);

          // safe fallback
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
            isAdmin: false,
            username: null,
          });

          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (firestoreUnsubRef.current) {
        firestoreUnsubRef.current();
      }
    };
  }, []);

  // 📩 Email Login
  const emailLogin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🆕 Email Signup
  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // 🚪 Logout (force cleanup)
  const logout = async () => {
    if (firestoreUnsubRef.current) {
      firestoreUnsubRef.current();
      firestoreUnsubRef.current = null;
    }
    setUser(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,       // uid, email, isAdmin, username
        loading,
        emailLogin,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
