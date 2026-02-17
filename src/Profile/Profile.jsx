import {
  ChevronLeft,
  VenusAndMars,
  MapPinHouse,
  Cake,
  Hash,
  CircleAlert,
} from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatDate } from "../reusableComponents/formatter";
import { swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { useAuth } from "../auth/Auth";
import { ProfileLoading } from "../reusableComponents/loading";
function Profile() {
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
            <button className=" bg-sky-200 text-sky-500 rounded-lg p-1">
              <Link to={backPath}>
                <ChevronLeft size={32} />
              </Link>
            </button>
            <span className="text-2xl font-bold text-center text-slate-900">
              Profile
            </span>
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
              <div className="flex  flex-wrap uppercase gap-1 font-extrabold justify-center items-center text-slate-800">
                <span>{profileData?.firstName}</span>
                <span>{profileData?.middlleName}</span>
                <span>{profileData?.lastName}</span>
                <span>{profileData?.suffix}</span>
              </div>
              <div className="flex flex-col text-sm justify-center items-center text-slate-500 font-bold">
                <span>{profileData?.email}</span>
                <span>{profileData?.phoneNumber}</span>
              </div>
            </div>
          </div>

          <div className="my-3 flex flex-col bg-white shadow-sm rounded-2xl p-5">
            <span className="text-xl font-extrabold mb-3 text-slate-800">
              Personal Information
            </span>
            <div className="flex flex-col gap-3 ">
              <div className="flex justify-between items-center rounded-md shadow-sm bg-slate-100 p-2 px-3">
                <div className="flex items-center  gap-3 ">
                  <VenusAndMars className="text-sky-500" />
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm">Gender</span>
                    <span className="text-md text-slate-800 font-semibold">
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
              <div className="flex justify-between items-center rounded-md shadow-sm bg-slate-100 p-2 px-3">
                <div className="flex items-center  gap-3 ">
                  <Hash className="text-sky-500" />
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm">Age</span>
                    <span className="text-md text-slate-800 font-semibold">
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
              <div className="flex justify-between items-center rounded-md shadow-sm bg-slate-100 p-2 px-3">
                <div className="flex items-center  gap-3 ">
                  <VenusAndMars className="text-sky-500" />
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm">Birthday</span>
                    <span className="text-md text-slate-800 font-semibold">
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
              <div className="flex justify-between items-center rounded-md shadow-sm bg-slate-100 p-2 px-3">
                <div className="flex items-center  gap-3 ">
                  <MapPinHouse className="text-sky-500" />
                  <div className=" flex flex-col">
                    <span className="text-slate-500 text-sm">Address</span>
                    <span className="text-md text-slate-800 font-semibold">
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
