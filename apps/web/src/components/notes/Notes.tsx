import Image from "next/image";
import React from "react";
import NoteItem from "./NoteItem";
import CreateNote from "./CreateNote";

const notesData = [
  {
    title: "My Trip to Paris",
    createdAt: "11/24/2023",
    page: "1 page",
  },
  {
    title: "Things to do tomorrow",
    createdAt: "11/24/2023",
    page: "1 page",
  },
  {
    title: "Workout plans",
    createdAt: "11/24/2023",
    page: "1 page",
  },
  {
    title: "Show to watch",
    createdAt: "11/24/2023",
    page: "1 page",
  },
  {
    title: "Go-to Restaurants",
    createdAt: "11/24/2023",
    page: "1 page",
  },
];

const Notes = () => {
  return (
    <div className="container pb-10">
      <h1 className="text-[#2D2D2D] text-center text-[20px] sm:text-[43px] not-italic font-normal sm:font-medium leading-[114.3%] tracking-[-1.075px] sm:mt-8 my-4  sm:mb-10">
        Your Notes
      </h1>
      <div className="px-5 sm:px-0">
        <div className="bg-white flex items-center h-[39px] sm:h-[55px] rounded border border-solid gap-2 sm:gap-5 mb-10 border-[rgba(0,0,0,0.40)] px-3 sm:px-11">
          <Image
            src={"/images/search.svg"}
            width={23}
            height={22}
            alt="search"
            className="cursor-pointer sm:w-[23px] sm:h-[22px] w-[20px] h-[20px]"
          />
          <input
            type="text"
            placeholder="Search .................."
            className="flex-1 text-[#2D2D2D] text-[17px] sm:text-2xl not-italic font-light leading-[114.3%] tracking-[-0.6px] focus:outline-0 focus:ring-0 focus:border-0 border-0"
          />
        </div>
      </div>

      <div className="border-[0.5px] mb-20 divide-y-[0.5px] divide-[#00000096] border-[#00000096]">
        {notesData.map((note, index) => (
          <NoteItem key={index} note={note} />
        ))}
      </div>

     <CreateNote />
    </div>
  );
};

export default Notes;
