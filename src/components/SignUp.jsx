// src/components/SignUp.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
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
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create an account
        </h2>

        <form onSubmit={handleEmailSignup} className="space-y-4">
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

          <Button type="submit" disabled={processing} className="w-full">
            {processing ? "Creating..." : "Create account"}
          </Button>
        </form>

        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
}
