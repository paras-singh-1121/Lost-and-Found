import Message from "../models/Message.js";
import Item from "../models/Item.js";


// SEND MESSAGE (SECURED)
export const sendMessage = async (req, res) => {
  try {

    const sender = req.user._id;
    const { receiver, text, itemId } = req.body;

    // 🔥 GET ITEM
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // ✅ CASE 1: LOST ITEM → ALWAYS ALLOW
    if (item.status === "lost") {
      const message = await Message.create({
        sender,
        receiver,
        item: itemId,
        text,
      });

      return res.json(message);
    }

    // 🔴 CASE 2: FOUND ITEM → CHECK APPROVAL

    const isOwner =
      item.reporter.toString() === sender.toString();

    // ✅ Owner (finder) can always chat
    if (isOwner) {
      const message = await Message.create({
        sender,
        receiver,
        item: itemId,
        text,
      });

      return res.json(message);
    }

    // ✅ Check approved claim
    const approvedClaim = item.claims.find(
      (c) =>
        c.claimer.toString() === sender.toString() &&
        c.status === "approved"
    );

    if (!approvedClaim) {
      return res.status(403).json({
        message: "You are not allowed to chat yet. Wait for approval.",
      });
    }

    // ✅ ALLOWED → SEND MESSAGE
    const message = await Message.create({
      sender,
      receiver,
      item: itemId,
      text,
    });

    res.json(message);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};



// GET CHAT HISTORY
export const getMessages = async (req, res) => {
  try {

    const myId = req.user._id;
    const { userId, itemId } = req.params;

    const messages = await Message.find({
      item: itemId,
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    const item = await Item.findById(itemId)
      .select("title category status");

    res.json({
      messages,
      item,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET CHAT LIST
export const getChatList = async (req, res) => {
  try {

    const myId = req.user._id.toString();

    const messages = await Message.find({
      $or: [
        { sender: myId },
        { receiver: myId },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .populate("item", "category title status");

    const map = {};

    messages.forEach((m) => {

      if (!m.item) return;

      const senderId = m.sender._id.toString();
      const receiverId = m.receiver._id.toString();

      const isMeSender = senderId === myId;

      const otherUser = isMeSender ? m.receiver : m.sender;

      const key = `${otherUser._id}_${m.item._id}`;

      map[key] = {
        userId: otherUser._id,
        userName: otherUser.name,
        itemId: m.item._id,
        itemName: m.item.category || m.item.title,
        itemStatus: m.item.status, // 🔥 ADD THIS
      };

    });

    const chats = Object.values(map);

    res.json(chats);

  } catch (err) {
    console.log("CHAT LIST ERROR:", err);
    res.status(500).json({ msg: "list error" });
  }
};