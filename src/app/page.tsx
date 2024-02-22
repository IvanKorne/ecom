import React from "react";
import Image from "next/image";
import rightArrow from "../assets/icons/arrow-right.png";
import Searchbar from "@/components/Searchbar";
import Hero from "@/components/Hero";
const Home = () => {
  return (
    <>
      <div className="px-6 md:px-20 py-24 ">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="flex gap-2 text-sm font-medium text-primary">
              Find the Lowest Prices Anywhere
              <Image
                src={rightArrow}
                alt="right-arrow"
                width={15}
                height={10}
              />
            </p>
            <h1 className="mt text-6xl font-bold tracking-tight leading-[72px] ">
              Shop Smarter with <span className="text-yellow-500">e</span>
              <span className="text-purple-600">Com</span>
            </h1>
            <p className="mt-6">
              eCom revolutionizes shopping by utilizing product price analytics,
              ensuring you get your products at the lowest prices possible.
            </p>
            <Searchbar />
          </div>
          <Hero />
        </div>
      </div>
      <div className="flex flex-col gap-10 px-6 md:px-20 py-24">
        <h1 className="font-semibold text-3xl">Trending</h1>
        <div className="flex flew-wrap gap-x-8 gap-y-16">
          {["Pans", "Playstation", "Bottle"].map((product) => (
            <div>{product}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
