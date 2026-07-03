import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export default function ItemClaims() {

  const { itemId } = useParams();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);


  useEffect(() => {
    fetchClaims();
  }, []);


async function fetchClaims() {
  try {
    const { data } = await axiosInstance.get(`/claim/${itemId}`);

    setClaims(Array.isArray(data) ? data : []);
  } catch (err) {
    console.log(err);
    setClaims([]);
  } finally {
    setLoading(false);
  }
}


async function approveClaim(claimId) {
  try {
    setProcessingId(claimId);

    const { data } = await axiosInstance.patch(
      `/claim/${itemId}/${claimId}/approve`
    );

    alert("✅ Claim approved!");

    window.location.href =
      `/chat?userId=${data.claimerId}&itemId=${itemId}`;

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      err.message ||
      "Something went wrong"
    );
  } finally {
    setProcessingId(null);
  }
}


async function rejectClaim(claimId) {
  try {
    setProcessingId(claimId);

    await axiosInstance.patch(
      `/claim/${itemId}/${claimId}/reject`
    );

    alert("❌ Claim rejected!");

    fetchClaims();

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      err.message ||
      "Something went wrong"
    );
  } finally {
    setProcessingId(null);
  }
}


  if (loading) {
    return (
      <div className="pt-28 text-center text-lg">
        Loading claims...
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-slate-50 pt-28 px-4">

      <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">
        Claim Requests
      </h2>


      <div className="max-w-3xl mx-auto space-y-4">

        {claims.length === 0 && (
          <p className="text-center text-gray-500">
            No claims yet
          </p>
        )}


        {claims.map((c) => (

          <div
            key={c._id}
            className="bg-white p-4 rounded-xl shadow-md"
          >

            {/* USER */}
            <p className="font-semibold text-lg">
              {c.claimer?.name || "User"}
            </p>

            <p className="text-sm text-gray-500 mb-2">
              {c.claimer?.email}
            </p>


            {/* ANSWERS */}
            <div className="bg-gray-50 p-3 rounded-lg mb-3">

              <p className="font-semibold mb-1">
                Answers:
              </p>

              {c.answers.map((a, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-semibold">
                    Q{i + 1}: {a.question}
                  </p>
                  <p className="text-sm text-gray-600 ml-2">
                    ➤ {a.answer}
                  </p>
                </div>
              ))}

            </div>


            {/* STATUS */}
            <p className="text-sm mb-2">
              Status:{" "}
              <span className="font-semibold capitalize">
                {c.status}
              </span>
            </p>


            {/* ACTION BUTTONS */}
            {c.status === "pending" && (

              <div className="flex gap-2">

                <button
                  disabled={processingId === c._id}
                  onClick={() => approveClaim(c._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {processingId === c._id ? "Processing..." : "Approve"}
                </button>

                <button
                  disabled={processingId === c._id}
                  onClick={() => rejectClaim(c._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {processingId === c._id ? "Processing..." : "Reject"}
                </button>

              </div>

            )}


            {/* STATUS BADGES */}
            {c.status === "approved" && (

              <div className="flex justify-between items-center mt-2">
            
                <p className="text-green-600 font-semibold">
                  ✅ Approved
                </p>
            
                <button
                  onClick={() =>
                    window.location.href =
                      `/chat?userId=${c.claimer._id}&itemId=${itemId}`
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  Chat Now
                </button>
            
              </div>
            
            )}

            {c.status === "rejected" && (
              <p className="text-red-600 font-semibold">
                ❌ Rejected
              </p>
            )}

          </div>

        ))}

      </div>

    </div>

  );

}