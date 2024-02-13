"use client";
import React, { useState } from "react";

const MobileRightBarButton = ({ setIsMobileButtonOpen }: { setIsMobileButtonOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setIsMobileButtonOpen((prev) => !prev);
  };

  return (
    <button
      className={`flex-col items-center justify-center hidden max-lg:flex`}
      onClick={handleClick}
    >
      <span
        className={`bg-white  block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
          isOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
        }`}
      ></span>
      <span
        className={`bg-white  my-0.5 block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      ></span>
      <span
        className={`bg-white  block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
          isOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
        }`}
      ></span>
    </button>
  );
};

export default MobileRightBarButton;
