"use client";

import Image from "next/image";
import x from "../assets/icons/close.png";
import logo from "../app/icon.png";
import mail from "../assets/icons/mail.png";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { addUserEmailToProduct } from "../lib/actions/index";

type ProductProps = {
  productId: string;
};

const Modal = ({ productId }: ProductProps) => {
  // Sets the state of our modal
  const [isOpen, setIsOpen] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);

    await addUserEmailToProduct(productId, email);

    setSubmit(false);
    setIsOpen(false);
  };

  //Headless UI makes creating modals by importing built-in components for our use
  return (
    <div>
      <button
        className="p-4 bg-purple-900 hover:bg-opacity-70 rounded-lg text-white text-lg font-semibold"
        onClick={() => setIsOpen(true)}
      >
        Follow Updates
      </button>
      <Transition as={Fragment} appear show={isOpen}>
        <Dialog
          as="div"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 z-100 overflow-y-auto bg-black bg-opacity-60"
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0"></Dialog.Overlay>
            </Transition.Child>

            <span className="align-middle h-screen inline-block aria-hidden"></span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className="p-6  bg-white inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl rounded-lg border
              border-purple-300"
              >
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-4 rounded-lg">
                      <Image
                        src={logo}
                        alt="logo"
                        height={30}
                        width={30}
                      ></Image>
                    </div>
                    <Image
                      src={x}
                      alt="x-close"
                      height={1}
                      width={50}
                      className="cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    ></Image>
                  </div>
                  <h4 className="font-semibold text-lg ">
                    Stay updated on the
                    <span className="text-purple-700"> Lowest</span>
                    <span className="text-yellow-700"> Deals</span> of your
                    favourite products!
                  </h4>
                  <p className="text-sm text-gray-500 font-semibold mt-2 ">
                    Never miss a deal by signing up your email.
                  </p>
                </div>
                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <label
                    htmlFor="email"
                    className="text-sm font-semi-bold text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="px-5 py-3 mt-3 flex items-center gap-2 border border-gray-300 rounded-lg">
                    <Image src={mail} alt="mail" width={16} height={16}></Image>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Here"
                      className="flex-1  border-none text-gray-500 text-base border border-gray-300 rounded-xl focus:outline-none shadow-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 text-white text-base font-semibold  bg-purple-700 rounded-lg mt-8 hover:opacity-80"
                  >
                    {submit ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Modal;
