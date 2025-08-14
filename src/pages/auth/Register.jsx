import useAuthStore from "@/stores/authStore";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/utils/api";

export default function Register() {
  const navigate = useNavigate();
  const {
    name,
    email,
    password,
    confirmPassword,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    resetForm,
  } = useAuthStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      await registerUser({ username: name, email, password, confirmPassword });
      alert("Account created! Please log in.");
      navigate("/auth/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center">
        <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
          <h1 className="text-white text-center text-sm font-medium mb-8 tracking-wide">
            Join <span className="text-purple-400 font-bold">BLINK!</span>
          </h1>

          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-gray-700 text-white pl-4 py-3 rounded-xl border border-gray-600 focus:border-purple-400 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-700 text-white pl-4 py-3 rounded-xl border border-gray-600 focus:border-purple-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-700 text-white pl-4 py-3 rounded-xl border border-gray-600 focus:border-purple-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-gray-700 text-white pl-4 py-3 rounded-xl border border-gray-600 focus:border-purple-400 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-400 text-white py-3 rounded-xl font-semibold hover:bg-purple-500 transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-gray-400 text-xs text-center mt-6">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-purple-400 hover:text-purple-300"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
