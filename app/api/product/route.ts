export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { ProductModel } from "@/server/models";
import { connectMongoDB } from "@/server/database";
import { ProductCategoryModelType } from "@/server/types";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const productCategoryId = searchParams.get("productCategoryId");
    const offset = Number(searchParams.get("offset") || 0);
    const limit = Number(searchParams.get("limit") || 20);

    const filter = productCategoryId
      ? { category: productCategoryId as unknown as ProductCategoryModelType }
      : {};

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate("category");

    const totalProducts = await ProductModel.countDocuments(filter);

    return NextResponse.json(
      { total: totalProducts, products },
      { status: 200 },
    );
  } catch (error) {
    console.error("Бүтээгдэхүүн татах үед алдаа гарлаа:", error);
    return NextResponse.json(
      {
        message: "Бүтээгдэхүүнүүдийг авах үед алдаа гарлаа",
        error: error instanceof Error ? error.message : "Тодорхойгүй алдаа",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const productData = await req.json();

    const newProduct = await ProductModel.create(productData);

    return NextResponse.json(
      { message: "Бүтээгдэхүүн амжилттай үүслээ", newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Бүтээгдэхүүн үүсгэх үед алдаа гарлаа:", error);
    return NextResponse.json(
      {
        message: "Бүтээгдэхүүн үүсгэх үед алдаа гарлаа",
        error: error instanceof Error ? error.message : "Тодорхойгүй алдаа",
      },
      { status: 500 },
    );
  }
}
