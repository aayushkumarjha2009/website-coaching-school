// models/item.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  pass: { type: String },
  token: { type: String },
  ids: {type:String}
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", ItemSchema);

export default Admin;
