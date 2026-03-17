"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SearchHeader } from "@/components/search-header";
import { ProductList } from "@/components/product-list";
import { useProduct } from "./_context/ProductContext";
import { useState } from "react";
import {
  cyrillicToLatinMap,
  latinToCyrillicMap,
  transliterate,
} from "@/lib/transliteration";
import axios from "axios";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "@/components/product-form";

export default function InventoryPage() {
  const { isLoading, products } = useProduct();
  const [search, setSearch] = useState("");
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredProducts = products?.filter((product) => {
    const productName = product.productName.toLowerCase();
    const searchText = search.toLowerCase();

    // number эсэхийг шалгах
    const isNumber = /^\d+$/.test(searchText);

    const serviceLatin = transliterate(productName, cyrillicToLatinMap);
    const serviceCyrillic = transliterate(productName, latinToCyrillicMap);

    const searchLatin = transliterate(searchText, cyrillicToLatinMap);
    const searchCyrillic = transliterate(searchText, latinToCyrillicMap);

    const matchSearch =
      productName.includes(searchText) ||
      serviceLatin.includes(searchText) ||
      serviceCyrillic.includes(searchText) ||
      productName.includes(searchLatin) ||
      productName.includes(searchCyrillic);

    // barcode search
    const barcode = String(product.barcode);
    const last4 = barcode.slice(-4);
    const matchBarcode = last4.includes(searchText);

    // number бол barcode, text бол name
    if (isNumber) {
      return matchBarcode;
    }

    return matchSearch;
  });

  const handleDelete = async () => {
    if (!deletingProductId) return;
    try {
      await axios.delete(`/api/product/productId`, {
        data: { deletingProductId },
      });
      setDeletingProductId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SearchHeader search={search} setSearch={setSearch} />

      <main className="flex-1">
        <ProductList
          isLoading={isLoading}
          products={filteredProducts}
          search={search}
          onDelete={(id) => setDeletingProductId(id)}
        />
      </main>

      {/* Floating Add Button */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg"
          >
            <Plus className="size-6" />
          </Button>
        </DialogTrigger>
        {/* product prop дамжуулахгүй = add mode */}
        <ProductForm onSuccess={() => setIsAddOpen(false)} />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingProductId}
        onOpenChange={(open) => !open && setDeletingProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Бараа устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Та энэ барааг устгахдаа итгэлтэй
              байна уу?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Устгах</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
