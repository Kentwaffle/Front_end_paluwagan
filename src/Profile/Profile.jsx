import React from "react";
import { ChevronLeft } from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { useEffect, useState } from "react";

import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";

import Inputform from "../reusableComponents/Inputform";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="min-h-screen pt-13 px-5">
      {/* <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} /> */}

      <button className="fixed top-2 left-3 bg-sky-200 rounded-xl p-1">
        <Link to={"/loan"}>
          <ChevronLeft size={32} />
        </Link>
      </button>

      <div className="flex flex-col justify-center items-center">
        <img
          src={Default_pic}
          alt="Profile_pic"
          className="rounded-full w-30 h-30 border-2 border-sky-300"
        />

        <label className="cursor-pointer bg-sky-200 p-1 px-2 mt-2 rounded-md">
          <input type="file" className="hidden" accept="image/*" />
          Change Photo
        </label>
      </div>

      <div className="my-5 flex flex-col bg-gray-50 shadow-md rounded-xl p-5">
        <span className="text-xl font-semibold">Personal information</span>
        <div className="flex flex-col w-full gap-3">
          <div className="bg-slate-100 rounded-md p-2 shadow">
            <span>First name</span>
            <Inputform />
          </div>
          <span>Middle name</span>
          <span>Last name</span>
          <span>Suffix</span>
        </div>
        <div>
          <span>Gender</span>
          <span>Address</span>
          <span>Age</span>
          <span>Number</span>
        </div>
        <div>
          <span>Email</span>
          <span>Password</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
