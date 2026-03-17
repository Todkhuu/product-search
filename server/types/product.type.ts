import { Schema } from "mongoose";
import { ProductCategoryModelType } from "./product-category.type";

export type ProductModelType = {
  _id: Schema.Types.ObjectId;
  productName: string;
  price: string;
  image: string;
  category: ProductCategoryModelType;
  barcode: string;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
};
