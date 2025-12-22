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
import { doc, onSnapshot } from "firebase/firestore";
import { setUser as setReduxUser, logoutUser } from "../store/authSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
  let unsubscribeUser = () => {}; // 🔥 OUTSIDE

  const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
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

    // 🔥 CLEAN OLD LISTENER (VERY IMPORTANT)
    unsubscribeUser();

    // 🔥 REALTIME USER LISTENER
    unsubscribeUser = onSnapshot(
      doc(db, "users", currentUser.uid),
      (snap) => {
        if (!snap.exists()) {
          setLoading(false);
          return;
        }


        const data = snap.data();

        const userObj = {
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
          isAdmin: data.role === "admin",
          username: data.username ?? null,
        };

        setUser(userObj);
        dispatch(setReduxUser(userObj));
        setLoading(false);
      }
    );
  });

  // 🔥 CLEANUP BOTH LISTENERS
  return () => {
    unsubscribeUser();
    unsubscribeAuth();
  };
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
