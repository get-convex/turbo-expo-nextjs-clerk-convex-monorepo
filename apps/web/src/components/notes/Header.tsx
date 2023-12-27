"use client";
import Image from "next/image";
import React from "react";
import Logo from "../common/Logo";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  isButton?: boolean;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="bg-white">
      <div className="flex container px-5 sm:px-0 justify-between items-center h-[64px] sm:h-[89px]">
        <div className="flex items-center gap-2">
          <Link href={'/notes'} >
            <Image
              src="/images/left-arrow.png"
              alt="Notes"
              width={34}
              height={32}
              className="cursor-pointer sm:w-[34px] sm:h-[32px] w-5 h-5 bg-gray-300"
            />
          </Link>
          <h2 className="text-black hidden sm:flex text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
            {title?.split("-").join(" ")}
          </h2>
        </div>
        <div className="hidden sm:block">
          <Logo />
        </div>
        <div className="sm:hidden">
          <Logo isMobile={true} />
        </div>
        <div className="flex items-center gap-2 sm:gap-20">
            <button className="button text-[#EBECEF] flex gap-2 justify-center items-center text-center px-3 sm:px-5 py-1.5 rounded-lg">
              <Image
                src={"/images/Fantasy.png"}
                width={28}
                height={28}
                alt="search"
                className="float-right sm:w-[28px] sm:h-[28px] w-[13px] h-[13px]"
              />
              <span className="text-[17px] sm:text-3xl not-italic font-medium leading-[79%] tracking-[-0.75px]">
                {" "}
                AI
              </span>
            </button>
          <div className="sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center">
            <Image
              className="rounded-[38px] sm:w-[50px] sm:h-[50px] w-[30px] h-[30px] "
              src="/images/Moe-Partuj.jpeg"
              width={50}
              height={50}
              alt="ryan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
