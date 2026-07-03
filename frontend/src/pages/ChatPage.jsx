import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../lib/socket";
import { axiosInstance } from "../lib/axios";

export default function ChatPage() {

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const itemId = searchParams.get("itemId");

  const { authUser } = useAuthStore();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  const [item, setItem] = useState(null);

  const room =
    authUser && userId && itemId
      ? [authUser._id, userId, itemId].sort().join("_")
      : null;


  /*
   CHECK ACCESS
  */
  useEffect(() => {
    if (!authUser || !itemId) return;
    checkAccess();
  }, [authUser, itemId]);


  async function checkAccess() {
    try {

      const { data: itemData } = await axiosInstance.get(
  `/items/${itemId}`
);
      setItem(itemData);

      if (!itemData || !itemData.status) {
        setIsAllowed(false);
        return;
      }

      if (itemData.status === "lost") {
        setIsAllowed(true);
        return;
      }

      if (itemData.reporter?._id === authUser._id) {
        setIsAllowed(true);
        return;
      }

      const { data: claims } = await axiosInstance.get(
  `/claim/${itemId}`
);

      const approved = claims?.find(
        (c) =>
          c.claimer?._id === authUser._id &&
          c.status === "approved"
      );

      if (approved) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }

    } catch (err) {
      console.log("ACCESS ERROR:", err);
      setIsAllowed(false);
    } finally {
      setChecking(false);
    }
  }


 
  useEffect(() => {

    if (!room || !isAllowed) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", { room });

    fetchMessages();

  }, [room, isAllowed]);


  useEffect(() => {

    const handleMessage = (msg) => {
      if (msg.itemId !== itemId) return;
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };

  }, [itemId]);


  async function fetchMessages() {
    if (!userId || !itemId) return;

    try {

      const { data } = await axiosInstance.get(
        `/chat/${userId}/${itemId}`
);

      setMessages(Array.isArray(data.messages) ? data.messages : []);

      if (!item && data.item) {
        setItem(data.item);
      }

    } catch (err) {
      console.log("FETCH MSG ERROR:", err);
      setMessages([]);
    }
  }


  async function sendMessage() {
  if (!input.trim() || !room) return;

  try {
    await axiosInstance.post("/chat/send", {
      receiver: userId,
      itemId,
      text: input,
    });

    socket.emit("message", {
      room,
      sender: authUser._id,
      receiver: userId,
      itemId,
      text: input,
    });

    setInput("");

  } catch (err) {
    console.log("SEND ERROR:", err);
  }
}



  if (checking) {
    return (
      <div className="pt-24 text-center">
        Checking access...
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="pt-24 text-center text-lg">
        ⏳ Waiting for finder approval...
      </div>
    );
  }


  return (

    <div className="min-h-screen pt-24 flex justify-center bg-slate-100">

      <div className="w-full max-w-3xl bg-white flex flex-col h-[80vh] rounded-lg shadow">

        {/* HEADER */}
        <div className="bg-pink-600 text-white p-4 font-semibold">
          Chat about: {item?.title || item?.category || "Item"}
        </div>


        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">

          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.sender === authUser._id
                  ? "bg-pink-500 text-white ml-auto p-2 rounded max-w-xs"
                  : "bg-gray-200 p-2 rounded max-w-xs"
              }
            >
              {m.text}
            </div>
          ))}

        </div>


        {/* INPUT */}
        <div className="p-3 flex gap-2 border-t">

          <input
            className="flex-1 border p-2 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
          />

          <button
            onClick={sendMessage}
            className="bg-pink-600 text-white px-4 rounded"
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

}