"use client";
import { Product } from "@/lib/types";
import axios from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type ProductContextType = {
  products: Product[];
  setProducts: (_foods: Product[]) => void;
  fetchData: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType,
);

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const product = await axios.get(`/api/product`);
      setProducts(product.data.products);
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, setProducts, fetchData, isLoading, setIsLoading }}
    >
      {children}
    </ProductContext.Provider>
  );
};
