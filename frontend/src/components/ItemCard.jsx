import React from "react";

export default function ItemCard({ item }) {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition cursor-pointer">
      <img
        src={item.image}
        alt={item.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        <p className="text-sm text-gray-600 mt-1">Location: {item.location}</p>

        <p
          className={`text-sm font-semibold mt-2 ${
            item.status === "Lost" ? "text-red-600" : "text-green-600"
          }`}
        >
          Status: {item.status}
        </p>
      </div>
    </div>
  );
}
