import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/database";
import { ProductModel } from "@/server/models";

connectMongoDB();

export async function GET(req: NextRequest) {
  try {
    const productData = await req.json();

    const product = await ProductModel.findById(productData.id);

    if (!product) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Success", product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);

    return NextResponse.json(
      {
        message: "An error occurred while fetching the product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const productData = await req.json();

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productData.id,
      productData,
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", updatedProduct },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);

    return NextResponse.json(
      {
        message: "An error occurred while updating the product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { deletingProductId } = await req.json();
    const deletedProduct =
      await ProductModel.findByIdAndDelete(deletingProductId);

    console.log("deletedProduct", deletedProduct);
    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Product successfully deleted", deletedProduct },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting Product:", error);

    return NextResponse.json(
      {
        message: "Error occurred while deleting Product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
