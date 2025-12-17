// src/components/SignUp.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "./input";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setProcessing(true);

      // ✅ create user
      const userCredential = await signup(email, password);

      // ✅ IMPORTANT FIX: use userCredential.user
      await sendEmailVerification(userCredential.user);

      alert("Verification email sent. Please check your inbox.");

      // ✅ logout to avoid auto-login bug
      await signOut(auth);

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-3 md:p-4">
      <div className="w-full max-w-md">
        <h2 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 text-gray-500 text-center">Welcome</h2>
        <h1 className="text-lg md:text-[48px] font-bold font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] bg-gradient-to-r from-[rgb(255,65,108)] via-[rgb(77,41,255)] to-[rgb(255,41,216)] bg-clip-text text-transparent mb-4 md:mb-8 text-center md:leading-[1.2] md:py-2">
          ThoughtSharing App
        </h1>
        
        <h2 className="text-stone-500 mb-4 md:mb-8 text-center text-sm md:text-base">
          Create an account
        </h2>

        <form onSubmit={handleEmailSignup} className="space-y-3 md:space-y-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            type="submit"
            disabled={processing}
            className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg bg-black text-white text-sm md:text-xl font-semibold hover:bg-green-500 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Creating..." : "Create account"}
          </button>
        </form>

        {error && <div className="text-red-500 mt-3 md:mt-4 text-center text-sm md:text-base">{error}</div>}
      </div>
    </div>
  );
}
