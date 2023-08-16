import mongoose from "mongoose";
const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name!!!"],
      trim: true,
      maxLength: [120, "Collection name should not be more thn 120 chars"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);

//collections
