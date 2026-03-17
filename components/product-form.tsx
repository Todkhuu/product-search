"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/lib/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import CloudinaryUpload from "./CloudinaryUpload";
import axios from "axios";
import { useCategory } from "@/app/_context/CategoryContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useProduct } from "@/app/_context/ProductContext";
import { Loader2 } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

const formSchema = z.object({
  productName: z
    .string()
    .min(4, { message: "Нэр хамгийн багадаа 4 тэмдэгт байх ёстой" })
    .max(150, { message: "Нэр хамгийн ихдээ 150 тэмдэгт байх ёстой" }),
  categories: z.string().min(1, { message: "Төрөл сонгоно уу" }),
  price: z
    .string()
    .min(1, { message: "Үнэ оруулна уу" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Үнэ зөв тоо байх ёстой",
    }),
  image: z.string().min(1, { message: "Зураг оруулна уу" }),
  barcode: z
    .string()
    .min(1, { message: "Баркод оруулна уу" })
    .refine((val) => /^\d+$/.test(val), {
      message: "Баркод зөвхөн тоо байх ёстой",
    }),
  unit: z.string().optional(),
});

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const isEditing = !!product;
  const [file, setFile] = useState<File>();
  const { categories } = useCategory();
  const { fetchData } = useProduct();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: product?.productName ?? "",
      categories: product?.category?._id ?? "",
      price: product?.price ?? "",
      image: product?.image ?? "",
      barcode: product?.barcode ?? "",
      unit: product?.unit ?? "",
    },
  });

  const getPublicIdFromUrl = (url: string) => {
    if (!url) return null;
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.split(".")[0];
  };

  const editProduct = async (
    id: string,
    values: z.infer<typeof formSchema>,
  ) => {
    setIsLoading(true);
    try {
      let imageUrl = values.image;
      if (file) {
        if (product?.image) {
          const oldPublicId = getPublicIdFromUrl(product.image);
          if (oldPublicId)
            await axios.post("/api/upload", { publicId: oldPublicId });
        }
        imageUrl = await handleUpload();
      }
      await axios.patch(`/api/product/productId`, {
        id,
        ...values,
        category: values.categories,
        image: imageUrl,
      });
      await fetchData();
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      let imageUrl = values.image;
      if (file) imageUrl = await handleUpload();

      await axios.post(`/api/product`, {
        ...values,
        category: values.categories,
        image: imageUrl,
      });
      await fetchData();
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    form.setValue("image", file.name, { shouldValidate: true });
  };

  const handleUpload = async () => {
    const PRESET_NAME = "product-search";
    const CLOUDINARY_NAME = "dt6hvljwz";

    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", PRESET_NAME);
    formData.append("api_key", CLOUDINARY_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing) {
      editProduct(product._id!, values);
    } else {
      addProduct(values);
    }
  };
  return (
    <DialogContent className="sm:max-w-150 w-[95vw] max-h-[95vh] overflow-y-auto p-6">
      <DialogTitle className="text-xl font-bold border-b pb-4 mb-4">
        {isEditing ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}
      </DialogTitle>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-6">
                <FormLabel className="text-sm font-medium text-zinc-500 sm:text-right">
                  Нэр
                </FormLabel>
                <div className="sm:col-span-3">
                  <FormControl>
                    <Input {...field} className="w-full h-10" />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-500">
                    Үнэ (₮)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-500">
                    Нэгж
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Төрөл */}
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-6">
                <FormLabel className="text-sm font-medium text-zinc-500 sm:text-right">
                  Төрөл
                </FormLabel>
                <div className="sm:col-span-3">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Төрөл сонгох" />
                      </SelectTrigger>
                      <SelectContent>
                        {(categories ?? []).map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Баркод */}
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-6">
                <FormLabel className="text-sm font-medium text-zinc-500 sm:text-right">
                  Баркод
                </FormLabel>
                <div className="sm:col-span-3">
                  <FormControl>
                    <Input {...field} className="w-full h-10" />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Зураг */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-6">
                <FormLabel className="text-sm font-medium text-zinc-500 sm:text-right mt-3">
                  Зураг
                </FormLabel>
                <div className="sm:col-span-3">
                  <FormControl>
                    <div className="border-2 border-dashed rounded-lg p-2 min-h-30 bg-zinc-50/50">
                      <CloudinaryUpload
                        handleFile={handleFile}
                        defaultImage={product?.image}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-32 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "Шинэчлэх"
              ) : (
                "Нэмэх"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
