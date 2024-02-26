import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo from "../app/icon.png";
import search from "../assets/icons/search.png";
import emptyHeart from "../assets/icons/empty-heart.png";
import user from "../assets/icons/user.png";

// Navigation icons to map through
const NavIcons = [
  {
    src: search,
    alt: "search",
  },
  {
    src: emptyHeart,
    alt: "empty heart",
  },
  {
    src: user,
    alt: "user",
  },
];

const Navbar = () => {
  return (
    <header className="w-full">
      <div className="flex justify-between items-center px-6 md:px-20 py-4">
        <Link href="/" className="flex items-center gap-1">
          <Image src={logo} width={25} height={25} alt="logo" />
          <p className="font-roboto text-xl font-bold text-yellow-500">
            e<span className="text-purple-600">Com</span>
          </p>
        </Link>
        <div className="flex gap-5 items-center">
          {NavIcons.map((icons) => (
            <Image
              key={icons.alt}
              src={icons.src}
              alt={icons.alt}
              width={27}
              height={27}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
