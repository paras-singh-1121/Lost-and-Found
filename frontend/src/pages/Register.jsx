import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {axiosInstance} from "../lib/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    collegeId: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const navigate = useNavigate();
  const { register, isRegistering } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!form.collegeId.endsWith("@tmu.ac.in")) {
      return alert("College ID must be a valid TMU email (example@tmu.ac.in)");
    }

    try {
      setIsSendingOtp(true);
      await axiosInstance.post("/otp/send", { email: form.collegeId });
      setOtpSent(true);
      alert("OTP sent! Check your email.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setIsVerifyingOtp(true);
      await axiosInstance.post("/otp/verify", {
        email: form.collegeId,
        otp,
      });

      setOtpVerified(true);
      alert("OTP verified! Now complete registration.");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Final Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      return alert("Please verify OTP first");
    }

    const success = await register(form);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-pink-300"
          />
        </div>

        {/* College Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            College ID (TMU Email)
          </label>
          <input
            type="text"
            name="collegeId"
            placeholder="College email id (example@tmu.ac.in)"
            value={form.collegeId}
            onChange={handleChange}
            required
            disabled={otpSent}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-pink-300"
          />
        </div>

        {/* Password */}
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

        {/* Send OTP Button */}
        {!otpSent && (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isSendingOtp}
            className="w-full bg-pink-600 hover:bg-pink-700 transition text-white py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* OTP Input */}
        {otpSent && !otpVerified && (
          <div className="mb-4 mt-4">
            <label className="block font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-pink-300"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 mt-2 transition text-white py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Final Register */}
        {otpVerified && (
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded-lg font-semibold mt-2 disabled:opacity-50"
          >
            {isRegistering
              ? "Registering..."
              : "Complete Registration"}
          </button>
        )}

        <p className="text-center text-sm mt-4">
          Already have an account?
          <Link to="/login" className="text-pink-600 font-semibold ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
