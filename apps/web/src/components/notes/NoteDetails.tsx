import React from "react";

interface NoteDetailsProps {
    title: string;
}

const NoteDetails = ({ title }: NoteDetailsProps) => {
  return (
    <div className="container space-y-6 sm:space-y-9 py-20 px-[26px] sm:px-0">
      <h3 className="text-black text-center pb-5 text-xl sm:text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
        {title.split("-").join(" ")}
      </h3>
      <p className="text-black text-xl sm:text-[28px] not-italic font-normal leading-[130.3%] tracking-[-0.7px]">
        Paris, the City of Light, has always held a magnetic allure, and my
        recent journey to this enchanting metropolis exceeded all expectations.
        From iconic landmarks to quaint cobblestone streets, every moment in
        Paris felt like a chapter in a timeless romance.
      </p>
      <p className="text-black text-xl sm:text-[28px] not-italic font-normal leading-[130.3%] tracking-[-0.7px]">
        No trip to Paris is complete without a visit to the Eiffel Tower.
        Standing beneath its towering structure, the city unfolded before me
        like a masterpiece. The Louvre, with its grandeur and cultural
        treasures, offered a journey through art and history, leaving me
        awe-inspired.
      </p>
      <p className="text-black text-xl sm:text-[28px] not-italic font-normal leading-[130.3%] tracking-[-0.7px]">
        Parisian cuisine is a symphony of flavors, and my taste buds embarked on
        a delectable adventure. From sipping rich espresso in a charming
        Montmartre café to indulging in delicate pastries at a local patisserie,
        each bite felt like a celebration of culinary artistry.
      </p>
    </div>
  );
};

export default NoteDetails;
