"use client";

import { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { Loader2, Package } from "lucide-react";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  search: string;
  onDelete: (id: string) => void;
}

export function ProductList({
  isLoading,
  products,
  search,
  onDelete,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Уншиж байна...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Package className="size-16 text-muted-foreground/50" />
        <div className="text-center">
          <h3 className="font-medium text-foreground">
            {search ? "Бараа олдсонгүй" : "Бараа байхгүй байна"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? `"${search}" гэсэн хайлтаар бараа олдсонгүй`
              : "Шинэ бараа нэмэхийн тулд + товчийг дарна уу"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {" "}
        <span>
          {search
            ? `"${search}" хайлтаар ${products.length} бараа олдлоо`
            : `Нийт ${products.length} бараа`}
        </span>
      </div>
      {products.map((product) => (
        <ProductCard product={product} key={product._id} onDelete={onDelete} />
      ))}
    </div>
  );
}
