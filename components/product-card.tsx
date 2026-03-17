"use client";
import Image from "next/image";
import { Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { ProductForm } from "./product-form";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const lastFourDigits = String(product.barcode).slice(-4);

  return (
    <Card className="flex flex-row items-center gap-4 p-4">
      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="size-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate">
            {product.productName}
          </h3>
          <span className="shrink-0 px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
            {product.unit}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          <span className="font-mono text-xs">{product.barcode}</span>
          <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
            {lastFourDigits}
          </span>
        </p>

        {/* Үнэ нэмэх */}
        <p className="text-sm font-semibold text-foreground mt-1">
          {Number(product.price).toLocaleString("mn-MN")}₮
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-4" />
            </Button>
          </DialogTrigger>
          <ProductForm product={product} onSuccess={() => setOpen(false)} />
        </Dialog>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(product._id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
