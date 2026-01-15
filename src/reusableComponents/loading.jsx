import React from "react";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";

export const LoadingSpinnerLoan = ({ isOpen, setIsOpen }) => (
  <>
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    <Header openSideBar={() => setIsOpen(!isOpen)} />
    <div className="min-h-screen p-3 flex flex-col gap-5">
      <div className=" w-full rounded-xl skeleton h-80 flex flex-col items-center justify-center"></div>
      <div className=" w-full rounded-xl skeleton h-70 flex flex-col items-center justify-center"></div>
    </div>
  </>
);
