import { NextRequest, NextResponse } from "next/server";
import { ProductCategoryModel } from "@/server/models";
import { connectMongoDB } from "@/server/database";
import { Product } from "@/lib/types";

export async function GET(_: NextRequest) {
  try {
    await connectMongoDB();

    const productCategoriesWithCount = await ProductCategoryModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          _id: "$_id",
          categoryName: "$categoryName",
          count: { $size: "$products" },
          products: "$products",
        },
      },
    ]);

    const formattedResponse = productCategoriesWithCount.map((category) => ({
      _id: category._id.toString(),
      categoryName: category.categoryName,
      count: category.count,
      products:
        category.products?.map((product: Product) => ({
          _id: product._id.toString(),
          name: product.productName,
          image: product.image,
          price: product.price,
          unit: product.unit,
          barcode: product.barcode,
        })) || [],
    }));

    return NextResponse.json(formattedResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching product categories:", error);

    return NextResponse.json(
      {
        message: "An error occurred while fetching product categories.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 },
    );
  }
}
