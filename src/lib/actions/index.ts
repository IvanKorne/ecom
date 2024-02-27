"use server";
import axios from "axios";
import * as cheerio from "cheerio";
import { revalidatePath } from "next/cache";
import { extractPrice, extractCurrency, extractDescription } from "../utils";
import { connectToDB } from "../mongoose";
import { getLowestPrice, getHighestPrice, getAveragePrice } from "../utils";
import Product from "@/models/productModel";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

//Finding the product on Amazon using bright_data webscraper
export async function scrapeProduct(productURL: string) {
  if (!productURL) {
    return;
  } else {
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_ID = (100000 * Math.random()) | 0;
    const selection = {
      auth: {
        username: `${username}-session-${session_ID}`,
        password: password,
      },
      host: "brd.superproxy.io",
      post: port,
      reject: false,
    };
    try {
      const response = await axios.get(productURL, selection);
      const $ = cheerio.load(response.data);

      const title = $("#productTitle").text().trim();

      //Using cheerio to extract data from response by using their id's
      const currentPrice = extractPrice(
        $(".priceToPay span.a-price-whole"),
        $(".a.size.base.a-color-price"),
        $(".a-button-selected .a-color-base")
      );

      const originalPrice = extractPrice(
        $("#priceblock_ourprice"),
        $(".a-price.a-text-price span.a-offscreen"),
        $("#listPrice"),
        $("#priceblock_dealprice"),
        $(".a-size-base.a-color-price")
      );

      const outOfStock =
        $("#availability span").text().trim().toLowerCase() ===
        "currently unavailable";

      const image =
        $("#imgBlkFront").attr("data-a-dynamic-image") ||
        $("#landingImage").attr("data-a-dynamic-image") ||
        "{}";

      const imageURL = Object.keys(JSON.parse(image));
      const currency = extractCurrency($(".a-price-symbol"));

      const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

      const description = extractDescription($);

      const data = {
        productURL,
        currency: currency || "$",
        image: imageURL[0],
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(currentPrice),
        priceHistory: <any>[],
        discountRate: Number(discountRate),
        category: "category",
        reviewsCount: 100,
        stars: 4,
        isOutOfStock: outOfStock,
        description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: Number(currentPrice) || Number(originalPrice),
      };

      return data;
    } catch (err: any) {
      throw new Error(`Failed to retrieve product: ${err.message}`);
    }
  }
}

//storing data scraped from Amazon
export async function scrapeAndStoreProduct(productURL: string) {
  if (!productURL) {
    return;
  } else {
    try {
      connectToDB();
      const scrapedProduct = await scrapeProduct(productURL);
      if (!scrapedProduct) {
        return;
      }

      let product = scrapedProduct;

      const prevProduct = await Product.findOne({
        productURL: scrapedProduct.productURL,
      });

      // This is checking if it's already in database, which inturn will update it
      if (prevProduct) {
        const updatePriceHistory: any = [
          ...prevProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];
        product = {
          ...scrapedProduct,
          priceHistory: updatePriceHistory,
          lowestPrice: getLowestPrice(updatePriceHistory),
          highestPrice: getHighestPrice(updatePriceHistory),
          averagePrice: getAveragePrice(updatePriceHistory),
        };
      }

      const newProduct = await Product.findOneAndUpdate(
        { productURL: scrapedProduct.productURL },
        product,
        { upsert: true, new: true }
      );

      revalidatePath(`/products/${newProduct._id}`);
    } catch (err: any) {
      throw new Error(`Failed to retrieve/store product: ${err.message}`);
    }
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return null;
    }
    return product;
  } catch (err) {
    console.log(err);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  } catch (err) {
    console.log(err);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const current = await Product.findById(productId);

    if (!current) return null;

    const similar = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similar;
  } catch (error) {
    console.log(error);
  }
}

export const addUserEmailToProduct = async (
  productId: string,
  userEmail: string
) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return;
    }
    const currentUser = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!currentUser) {
      product.users.push({ email: userEmail });
      await product.save();
      const emailContent = await generateEmailBody(product, "WELCOME");
      await sendEmail(emailContent, [userEmail]);
    }
  } catch (err) {
    console.log(err);
  }
};
