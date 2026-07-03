import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import { axiosInstance } from "../lib/axios"; 

export default function ReportLost() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image: null,
  });

  const categories = [
    "Phone",
    "Laptop",
    "Book",
    "ID Card",
    "Watch",
    "Other",
  ];

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImage(file) {
    setForm({
      ...form,
      image: file,
    });
  }

  // convert file to base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  }

async function handleSubmit(e) {
  e.preventDefault();

  try {
    if (!form.category) {
      alert("Please select category");
      return;
    }

    let imageUrl = "";

    if (form.image) {
      imageUrl = await toBase64(form.image);
    }

    await axiosInstance.post("/items/lost", {
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      imageUrl,
    });

    alert("Lost item reported successfully");

    setForm({
      title: "",
      description: "",
      category: "",
      location: "",
      image: null,
    });

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Error reporting lost item"
    );
  }
}

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-4">

      <h2 className="text-3xl font-bold text-pink-600 text-center mb-6">
        Report Lost Item
      </h2>

      <form
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md"
        onSubmit={handleSubmit}
      >

        {/* Category */}

        <label className="font-semibold">
          Select Category
        </label>

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
              onClick={() =>
                setForm({
                  ...form,
                  category: c,
                })
              }
            >
              {c}
            </button>
          ))}
        </div>

        <input
          name="title"
          placeholder="Item Title"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          value={form.title}
          required
        />

        <textarea
          name="description"
          placeholder="Describe the lost item (optional)"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          value={form.description}
          
        />

        <input
          name="location"
          placeholder="Where did you lose it?"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          value={form.location}
          required
        />

        <ImageUpload onUpload={handleImage} />

        <button
          type="submit"
          className="mt-4 w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
        >
          Submit Lost Item
        </button>

      </form>
    </div>
  );
}