import React from "react";
import {
  ChevronLeft,
  Pencil,
  VenusAndMars,
  MapPinHouse,
  Cake,
  Hash,
  Camera,
} from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Modal from "../reusableComponents/Modal";

function Edit_Profile() {
  const openModal = () => document.getElementById("back_modal").showModal();

  return (
    <div className="min-h-screen p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <button onClick={openModal} className=" bg-sky-200 rounded-xl p-1">
            <ChevronLeft size={32} />
          </button>
          <Modal
            id="back_modal"
            title="Discard Changes?"
            actionButton={
              <Link to={"/profile"} className="btn btn-info text-white">
                Yes
              </Link>
            }
          ></Modal>
        </div>

        <span className="text-2xl font-bold text-center">Edit profile</span>
        <div className="flex-1 flex justify-end"></div>
      </div>

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
    </div>
  );
}

export default Edit_Profile;
