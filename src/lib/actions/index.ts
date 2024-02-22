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
      //pass in everthing related to price
      const currentPrice = extractPrice(
        $(".priceToPay span.a-price-whole"),
        $(".a.size.base.a-color-price"),
        $(".a-button-selected .a-color-base")
      );

      const originalprice = extractPrice(
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
      console.log({
        title,
        currentPrice,
        originalprice,
        outOfStock,
        image,
        curreny,
        discountRate,
      });
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
