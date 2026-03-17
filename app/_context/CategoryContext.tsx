"use client";
import { ProductCategory } from "@/lib/types";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type CategoryContextType = {
  categories: ProductCategory[];
  setCategories: (_categories: ProductCategory[]) => void;
};

export const CategoryContext = createContext<CategoryContextType>(
  {} as CategoryContextType,
);

export const useCategory = () => {
  return useContext(CategoryContext);
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  console.log("categoriess", categories);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`/api/product-category`);
      setCategories(data.data);
      console.log("data", data);
    };
    fetchData();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
