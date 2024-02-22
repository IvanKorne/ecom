"use server";
import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice, extractCurrency } from "../utils";

//Finding the product on Amazon using bright_data webscraper
async function scrapeProduct(productURL: string) {
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

      const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

      const curreny = extractCurrency($(".a-price-symbol"));

      const data = {
        productURL,
        curreny: curreny || "$",
        image: imageURL[0],
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(currentPrice),
        prices: [],
        discountRate: Number(discountRate),
        category: "category",
        reviews: 75,
        stars: 4,
        isOutofStock: outOfStock,
      };

      console.log(data);
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
      const scrapedProduct = await scrapeProduct(productURL);
    } catch (err: any) {
      throw new Error(`Failed to retrieve/store product: ${err.message}`);
    }
  }
}
