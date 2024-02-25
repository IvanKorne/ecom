import { getProductById } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import redHeart from "../../../assets/icons/red-heart.png";
import bookmark from "../../../assets/icons/bookmark.png";
import { Product } from "@/types";
import { formatNumber } from "@/lib/utils";
import stars from "../../../assets/icons/star.png";
import comment from "../../../assets/icons/comment.png";
import PriceInfo from "@/components/PriceInfo";

type Props = {
  params: {
    id: string;
  };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);
  if (!product) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-16 flex-wrap px-6 md:px-20 py-24">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="flex-grow max-w-full xl:max-w-[50%] py-16 border border-[#CDDBFF] rounded-lg">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between pb-6 items-start gap-5 flex-wrap">
            <div className="flex gap-3 flex-col">
              <p className="font-semibold text-2xl">{product.title}</p>
              <Link
                href={product.productURL}
                target="_blank"
                className="text-base opacity-60"
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF0F0] rounded-10">
                <Image src={redHeart} alt="red-heart" width={20} height={20} />
                <p className="text-base font-semibold text-pink-500">
                  {product.reviewsCount -
                    Math.floor(Math.random() * product.reviewsCount)}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Image
                  src={bookmark}
                  alt="bookmark"
                  width={20}
                  height={20}
                ></Image>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-10 py-6 border-y border-y-[#E4E4E4]">
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className="text-3xl font-bold opacity-50 line-through">
                {product.currency} {formatNumber(product.originalPrice)}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#FBF3EA] rounded-lg">
                  <Image src={stars} alt="star" width={16} height={16} />
                  <p className="text-sm text-orange-400 font-semibold">
                    {product.stars || 4 + Math.round(Math.random() * 10) / 10}
                  </p>
                </div>
                <div className="flex bg-gray-100 items-center gap-2 px-3 py-2  rounded-[27px]">
                  <Image src={comment} alt="comment" width={16} height={16} />
                  <p className="text-sm font-semibold">
                    {product.reviewsCount} Reviews
                  </p>
                </div>
              </div>
              <p>
                <span className="text-sm font-semibold">
                  <span className="text-green-500 font-semibold">93%</span> of
                  buyers have recommended this.
                </span>
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex flex-wrap gap-5">
              <PriceInfo
                title="Current Price"
                iconSrc="/assets/icons/price.png"
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
                borderColor="#b6dbff"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
