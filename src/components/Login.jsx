import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import Input from "./input";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';

export default function Login() {
  const { emailLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      setError(null);

      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }

      // 🔐 Login
      const userCredential = await emailLogin(email, password);
      const user = userCredential.user;

      if (!user) {
        setError("Login failed. Try again.");
        return;
      }

      // 📩 Email verification check
      if (!user.emailVerified) {
        setError("Please verify your email first. Check your inbox or spam.");
        return;
      }

    toast.success("Logged in successfully 🎉", { className: "custom-toast custom-toast-success" });

      // 👑 ADMIN CHECK
      if (user.email === "drashtimanguwala@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {

      if (err.code === "auth/invalid-email") {
        setError("Invalid email format");
      } else if (err.code === "auth/user-not-found") {
        setError("User not found");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-3 md:p-4 md:pt-24 lg:flex lg:flex-col lg:justify-center lg:items-center">
      <h2 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 text-gray-500">Welcome</h2>
      <h1 className="text-lg md:text-[48px] font-bold font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] bg-gradient-to-r from-[rgb(255,65,108)] via-[rgb(77,41,255)] to-[rgb(255,41,216)] bg-clip-text text-transparent mb-4 md:mb-12 text-center md:leading-[1.2] md:py-2">
        ThoughtSharing App
      </h1>
      <p className="mb-4 md:mb-10 text-center text-stone-500 text-sm md:text-base">Login to continue</p>

      <div className="w-full max-w-md">
        <div className="space-y-3 md:space-y-8">
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

          <button
            onClick={handleLogin}
            className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg bg-black text-white text-sm md:text-xl font-semibold hover:bg-green-500 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </div>

        {error && <div className="text-red-500 mt-3 md:mt-4 text-sm md:text-base">{error}</div>}

        {error?.includes("verify") && (
          <button
            onClick={() => {
              if (auth.currentUser) {
                sendEmailVerification(auth.currentUser);
                setError("Verification email resent. Check inbox or spam.");
              }
            }}
            className="text-xs md:text-sm text-blue-600 underline mt-2"
          >
            Resend verification email
          </button>
        )}

        <p className="text-xs md:text-sm text-center mt-3 md:mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
