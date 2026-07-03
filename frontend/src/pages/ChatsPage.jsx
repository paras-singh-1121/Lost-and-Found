import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

export default function ChatsPage() {

  const { authUser } = useAuthStore();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchChats();
  }, []);


  async function fetchChats() {
  try {
    const { data } = await axiosInstance.get(
      "/chat/list/all"
    );

    if (Array.isArray(data)) {
      setChats(data);
    } else {
      setChats([]);
    }

  } catch (err) {
    console.log(err);
    setChats([]);
  } finally {
    setLoading(false);
  }
}


  if (loading) {
    return (
      <div className="pt-28 text-center text-lg">
        Loading chats...
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-slate-50 pt-28 px-4">

      <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">
        Your Chats
      </h2>


      <div className="max-w-3xl mx-auto space-y-4">

        {chats.length === 0 && (
          <p className="text-center text-gray-500">
            No chats yet
          </p>
        )}


        {chats.map((chat, index) => (

          <div
  key={index}
  className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
>

  <div>
    <p className="font-semibold text-lg text-gray-800">
      {chat.userName}
    </p>

    <p className="text-sm text-gray-500">
      🧳 {chat.itemName}
    </p>
  </div>

  <button
    onClick={() =>
      window.location.href =
        `/chat?userId=${chat.userId}&itemId=${chat.itemId}`
    }
    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
  >
    Open Chat
  </button>

</div>

        ))}

      </div>

    </div>

  );

}