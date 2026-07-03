import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

export default function FoundItems() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [claimId, setClaimId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [search, setSearch] = useState("");

  const { authUser } = useAuthStore();

  useEffect(() => {
    fetchItems();
  }, []);

async function fetchItems() {
  try {
    const { data } = await axiosInstance.get("/items");
    setItems(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  /* GET CLAIM STATUS */

  async function getMyClaimStatus(itemId) {
  try {
    const { data } = await axiosInstance.get(
      `/claim/${itemId}`
    );

    return data.find(
      (c) =>
        c.claimer?._id?.toString() ===
        authUser._id?.toString()
    );
  } catch (err) {
    console.log(err);
    return null;
  }
}

  /* START / RESUME CLAIM */

  async function startClaim(itemId) {
  try {
    const { data } = await axiosInstance.post(
      `/claim/${itemId}/start`
    );

    setClaimId(data.claimId);
    setCurrentQuestion(data.question);
    setSelectedItemId(itemId);
    setShowClaimModal(true);

  } catch (error) {
    alert(
      error.response?.data?.message ||
      error.message
    );
  }
}

  /* SUBMIT ANSWER */
  async function submitAnswer() {
  try {
    const { data } = await axiosInstance.post(
      `/claim/${selectedItemId}/${claimId}/answer`,
      { answer }
    );

    setAnswer("");

    if (data.nextQuestion) {
      setCurrentQuestion(data.nextQuestion);
    } else {
      setShowClaimModal(false);
      alert("✅ Claim submitted! Waiting for approval.");
      fetchItems();
    }

  } catch (error) {
    alert(
      error.response?.data?.message ||
      error.message
    );
  }
}

  /*
  
  FILTER ITEMS
  
  */
  const filteredItems = items.filter((item) =>
    `${item.category} ${item.title} ${item.description}`
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="pt-28 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-4">

      <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">
        Found Items
      </h2>

      {/* SEARCH */}
      <div className="max-w-5xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search (phone, book, laptop...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {filteredItems.length === 0 && (
          <p className="col-span-2 text-center text-gray-500">
            No items found
          </p>
        )}

        {filteredItems.map((item) => {

          const isOwner =
            item.reporter?._id?.toString() ===
            authUser?._id?.toString();

          return (
            <ItemCard
              key={item._id}
              item={item}
              isOwner={isOwner}
              startClaim={startClaim}
              getMyClaimStatus={getMyClaimStatus}
            />
          );
        })}

      </div>

      {/* MODAL */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md p-6 rounded-xl">

            <h3 className="text-xl font-bold mb-4 text-pink-600">
              Claim Verification
            </h3>

            <p className="mb-4">{currentQuestion}</p>

            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowClaimModal(false)}>
                Cancel
              </button>
              <button onClick={submitAnswer}>
                Submit
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


function ItemCard({ item, isOwner, startClaim, getMyClaimStatus }) {

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!isOwner) fetchStatus();
  }, []);

  async function fetchStatus() {
    const claim = await getMyClaimStatus(item._id);

    if (claim?.status) {
      setStatus(claim.status);
    } else {
      setStatus("none");
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">

      <h3 className="text-xl font-bold">{item.title}</h3>
      <p>{item.description}</p>
      <p>📍 {item.location}</p>
      <p>Category: {item.category}</p>

      {/* ADDED BACK (finder name) */}
      <p className="text-sm text-gray-500 mt-2">
        Found by{" "}
        <span className="font-semibold text-gray-700">
          {isOwner ? "You" : item.reporter?.name}
        </span>
      </p>

      {isOwner && (
        <button
          onClick={() =>
            window.location.href = `/claims/${item._id}`
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          View Claims
        </button>
      )}

      {!isOwner && status !== "loading" && (
        <>
          {status === "none" && (
            <button
              onClick={() => startClaim(item._id)}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg"
            >
              Claim This Item
            </button>
          )}

          {status === "in_progress" && (
            <button
              onClick={() => startClaim(item._id)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              Continue Claim
            </button>
          )}

          {status === "pending" && (
            <p className="text-yellow-600">⏳ Waiting for approval</p>
          )}

          {status === "rejected" && (
            <p className="text-red-600">❌ Claim rejected</p>
          )}

          {status === "approved" && (
            <button
              onClick={() =>
                window.location.href =
                  `/chat?userId=${item.reporter._id}&itemId=${item._id}`
              }
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              💬 Chat with Finder
            </button>
          )}
        </>
      )}

    </div>
  );
}