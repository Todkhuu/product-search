import { ProductModelType } from "../types";
import { Model, Schema, model, models } from "mongoose";

const ProductSchema = new Schema<ProductModelType>(
  {
    productName: { type: String, required: false, default: "" },
    price: { type: String, required: false, default: "" },
    image: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategories",
      required: false,
      set: (v: string) => (v === "" ? null : v),
    },
    barcode: { type: String, unique: true, required: true },
    unit: { type: String, required: false, default: "" },
  },
  { timestamps: true },
);

export const ProductModel: Model<ProductModelType> =
  models["Products"] || model<ProductModelType>("Products", ProductSchema);
