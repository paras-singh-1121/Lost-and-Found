import React, { useState } from "react";

export default function ImageUpload({ onUpload }) {
  const [preview, setPreview] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold text-gray-700">
        Upload Image
      </label>

      <input
        type="file"
        accept="image/*"
        className="w-full border p-3 rounded cursor-pointer"
        onChange={handleFileChange}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-3 w-40 h-40 object-cover rounded-lg shadow"
        />
      )}
    </div>
  );
}
