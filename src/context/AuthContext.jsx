// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setUser as setReduxUser, logoutUser } from "../store/authSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // 🔴 No user
      if (!currentUser) {
        setUser(null);
        dispatch(logoutUser());
        setLoading(false);
        return;
      }

      // 🔴 Email not verified
      if (!currentUser.emailVerified) {
        await signOut(auth);
        setUser(null);
        dispatch(logoutUser());
        setLoading(false);
        return;
      }

      try {
        // ✅ ONE-TIME READ (NO LISTENER)
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : {};

        const userObj = {
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
          isAdmin: data.role === "admin",
          username: data.username || null,
        };

        setUser(userObj);
        dispatch(setReduxUser(userObj));
      } catch (err) {
        // 🔕 Ignore permission errors during logout race
        if (err.code !== "permission-denied") {
          console.error("AuthContext error:", err);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // 📩 Login
  const emailLogin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🆕 Signup
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // 🚪 Logout
  const logout = async () => {
    setUser(null);
    dispatch(logoutUser());
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, emailLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
