import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Home() {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 pt-28 flex flex-col items-center px-4">

      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 drop-shadow-sm leading-tight">
          Lost & Found – Smart Campus System
        </h1>

        <p className="text-gray-700 mt-4 text-lg">
          Report lost or found items, claim belongings securely,
          and connect with the right person instantly.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-5 mt-12 flex-wrap justify-center">

        <Link
          to="/found-items"
          className="bg-slate-800 hover:bg-slate-900 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-md hover:shadow-lg"
        >
          View Found Items 👀
        </Link>

        <Link
          to="/lost-items"
          className="bg-white hover:bg-slate-900 text-slate-800 px-7 py-3 rounded-2xl font-semibold transition hover:text-white shadow-md hover:shadow-lg"
        >
          View Lost Items 👀
        </Link>

        {authUser && (
          <>
            <Link
              to="/report-found-item"
              className="bg-pink-600 hover:bg-pink-900 text-white px-7 py-3 rounded-2xl font-semibold transition hover:shadow-lg"
            >
              Report Found Item ➕
            </Link>

            <Link
              to="/report-lost-item"
              className="bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-7 py-3 rounded-2xl font-semibold transition hover:shadow-lg"
            >
              Report Lost Item 🔎
            </Link>
          </>
        )}
      </div>

      {/* Footer Tagline */}
      <div className="mt-14 text-gray-500 text-sm tracking-wide">
        Helping campus recover lost items faster 💡
      </div>
    </div>
  );
}
