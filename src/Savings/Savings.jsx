import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";

function Savings() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />
      <div>Savings</div>
    </div>
  );
}

export default Savings;
