import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

export default function LostItems() {

  const { authUser, isCheckingAuth } = useAuthStore();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEARCH STATE
  const [search, setSearch] = useState("");

  // FETCH ITEMS AFTER AUTH
  useEffect(() => {
    if (isCheckingAuth) return;
    if (!authUser) return;

    fetchItems();
  }, [authUser, isCheckingAuth]);

async function fetchItems() {
  try {
    setLoading(true);

    const { data } = await axiosInstance.get("/items/lost");

    setItems(data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  // FILTER LOGIC (SMART SEARCH)
  const filteredItems = items.filter((item) =>
    `${item.category} ${item.title} ${item.description}`
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // LOADING STATE
  if (isCheckingAuth || !authUser || loading) {
    return (
      <div className="pt-28 text-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-4">

      <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">
        Lost Items
      </h2>

      {/* SEARCH BAR */}
      <div className="max-w-5xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search (phone, book, laptop...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* NO RESULTS */}
        {filteredItems.length === 0 && (
          <p className="col-span-2 text-center text-gray-500">
            No items found
          </p>
        )}

        {filteredItems.map((item) => {

          const isOwner =
            item.reporter?._id === authUser._id;

          return (
            <div
              key={item._id}
              className="bg-white p-5 rounded-xl shadow-md"
            >

              {/* IMPROVED IMAGE UI */}
              {item.imageUrl && (
                <div className="w-full h-56 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt="item"
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={() => window.open(item.imageUrl, "_blank")}
                  />
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600 mb-2">
                {item.description}
              </p>

              <p className="text-sm text-gray-500 mb-1">
                📍 {item.location}
              </p>

              <p className="text-sm text-gray-500 mb-2">
                Category: {item.category}
              </p>

              <p className="text-sm text-gray-500 mb-3">
                Lost by{" "}
                <span className="font-semibold">
                  {isOwner ? "You" : item.reporter?.name}
                </span>
              </p>

              {/* CHAT BUTTON */}
              {!isOwner && (
                <button
                  onClick={() =>
                    window.location.href =
                      `/chat?userId=${item.reporter._id}&itemId=${item._id}`
                  }
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg"
                >
                  💬 Chat with Owner
                </button>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}