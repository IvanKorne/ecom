"use client";
import React from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import purse from "../assets/images/purse.png";
import goggles from "../assets/images/goggles.png";
import shoes from "../assets/images/shoes.png";
import phone from "../assets/images/phone.png";
import bed from "../assets/images/bed.png";
import smiley from "../assets/icons/smiley.png";
const heroImages = [
  { src: purse, alt: "purse" },
  { src: goggles, alt: "goggles" },
  { src: shoes, alt: "shoes" },
  { src: phone, alt: "phone" },
  { src: bed, alt: "bed" },
];
//Carousel is an NPM package can be installed online, making implementing sliders much easier.
//It uses useState, hence why this needs to be client-sided
const Hero = () => {
  return (
    <div className="relative sm:px-10 py-5 sm:pt-20 pb-5 max-w-[560px] h-[700px] w-full bg-[#F2F4F7] rounded-[30px] sm:mx-auto">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={4000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image) => (
          <Image
            src={image.src}
            alt={image.alt}
            width={484}
            height={484}
            className="object-contain"
            key={image.alt}
          />
        ))}
      </Carousel>
      <Image
        src={smiley}
        alt="Smiley"
        width={150}
        height={150}
        className="left-[-55px] max-xl:hidden absolute top-[550px]"
      />
    </div>
  );
};

export default Hero;
