import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const [form, setForm] = useState({
    collegeId: "",
    password: "",
  });

  const navigate = useNavigate();

  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.collegeId.endsWith("@tmu.ac.in")) {
      return alert("College ID must be a valid TMU email (example@tmu.ac.in)");
    }

    const success = await login({
      identifier: form.collegeId,
      password: form.password,
    });

    if (success !== false) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
     
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            College ID (TMU Email)
          </label>
          <input
            type="text"
            name="collegeId"
            placeholder="example@tmu.ac.in"
            value={form.collegeId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-pink-300"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-pink-300"
          />
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-pink-600 hover:bg-pink-700 transition text-white py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-4">
          Don't have an account?
          <Link to="/register" className="text-pink-600 font-semibold ml-1">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
