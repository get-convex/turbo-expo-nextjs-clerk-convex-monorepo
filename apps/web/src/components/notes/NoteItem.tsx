import Image from "next/image";
import React from "react";
import Link from "next/link";

export interface NoteProps {
  note: {
    title: string;
    createdAt: string;
    page: string;
  };
}

const NoteItem = ({ note }: NoteProps) => {
  return (
    <div className="flex justify-between items-center h-[74px] bg-[#F9FAFB] py-5 px-5 sm:px-11 gap-x-5 sm:gap-x-10">
      <Link href={`/notes/${note.title.split(" ").join("-")}`} className="flex-1">
      <h1 className=" text-[#2D2D2D] text-[17px] sm:text-2xl not-italic font-normal leading-[114.3%] tracking-[-0.6px]">{note.title}</h1>
      </Link>
      <p className="hidden md:flex text-[#2D2D2D] text-center text-xl not-italic font-extralight leading-[114.3%] tracking-[-0.5px]">{note.createdAt}</p>
      <p className="hidden md:flex text-[#2D2D2D] text-center text-xl not-italic font-extralight leading-[114.3%] tracking-[-0.5px]">{note.page}</p>
      <Image
      // onClick={() => setOpen(true)}
      src={"/images/delete.svg"}
      width={20}
      height={20}
      alt="search"
      className="cursor-pointer"
    />
    </div>
  );
};

export default NoteItem;
