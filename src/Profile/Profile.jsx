import {
  ChevronLeft,
  ChevronRight,
  VenusAndMars,
  MapPinHouse,
  Cake,
  Hash,
  CircleAlert,
  Moon,
  Sun,
  EllipsisVertical,
  UserRoundPen,
  LogOut,
  Mail,
  Phone,
  Settings as SettingsIcon,
  AlertCircle,
  UserCircle,
  Logs,
  Headset,
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
  const navigate = useNavigate();
  const { user, logout, UserDetails, isLoadingAuth } = useAuth();
  const userRole = user?.role;
  const backPath =
    userRole === "ROLE_ADMIN" ? "/admin/loan_management" : "/loan";

  const profileData = UserDetails;
  const loadingProfile = isLoadingAuth;

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

  const logOut = async () => {
    const alert = await swalModal({
      title: "Log Out?",
      text: "Are you sure you want to log out?",
      icon: "question",
      confirmButtonText: "Log Out",
    });
    if (alert) {
      logout();
      navigate("/auth");
    }
  };

  const displayAge = profileData?.birthday
    ? calculateAge(profileData.birthday)
    : "";

  const fullName =
    `${profileData?.firstName || ""} ${profileData?.middlleName || ""} ${profileData?.lastName || ""} ${profileData?.suffix || ""}`.trim();

  const maskEmail = (email) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    return `${localPart.slice(0, 2)}****@${domain}`;
  };

  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    return phoneNumber.replace(/.(?=.{4})/g, "*");
  };

  const personalItems = [
    {
      label: "Gender",
      value: profileData?.gender,
      icon: <VenusAndMars size={18} className="text-blue-600 dark:text-blue-500" />,
    },
    {
      label: "Age",
      value: displayAge,
      icon: <Cake size={18} className="text-blue-600 dark:text-blue-500" />,
    },
    {
      label: "Birthday",
      value: formatDate(profileData?.birthday),
      icon: <Cake size={18} className="text-blue-600 dark:text-blue-500" />,
    },
  ];

  const contactItems = [
    {
      label: "Address",
      value: profileData?.address,
      icon: <MapPinHouse size={18} className="text-blue-600 dark:text-blue-500" />,
    },
  ];

  const classicProfileItems = [
    {
      label: "Gender",
      value: profileData?.gender,
      icon: <VenusAndMars size={18} className="text-sky-500" />,
    },
    {
      label: "Age",
      value: displayAge,
      icon: <Cake size={18} className="text-sky-500" />,
    },
    {
      label: "Birthday",
      value: formatDate(profileData?.birthday),
      icon: <Cake size={18} className="text-sky-500" />,
    },
    {
      label: "Address",
      value: profileData?.address,
      icon: <MapPinHouse size={18} className="text-sky-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 py-4 md:py-8 px-4 md:px-8">
      {loadingProfile ? (
        <ProfileLoading />
      ) : (
        <>
          {/* ==================== MOBILE VIEW ==================== */}
          <div className="block md:hidden max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <button className="p-2 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-slate-600">
                <Link to={backPath}>
                  <ChevronLeft />
                </Link>
              </button>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                My Profile
              </h1>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none rounded-xl text-slate-400 hover:text-sky-500 hover:border-sky-100 dark:hover:border-slate-700 transition-all duration-200"
                >
                  <EllipsisVertical size={20} className="text-slate-400" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 rounded-2xl w-52 border border-slate-100 mt-2"
                >
                  <li>
                    <button
                      type="button"
                      onClick={editAlert}
                      className="flex items-center gap-2 py-3"
                    >
                      <UserRoundPen size={16} /> <span>Edit Profile</span>
                    </button>
                  </li>
                  <div className="divider my-0 opacity-50"></div>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/Settings")}
                      className="flex items-center gap-2 py-3"
                    >
                      <SettingsIcon size={16} /> <span>Settings</span>
                    </button>
                  </li>{" "}
                  <div className="divider my-0 opacity-50"></div>
                  <li>
                    <button
                      type="button"
                      onClick={logOut}
                      className="flex items-center gap-2 py-3 text-error"
                    >
                      <LogOut size={16} /> <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative bg-white dark:bg-slate-900 rounded-4xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-none mb-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-sky-300/50  dark:bg-slate-700 rounded-full -mr-16 -mt-16" />

              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-28 h-28 rounded-full p-1 border-2 border-sky-300 dark:border-slate-700">
                  <img
                    src={getProfileImage(profileData?.profileImage)}
                    alt="Profile_pic"
                    className="w-full h-full rounded-full object-cover "
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between items-center flex-1">
                <h2 className="text-xl font-black text-center text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  {fullName || "No Name Provided"}
                </h2>
                <div className="mt-3 flex flex-col gap-1">
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                    <Mail size={14} className="text-sky-500" />
                    <span className="text-xs font-medium">
                      {maskEmail(profileData?.email) || "No email"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                    <Phone size={14} className="text-sky-500" />
                    <span className="text-xs font-medium">
                      {maskPhoneNumber(profileData?.phoneNumber) || "No phone"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-3 flex flex-col">
              <h3 className="mb-4 px-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-555">
                Personal Information
              </h3>
              <div className="flex flex-col gap-3">
                {classicProfileItems.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-transparent hover:border-sky-100 dark:hover:border-slate-800 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-sky-50 dark:bg-slate-600 rounded-lg text-sky-500">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-555 leading-none mb-1">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {item.value || `No ${item.label.toLowerCase()}`}
                        </span>
                      </div>
                    </div>
                    {!item.value && (
                      <div
                        className="tooltip tooltip-left"
                        data-tip={`Please update ${item.label.toLowerCase()}`}
                      >
                        <AlertCircle
                          size={18}
                          className="text-amber-400 opacity-60 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {userRole !== "ROLE_ADMIN" && (
              <div className="flex items-center justify-center pb-2 mt-10 text-sm text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => navigate("/customer-service")}
                  className="flex gap-2 items-center hover:text-sky-500 transition-colors cursor-pointer hover:underline"
                >
                  <Headset size={18} />
                  <span>Need help? Contact support</span>
                </button>
              </div>
            )}
          </div>

          {/* ==================== DESKTOP VIEW ==================== */}
          <div className="hidden md:block max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <button className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 transition-all cursor-pointer">
                <Link to={backPath}>
                  <ChevronLeft size={20} />
                </Link>
              </button>
              <h1 className="text-xl font-black text-slate-805 dark:text-slate-100">
                My Profile
              </h1>
              <div className="w-10 h-10"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left Column: Summary Card */}
              <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm p-8 flex flex-col items-center shrink-0">
                <div className="w-28 h-28 rounded-full p-1 border-2 border-blue-200 dark:border-slate-700 mb-4">
                  <img
                    src={getProfileImage(profileData?.profileImage)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-black text-center text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  {fullName || "No Name Provided"}
                </h2>
                <span className="mt-2.5 px-3 py-1 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                  {userRole === "ROLE_ADMIN" ? "Administrator" : "Member"}
                </span>

                <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 my-6"></div>

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-855 rounded-xl text-blue-600 dark:text-blue-500">
                      <Mail size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Email Address</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-202 truncate">
                        {maskEmail(profileData?.email) || "No email"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-855 rounded-xl text-blue-600 dark:text-blue-500">
                      <Phone size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Phone Number</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-202">
                        {maskPhoneNumber(profileData?.phoneNumber) || "No phone"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={logOut}
                  className="w-full flex items-center justify-center gap-2 mt-8 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 dark:bg-red-955/20 dark:hover:bg-red-955/40 dark:text-red-400 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-transparent hover:border-red-200"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Right Column: Detailed Sections */}
              <div className="flex-1 w-full space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="mb-3 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Personal Information
                  </h3>
                  <div className="flex flex-col gap-3">
                    {personalItems.map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100/80 dark:border-slate-850 hover:border-blue-100 dark:hover:border-slate-800 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-855 rounded-xl text-blue-600 dark:text-blue-500">
                            {item.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-505 leading-none mb-1">
                              {item.label}
                            </span>
                            <span className={item.value ? "text-sm font-bold text-slate-700 dark:text-slate-200" : "text-sm font-semibold text-slate-400 dark:text-slate-505"}>
                              {item.value || `No ${item.label.toLowerCase()}`}
                            </span>
                          </div>
                        </div>
                        {!item.value && (
                          <div
                            className="tooltip tooltip-left"
                            data-tip={`Please update ${item.label.toLowerCase()}`}
                          >
                            <CircleAlert
                              size={18}
                              className="text-slate-400 dark:text-slate-505 hover:text-amber-550 transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Location */}
                <div>
                  <h3 className="mb-3 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Contact & Location
                  </h3>
                  <div className="flex flex-col gap-3">
                    {contactItems.map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100/80 dark:border-slate-850 hover:border-blue-100 dark:hover:border-slate-800 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-855 rounded-xl text-blue-600 dark:text-blue-500">
                            {item.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-505 leading-none mb-1">
                              {item.label}
                            </span>
                            <span className={item.value ? "text-sm font-bold text-slate-700 dark:text-slate-202" : "text-sm font-semibold text-slate-400 dark:text-slate-505"}>
                              {item.value || `No ${item.label.toLowerCase()} provided`}
                            </span>
                          </div>
                        </div>
                        {!item.value && (
                          <div
                            className="tooltip tooltip-left"
                            data-tip={`Please update ${item.label.toLowerCase()}`}
                          >
                            <CircleAlert
                              size={18}
                              className="text-slate-400 dark:text-slate-505 hover:text-amber-555 transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div>
                  <h3 className="mb-3 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Settings
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100/80 dark:border-slate-850 hover:border-blue-100 dark:hover:border-slate-800 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-855 rounded-xl text-blue-600 dark:text-blue-500">
                          {isDark ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-505 leading-none mb-1">
                            Appearance
                          </span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-202">
                            Dark Mode
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle border-blue-400 bg-white checked:bg-blue-600 checked:border-blue-600 [--tglbg:theme(colors.blue.100)] checked:[--tglbg:theme(colors.white)] cursor-pointer"
                        checked={isDark}
                        onChange={() => setIsDark(!isDark)}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div>
                  <h3 className="mb-3 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-555">
                    Account Actions
                  </h3>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={editAlert}
                      className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100/80 dark:border-slate-850 hover:border-blue-100 dark:hover:border-slate-800 transition-all duration-200 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-855 rounded-xl text-blue-600 dark:text-blue-500">
                          <UserRoundPen size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-505 leading-none mb-1">
                            Profile
                          </span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-202">
                            Edit Profile Information
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
