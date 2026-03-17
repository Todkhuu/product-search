import { Schema } from "mongoose";

export type ProductCategoryModelType = {
  _id: Schema.Types.ObjectId;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
};
