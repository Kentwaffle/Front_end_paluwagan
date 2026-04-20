import {
  ChevronLeft,
  VenusAndMars,
  MapPinHouse,
  Cake,
  Hash,
  CircleAlert,
  Moon,
  Sun,
} from "lucide-react";
import { getProfileImage } from "../reusableComponents/Hooks/ImageGet";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatDate } from "../reusableComponents/Utils/formatter";
import { swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { useAuth } from "../auth/Auth";
import { ProfileLoading } from "../reusableComponents/Feedbacks/loading";
import { useEffect, useState } from "react";

function Profile() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const { data: profileData, isLoading: loadingProfile } = useFetchData(
    "/api/profile/info",
    API_ENDPOINTS.PROFILE_GET,
  );

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userRole = user?.role;

  const backPath =
    userRole === "ROLE_ADMIN" ? "/admin/loan_management" : "/loan";

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

  const displayAge = profileData?.birthday
    ? calculateAge(profileData.birthday)
    : "";

  // return <ProfileLoading />;
  return (
    <div className="min-h-screen">
      {loadingProfile ? (
        <ProfileLoading />
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <button className=" bg-sky-200 dark:bg-slate-700  text-sky-500 rounded-lg p-1">
              <Link to={backPath}>
                <ChevronLeft size={32} />
              </Link>
            </button>
            <span className="text-2xl font-bold text-center text-slate-900  dark:text-slate-100">
              Profile
            </span>
            <button
              onClick={editAlert}
              className="flex items-center gap-1 text-xl dark:text-slate-300 text-sky-500 "
            >
              <span className="text-sky-500">Edit</span>
            </button>
          </div>

          <div className="flex flex-col justify-center items-center">
            <img
              src={getProfileImage(profileData?.profileImage)}
              alt="Profile_pic"
              className="rounded-full w-30 h-30 border-2 border-sky-300 "
            />

            <div className="flex flex-col py-3 ">
              <div className="flex  flex-wrap uppercase gap-1 font-extrabold justify-center items-center text-slate-800 dark:text-slate-100">
                <span>{profileData?.firstName}</span>
                <span>{profileData?.middlleName}</span>
                <span>{profileData?.lastName}</span>
                <span>{profileData?.suffix}</span>
              </div>
              <div className="flex flex-col text-sm justify-center items-center text-slate-500 font-bold dark:text-slate-400">
                <span>{profileData?.email}</span>
                <span>{profileData?.phoneNumber}</span>
              </div>
            </div>
          </div>

          <div className="my-3 flex flex-col bg-white shadow-sm rounded-2xl p-5 dark:bg-slate-900">
            <span className="text-xl font-extrabold mb-3 text-slate-800 dark:text-slate-100">
              Personal Information
            </span>
            <div className="flex flex-col gap-3 ">
              <div className="flex justify-between items-center rounded-2xl shadow-sm bg-white  border border-sky-100 shadow-sky-100/50 dark:shadow-none dark:bg-slate-800 dark:border-slate-800 py-3 px-4">
                <div className="flex items-center  gap-3 ">
                  <div className="p-2 bg-sky-50 dark:bg-slate-700 rounded-lg text-sky-500">
                    <VenusAndMars size={18} />
                  </div>
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm dark:text-slate-400">
                      Gender
                    </span>
                    <span className="text-md text-slate-800 font-semibold dark:text-slate-100">
                      {profileData?.gender || "No gender"}
                    </span>
                  </div>
                </div>
                {!profileData?.gender && (
                  <div className="p-1 text-amber-500 bg-amber-50 rounded-full">
                    <CircleAlert />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center rounded-2xl shadow-sm bg-white  border border-sky-100 shadow-sky-100/50 dark:shadow-none dark:bg-slate-800 dark:border-slate-800 py-3 px-4">
                <div className="flex items-center  gap-3 ">
                  <div className="p-2 bg-sky-50 dark:bg-slate-700 rounded-lg text-sky-500">
                    <Hash size={18} />
                  </div>
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm dark:text-slate-400">
                      Age
                    </span>
                    <span className="text-md text-slate-800 font-semibold dark:text-slate-100">
                      {displayAge || "No age"}
                    </span>
                  </div>
                </div>
                {!displayAge && (
                  <div className="p-1 text-amber-500 bg-amber-50 rounded-full">
                    <CircleAlert />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center rounded-2xl shadow-sm bg-white  border border-sky-100 shadow-sky-100/50 dark:shadow-none dark:bg-slate-800 dark:border-slate-800 py-3 px-4">
                <div className="flex items-center  gap-3 ">
                  <div className="p-2 bg-sky-50 dark:bg-slate-700 rounded-lg text-sky-500">
                    <Cake size={18} />
                  </div>
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm dark:text-slate-400">
                      Birthday
                    </span>
                    <span className="text-md text-slate-800 font-semibold dark:text-slate-100">
                      {profileData?.birthday || "No Birthday"}
                    </span>
                  </div>
                </div>
                {!profileData?.birthday && (
                  <div className="p-1 text-amber-500 bg-amber-50 rounded-full">
                    <CircleAlert />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center rounded-2xl shadow-sm bg-white  border border-sky-100 shadow-sky-100/50 dark:shadow-none dark:bg-slate-800 dark:border-slate-800 py-3 px-4">
                <div className="flex items-center  gap-3 ">
                  <div className="p-2 bg-sky-50 dark:bg-slate-700 rounded-lg text-sky-500">
                    <MapPinHouse size={18} />
                  </div>
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm dark:text-slate-400">
                      Address
                    </span>
                    <span className="text-md text-slate-800 font-semibold dark:text-slate-100">
                      {profileData?.address || "No Address"}
                    </span>
                  </div>
                </div>
                {!profileData?.address && (
                  <div className="p-1 text-amber-500 bg-amber-50 rounded-full">
                    <CircleAlert />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="my-3 flex flex-col bg-white shadow-sm rounded-2xl p-5 dark:bg-slate-900">
            <span className="text-xl font-extrabold mb-3 text-slate-800 dark:text-slate-100">
              Settings
            </span>
            <div className="flex items-center justify-between p-4  bg-white dark:bg-slate-800 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-sm shadow-sky-100/50 dark:shadow-none transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 dark:bg-slate-700 rounded-lg text-sky-500">
                  {isDark ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-800 dark:text-slate-100 font-bold text-sm tracking-tight">
                    Dark Mode
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-sky-400 font-semibold">
                    Appearance
                  </span>
                </div>
              </div>

              {/* DaisyUI Toggle - Sky Edition */}
              <input
                type="checkbox"
                className="toggle border-sky-400 bg-white checked:bg-sky-500 checked:border-sky-500 [--tglbg:theme(colors.sky.100)] checked:[--tglbg:theme(colors.white)]"
                checked={isDark}
                onChange={() => setIsDark(!isDark)}
              />
            </div>
          </div>

          <button
            className="w-full bg-red-400 text-white rounded-xl shadow p-3 text-xl"
            onClick={logout}
          >
            Log out
          </button>
        </>
      )}
    </div>
  );
}

export default Profile;
<div className="min-h-screen"></div>;
