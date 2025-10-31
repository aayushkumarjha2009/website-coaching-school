// models/item.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        pass: { type: String, required: true },
        stid: { type: Number, required: true, unique: true },
        class: { type: String, required: true },
        token: { type: String, required: true },
        subject: { type: Array, required: true }
    }
);

const Student = mongoose.models.Student || mongoose.model("Student", ItemSchema);

export default Student;
