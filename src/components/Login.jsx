import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import Input from "./input";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { emailLogin, loading } = useAuth();
  const auth = getAuth();
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

      // 👑 ADMIN CHECK
      if (user.email === "drashtimanguwala@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log("Login error:", err);

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
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome</h2>
      <p className="mb-6 text-center">Login to continue</p>

      <div className="w-full max-w-md">
        <div className="space-y-4">
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

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        {error?.includes("verify") && (
          <button
            onClick={() => {
              if (auth.currentUser) {
                sendEmailVerification(auth.currentUser);
                setError("Verification email resent. Check inbox or spam.");
              }
            }}
            className="text-sm text-blue-600 underline mt-2"
          >
            Resend verification email
          </button>
        )}

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
