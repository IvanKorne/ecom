import React from "react";
import Image, { StaticImageData } from "next/image";

type PriceInfoType = {
  title: string;
  value: string;
  iconSrc: StaticImageData;
  borderColor: string;
};

// A way to dynamically add tailwind CSS code
const colorMap: { [key: string]: string } = {
  gray: "border-l-gray-500",
  green: "border-l-green-500",
  red: "border-l-red-500",
  purple: "border-l-purple-500",
};

const PriceInfo = ({ title, iconSrc, value, borderColor }: PriceInfoType) => {
  return (
    <div
      className={`flex-1 min-w-[200px] flex flex-col gap-2 border-l-[3px] rounded-lg bg-white-100 px-5 py-4 ${colorMap[borderColor]}`}
    >
      <p className="text-base text-gray-600">{title}</p>
      <div className="flex gap-5">
        <Image src={iconSrc} alt="Icon" width={26} height={2} />
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default PriceInfo;
