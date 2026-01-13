import React from "react";
import { Menu } from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { useEffect, useState } from "react";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />

      <div>asdasd</div>
    </>
  );
}

export default Profile;
