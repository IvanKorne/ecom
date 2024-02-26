"use client";
import React, { FormEvent } from "react";
import { useState } from "react";
import { scrapeAndStoreProduct } from "@/lib/actions";

const checkValidLink = (url: string) => {
  try {
    const check = new URL(url);
    const hostname = check.hostname;
    //Checks to see if the hostname is a valid link
    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
};
const Searchbar = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidLink = checkValidLink(link);
    if (!isValidLink) {
      alert("Enter a valid Amazon Link");
    }
    try {
      setLoading(true);
      // Scrape Amazon for the product
      const product = await scrapeAndStoreProduct(link);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 mt-12"
    >
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter a Product..."
        className=" text-base shadow-xs p-3 rounded-md border border-gray-500 flex-1 min-w-[200px] w-full "
      />
      <button
        className="bg-purple-900 rounded-xl shadow-xs px-5 py-3 text-white text-lg font-bold hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        type="submit"
        disabled={link === ""}
      >
        {loading ? "Searching" : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
