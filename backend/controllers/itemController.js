import Item from "../models/Item.js";


export const createItem = async (req, res) => {
  try {
    const { title, category, description, location } = req.body;

    const item = await Item.create({
      title,
      category,
      description: description || "",
      location,
      status: "found", 
      reporter: req.user._id,
    });

    res.status(201).json(item);

  } catch (error) {
    console.error("Create found item error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const createLostItem = async (req, res) => {
  try {
    const { title, category, description, location, imageUrl } = req.body;

    const item = await Item.create({
      title,
      category,
      description: description || "",
      location,
      imageUrl,
      status: "lost",
      reporter: req.user._id,
    });

    res.status(201).json(item);

  } catch (error) {
    console.error("Create lost item error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getItemById = async (req, res) => {
  try {

    const item = await Item.findById(req.params.id)
      .populate("reporter", "name email");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(item);

  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllFoundItems = async (req, res) => {
  try {

    const items = await Item.find({ status: "found" })
      .select("-claims")
      .populate("reporter", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(items);

  } catch (error) {
    console.error("Error fetching found items:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllLostItems = async (req, res) => {
  try {

    const items = await Item.find({ status: "lost" })
      .select("-claims")
      .populate("reporter", "name _id")
      .sort({ createdAt: -1 });

    res.status(200).json(items);

  } catch (error) {
    console.error("Error fetching lost items:", error);
    res.status(500).json({ message: error.message });
  }
};


export const searchItems = async (req, res) => {
  try {
    const { category, status } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const items = await Item.find(query)
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};