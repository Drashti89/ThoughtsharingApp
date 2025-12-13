// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

// 🔑 FIXED ADMIN EMAIL
const ADMIN_EMAIL = "drashtimanguwala@gmail.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      // ❌ block unverified users globally
      if (currentUser && !currentUser.emailVerified) {
        setUser(null);
      } else if (currentUser) {
        // ✅ attach admin flag
        setUser({
          ...currentUser,
          isAdmin: currentUser.email === ADMIN_EMAIL,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
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
        user,       // user + isAdmin flag
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
