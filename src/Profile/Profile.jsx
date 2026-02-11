import React from "react";
import {
  ChevronLeft,
  Pencil,
  VenusAndMars,
  MapPinHouse,
  Cake,
  Hash,
} from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatDate } from "../reusableComponents/formatter";
import { jwtDecode } from "jwt-decode";
import { swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import api from "../serviceToApi/ApiInstance";
function Profile() {
  const { data } = useFetchData("/profile", API_ENDPOINTS.PROFILE_GET);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let userRole = null;

  if (token) {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  }

  const backPath =
    userRole === "ROLE_ADMIN" ? "/admin/loan_management" : "/loan";

  const handleLogout = async () => {
    try {
      await api.get(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      queryClient.clear();
      window.location.assign("/auth");
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return "";
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age.toString() : "0";
  };

  const editAlert = async () => {
    const alert = await swalModal({
      title: "Edit Profile?",
      text: "You will be redirected to the edit page.",
      icon: "question",
      confirmButtonText: "Edit",
    });
    if (alert) {
      navigate("/profile/edit_profile");
    }
  };

  const displayAge = data?.birthday ? calculateAge(data.birthday) : "No Age";
  return (
    <div className="min-h-screen p-5">
      <div className="flex justify-between items-center mb-3">
        <button className=" bg-sky-200 text-sky-500 rounded-lg p-1">
          <Link to={backPath}>
            <ChevronLeft size={32} />
          </Link>
        </button>
        <span className="text-2xl font-bold text-center">Profile</span>
        <button
          onClick={editAlert}
          className="flex items-center gap-1 text-xl "
        >
          <span className="text-sky-500">Edit</span>
        </button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <img
          src={Default_pic}
          alt="Profile_pic"
          className="rounded-full w-30 h-30 border-2 border-sky-300"
        />

        <div className="flex flex-col py-3 ">
          <div className="flex  flex-wrap uppercase gap-1 font-extrabold justify-center items-center">
            <span>{data?.firstName}</span>
            <span>{data?.middlleName}</span>
            <span>{data?.lastName}</span>
            <span>{data?.suffix}</span>
          </div>
          <div className="flex flex-col text-sm justify-center items-center text-gray-600">
            <span>{data?.email}</span>
            <span>{data?.phoneNumber}</span>
          </div>
        </div>
      </div>

      <div className="my-5 flex flex-col bg-gray-50 shadow-md rounded-xl p-5">
        <span className="text-xl font-extrabold mb-3 ">
          Personal Information
        </span>
        <div className="flex flex-col gap-3 ">
          <div className="flex items-center gap-3 rounded-md shadow bg-gray-100 p-2">
            <VenusAndMars />
            <div className=" flex flex-col">
              <span className="text-stone-500 text-sm">Gender</span>
              <span className="text-md font-semibold">
                {data?.gender || "No gender"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md shadow bg-gray-100 p-2">
            <Hash />
            <div className=" flex flex-col">
              <span className="text-stone-500 text-sm">Age</span>
              <span className="text-md font-semibold">
                {`${displayAge} years old` || "No Age"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md shadow bg-gray-100 p-2">
            <Cake />
            <div className=" flex flex-col w-full">
              <span className="text-stone-500 text-sm">Birthday</span>
              <span className="text-md font-semibold">
                {formatDate(data?.birthday || "No Birthday")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md shadow bg-gray-100 p-2">
            <MapPinHouse />
            <div className=" flex flex-col">
              <span className="text-stone-500 text-sm">Address</span>
              <span className="text-md font-semibold">
                {data?.address || "No Address"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-red-200 text-red-500 rounded-xl shadow p-3 text-xl"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}

export default Profile;
