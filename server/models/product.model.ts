import { ProductModelType } from "../types";
import { Model, Schema, model, models } from "mongoose";

const ProductSchema = new Schema<ProductModelType>(
  {
    productName: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategories",
      required: true,
    },
    barcode: { type: String, unique: true, required: true },
    unit: { type: String, required: false },
  },
  { timestamps: true },
);

export const ProductModel: Model<ProductModelType> =
  models["Products"] || model<ProductModelType>("Products", ProductSchema);
