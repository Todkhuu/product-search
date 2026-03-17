"use client";
import Image from "next/image";
import { Pencil, Trash2, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ProductForm } from "./product-form";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const lastFourDigits = String(product.barcode).slice(-4);

  return (
    <Card className="flex flex-row items-center gap-4 p-4">
      <div
        className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-muted cursor-zoom-in active:scale-95 transition-transform"
        onClick={() => product.image && setIsImageOpen(true)}
      >
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
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
          {/* Accessibility-д зориулсан нуугдмал гарчиг */}
          <VisuallyHidden>
            <DialogTitle>{product.productName} зураг</DialogTitle>
            <DialogDescription>
              Барааны зургийг томоор харуулж байна
            </DialogDescription>
          </VisuallyHidden>

          <div className="relative w-full h-full flex items-center justify-center">
            {product.image && (
              <img
                src={product.image}
                alt={product.productName}
                className="max-w-full max-h-[90vh] rounded-lg object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
