import { ProductCategoryModelType } from "../types";
import { Model, Schema, model, models } from "mongoose";

const ProductCategorySchema = new Schema<ProductCategoryModelType>(
  {
    categoryName: { type: String, required: true },
  },
  { timestamps: true },
);

export const ProductCategoryModel: Model<ProductCategoryModelType> =
  models["ProductCategories"] ||
  model<ProductCategoryModelType>("ProductCategories", ProductCategorySchema);
