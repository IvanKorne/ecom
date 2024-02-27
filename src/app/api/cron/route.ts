import { scrapeProduct } from "@/lib/actions";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cron allows us to rescrape products automatically, showing us the updated prices
export async function GET(request: Request) {
  try {
    connectToDB();
    const products = await Product.find({});
    if (!products) {
      throw new Error("No products found");
    }
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct: any) => {
        const updatedProduct = await scrapeProduct(currentProduct.productURL);
        if (!updatedProduct) {
          throw new Error("No Product Found");
        }

        // Copied from index.ts from lib/actions: Updating the product with new prices
        const updatePriceHistory = [
          ...currentProduct.priceHistory,
          { price: updatedProduct.currentPrice },
        ];
        const product = {
          ...currentProduct,
          priceHistory: updatePriceHistory,
          lowestPrice: getLowestPrice(updatePriceHistory),
          highestPrice: getHighestPrice(updatePriceHistory),
          averagePrice: getAveragePrice(updatePriceHistory),
        };

        const newProduct = await Product.findOneAndUpdate(
          { productURL: product.productURL },
          product
        );

        // checks the type of notification that needs to be sent
        const noti = getEmailNotifType(updatedProduct, currentProduct);

        // checks of there is noti, and there is a user that needs to be updated
        if (noti && newProduct.users.length > 0) {
          const info = {
            title: newProduct.title,
            productURL: newProduct.productURL,
          };

          const emailContent = await generateEmailBody(info, noti);
          const userEmails = newProduct.users.map((user: any) => user.email);
          await sendEmail(emailContent, userEmails);
        }
        return newProduct;
      })
    );
    return NextResponse.json({
      message: "OK",
      data: updatedProducts,
    });
  } catch (err) {
    throw new Error(`Get Error: ${err}`);
  }
}
