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
  let unsubscribeUser = () => {};

  const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
    // 🔴 No user
    if (!currentUser) {
      setUser(null);
      dispatch(logoutUser());
      setLoading(false);
      return;
    }

    // 🔥 CLEAN OLD LISTENER
    unsubscribeUser();

    // ✅ CHECK EMAIL VERIFICATION FIRST
    if (!currentUser.emailVerified) {
      setUser(null);
      dispatch(logoutUser());
      setLoading(false);
      return;
    }

    // 🔥 REALTIME USER LISTENER
    unsubscribeUser = onSnapshot(
      doc(db, "users", currentUser.uid),
      (snap) => {
        if (!snap.exists()) {
          // ✅ FIX: Handle users without Firestore doc
          const userObj = {
            uid: currentUser.uid,
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
            isAdmin: false,
            username: null,
          };
          setUser(userObj);
          dispatch(setReduxUser(userObj));
          setLoading(false);
          return;
        }

        const data = snap.data();

        // ✅ VERIFIED USER
        const userObj = {
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: true,
          isAdmin: data.role === "admin",
          username: data.username ?? null,
        };

        setUser(userObj);
        dispatch(setReduxUser(userObj));
        setLoading(false);
      }
    );
  });

  // 🔥 CLEANUP
  return () => {
    unsubscribeUser();
    unsubscribeAuth();
  };
}, [dispatch]);

  // 📩 Login
  const emailLogin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const userRef = doc(db, "users", userCredential.user.uid);
  const snap = await getDoc(userRef);


  return userCredential;
};


  // 🆕 Signup
  const signup = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};


  


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
