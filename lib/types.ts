export interface Product {
  _id: string;
  productName: string;
  barcode: string;
  price: string;
  category: Category;
  image: string;
  unit?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = {
  _id: string;
  categoryName: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
  count: number;
};
