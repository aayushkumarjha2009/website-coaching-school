// models/item.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  pass: { type: String, required: true },
  token: { type: String, required: true },
});

const Master = mongoose.models.Master || mongoose.model("Master", ItemSchema);

export default Master;
