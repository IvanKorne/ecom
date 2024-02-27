"use client";
import React from "react";
import { scrapeAndStoreProduct } from "@/lib/actions";
import z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  link: z.string(),
});

type FormFields = z.infer<typeof schema>;

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
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const isValidLink = checkValidLink(data.link);
    if (!isValidLink) {
      alert("Enter a valid Amazon Link");
    }
    try {
      // Scrape Amazon for the product
      const product = await scrapeAndStoreProduct(data.link);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap gap-4 mt-12"
    >
      <input
        type="text"
        {...register("link")}
        placeholder="Enter a Product..."
        className=" text-base shadow-xs p-3 rounded-md border border-gray-500 flex-1 min-w-[200px] w-full "
      />
      <button
        className="bg-purple-900 rounded-xl shadow-xs px-5 py-3 text-white text-lg font-bold hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Searching" : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
