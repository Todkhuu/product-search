import { NextRequest, NextResponse } from "next/server";
import { ProductCategoryModel } from "@/server/models";
import { connectMongoDB } from "@/server/database";

connectMongoDB();

export async function GET(_: NextRequest) {
  try {
    const allProductCategories = await ProductCategoryModel.find();

    return NextResponse.json(allProductCategories, { status: 200 });
  } catch (error) {
    console.error("Бүтээгдэхүүний ангиллуудыг авах үед алдаа гарлаа:", error);

    return NextResponse.json(
      {
        message: "Бүтээгдэхүүний ангиллуудыг авах үед алдаа гарлаа",
        error: error instanceof Error ? error.message : "Тодорхойгүй алдаа",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const productCategoryData = await req.json();

    const newFoodCategory =
      await ProductCategoryModel.create(productCategoryData);

    return NextResponse.json(
      { message: "Бүтээгдэхүүний ангилал амжилттай үүслээ", newFoodCategory },
      { status: 201 },
    );
  } catch (error) {
    console.error("Бүтээгдэхүүний ангилал үүсгэх үед алдаа гарлаа:", error);

    return NextResponse.json(
      {
        message: "Бүтээгдэхүүний ангилал үүсгэх үед алдаа гарлаа",
        error: error instanceof Error ? error.message : "Тодорхойгүй алдаа",
      },
      { status: 500 },
    );
  }
}
