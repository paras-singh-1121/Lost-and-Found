import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function ReportFound() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = ["Phone", "Laptop", "Book", "ID Card", "Watch", "Other"];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    setLoading(true);

    await axiosInstance.post("/items", form);

    alert("Item reported successfully!");

    setForm({
      title: "",
      description: "",
      category: "",
      location: "",
    });

  } catch (error) {
    alert(
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-4">
      <h2 className="text-3xl font-bold text-pink-600 text-center mb-6">
        Report Found Item
      </h2>

      <form
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md"
        onSubmit={handleSubmit}
      >
        <label className="font-semibold">Select Category</label>
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`px-4 py-2 rounded-full border transition ${
                form.category === c
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setForm({ ...form, category: c })}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          name="title"
          value={form.title}
          placeholder="Item Title"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Short description (optional)"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
        
        />

        <input
          name="location"
          value={form.location}
          placeholder="Where did you find it?"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="mt-4 w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
        >
          {loading ? "Submitting..." : "Submit Found Item"}
        </button>
      </form>
    </div>
  );
}