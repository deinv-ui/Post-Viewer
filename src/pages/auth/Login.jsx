import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/utils/api";
import { useEffect, useState, } from "react";
import useAuthStore, { isTokenValid } from "@/stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { email, password, setEmail, setPassword, setToken, token, setUser } =
    useAuthStore();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (token && isTokenValid(token)) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });

      if (!data?.token) throw new Error("Login failed: no token received");

      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center">
        <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full transform translate-x-16 -translate-y-16 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full transform -translate-x-12 translate-y-12 opacity-20"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-yellow-400 p-2 rounded-lg">
                <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <h1 className="text-white text-center text-sm font-medium mb-8 tracking-wide">
              Hi, Welcome to{" "}
              <span className="text-yellow-400 font-bold">Blink!</span>
            </h1>

            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-white text-sm">Sign-in form</span>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-600 focus:border-yellow-400 focus:outline-none transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // <-- toggle type
                    placeholder="Password"
                    className="w-full bg-gray-700 text-white pl-12 pr-12 py-3 rounded-xl border border-gray-600 focus:border-yellow-400 focus:outline-none transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 group"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <p className="text-gray-400 text-xs text-center mt-6">
              Don't have an account?{" "}
              <a
                href="/auth/register"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
