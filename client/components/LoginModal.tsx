import { useState } from "react";
import { X, Loader } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      toast.success("Logged in successfully!");
      onClose();
      resetForms();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupName || !signupUsername || !signupEmail || !signupPassword || !signupPasswordConfirm) {
      setError("Please fill in all fields");
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(signupName, signupUsername, signupEmail, signupPassword, signupPasswordConfirm);
      toast.success("Registered successfully! You are now logged in.");
      onClose();
      resetForms();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupUsername("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPasswordConfirm("");
    setError("");
  };

  const handleClose = () => {
    resetForms();
    setMode("login");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-mirza font-bold text-[28px]">
            {mode === "login" ? "Login" : "Sign Up"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-4 font-jakarta font-semibold text-[14px] transition ${
              mode === "login"
                ? "border-b-2 border-[#032088] text-[#032088]"
                : "text-[#7E7E7E] hover:text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`flex-1 py-4 font-jakarta font-semibold text-[14px] transition ${
              mode === "signup"
                ? "border-b-2 border-[#032088] text-[#032088]"
                : "text-[#7E7E7E] hover:text-black"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <form onSubmit={mode === "login" ? handleLoginSubmit : handleSignupSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[10px] p-4">
              <p className="font-jakarta font-medium text-[14px] text-red-700">
                {error}
              </p>
            </div>
          )}

          {mode === "login" ? (
            <>
              {/* Login Form */}
              <div>
                <label className="block font-jakarta font-semibold text-[14px] mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block font-jakarta font-semibold text-[14px] mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#032088] text-white font-jakarta font-bold text-[16px] rounded-[10px] hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[#7E7E7E] hover:text-black font-jakarta font-medium text-[14px]"
                >
                  Continue as guest
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Signup Form */}
              <div>
                <label className="block font-jakarta font-semibold text-[14px] mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block font-jakarta font-semibold text-[14px] mb-3">
                  Username
                </label>
                <input
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block font-jakarta font-semibold text-[14px] mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block font-jakarta font-semibold text-[14px] mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block font-jakarta font-semibold text-[14px] mb-3">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupPasswordConfirm}
                  onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#032088] text-white font-jakarta font-bold text-[16px] rounded-[10px] hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
