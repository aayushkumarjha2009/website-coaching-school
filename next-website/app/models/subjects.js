// models/item.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
    {
        name: {type:String},
        target: {type:Array},
        level: {type:Array},
        units: {type:Array},
    }
);

const Subject = mongoose.models.Subject || mongoose.model("Subject", ItemSchema);

export default Subject;
