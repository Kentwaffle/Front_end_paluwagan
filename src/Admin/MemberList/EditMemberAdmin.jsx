import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Inputform from "../../reusableComponents/Forms/Inputform";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { usePatchData } from "../../serviceToApi/PatchData";
import { ValidateEditMemberAdmin } from "../../validations/CredentialValidation";
import { showAlert, swalModal } from "../../reusableComponents/Alerts/SweetAlerts";
import SelectDropdown from "../../reusableComponents/Forms/selectdropdown";
import { useQueryClient } from "@tanstack/react-query";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { formatDate } from "../../reusableComponents/Utils/formatter";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, ShieldCheck, ArrowLeft, Save, Landmark } from "lucide-react";
import Swal from "sweetalert2";

function EditMemberAdmin() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id } = useParams();
  const { initialData, fullName } = location.state || {};

  const { formData, handleChange, handleSubmit, formErrors } = useForm(
    {
      firstName: initialData?.firstName || "",
      middleName: initialData?.middlleName || "",
      lastName: initialData?.lastName || "",
      suffix: initialData?.suffix || "",
      gender: initialData?.gender || "",
      birthDay: initialData?.birthday || "",
      address: initialData?.address || "",
      phoneNumber: initialData?.phoneNumber || "",
      email: initialData?.email || "",
    },
    ValidateEditMemberAdmin,
  );

  const fieldMap = [
    { label: "First name", name: "firstName" },
    { label: "Middle name", name: "middleName" },
    { label: "Last name", name: "lastName" },
    {
      label: "Suffix",
      name: "suffix",
      type: "dropdown",
      options: ["Jr.", "Sr.", "III", "IV"],
    },
    {
      label: "Gender",
      name: "gender",
      type: "dropdown",
      options: ["Male", "Female"],
    },
    { label: "Birthday", name: "birthDay", type: "date" },
    { label: "Address", name: "address" },
    { label: "Phone Number", name: "phoneNumber" },
    { label: "Email", name: "email" },
  ];

  const { mutate: editData } = usePatchData(
    API_ENDPOINTS.ADMIN_EDIT_MEMBER(user_id),
    "editMember",
  );

  const editMember = (e) => {
    handleSubmit(e, async () => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      if (isDesktop) {
        let isConfirmed = false;
        await Swal.fire({
          html: `
            <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-200">
              <!-- Header -->
              <div class="flex items-start gap-4 text-left">
                <div class="w-12 h-12 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-455 rounded-full flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </div>
                <div class="flex flex-col gap-1">
                  <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">Save changes?</h2>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You are about to save changes to this member's personal information. Please review the details below to ensure accuracy before proceeding.
                  </p>
                </div>
              </div>

              <div class="h-[1px] bg-slate-200/80 dark:bg-slate-800 w-full my-1"></div>

              <!-- Content Card -->
              <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl text-left flex flex-col gap-3">
                <div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">Target Member</div>
                  <div class="flex items-center gap-1.5 mt-1.5">
                    <svg class="w-4 h-4 text-slate-400 dark:text-slate-505" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="text-sm font-bold text-slate-800 dark:text-slate-205">${fullName}</span>
                  </div>
                </div>

                <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Member ID</span>
                  <span class="font-bold text-slate-800 dark:text-slate-205">
                    ${user_id}
                  </span>
                </div>

                <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Date Modified</span>
                  <span class="font-bold text-slate-800 dark:text-slate-205">
                    ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-3 mt-4">
                <button 
                  id="swal-cancel-btn" 
                  type="button" 
                  class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  id="swal-confirm-btn" 
                  type="button" 
                  class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
                >
                  Yes, Save Changes
                </button>
              </div>
            </div>
          `,
          showConfirmButton: false,
          background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
          customClass: {
            popup: "rounded-3xl border border-slate-100 dark:border-slate-850 max-w-[480px] p-6 shadow-xl",
          },
          didOpen: () => {
            const cancelBtn = document.getElementById("swal-cancel-btn");
            const confirmBtn = document.getElementById("swal-confirm-btn");
            
            if (cancelBtn) {
              cancelBtn.addEventListener("click", () => {
                Swal.close();
              });
            }
            if (confirmBtn) {
              confirmBtn.addEventListener("click", () => {
                isConfirmed = true;
                Swal.close();
              });
            }
          }
        });

        if (isConfirmed) {
          handleEdit();
        }
      } else {
        const edit = await swalModal({
          title: `Are you sure you want to edit?`,
          html: `You're about to edit <b>${fullName}</b> personal information.`,
          confirmButtonText: "Yes, edit now",
          icon: "question",
        });
        if (edit) handleEdit();
      }
    });
  };

  const handleEdit = () => {
    showAlert.loading("Loading", "Please wait");
    editData(formData, {
      onSuccess: () => {
        showAlert.success("Success", "Updated successfully");
        queryClient.invalidateQueries(["/api/profile/info"]);
        queryClient.invalidateQueries(["/edit_profile"]);
        queryClient.invalidateQueries(["/header"]);
        queryClient.invalidateQueries({
          queryKey: ["memberList-overview"],
        });
        navigate(`/admin/memberlist/${user_id}`);
      },
      onError: (err) => {
        console.log("Full Error Object:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        showAlert.warning("Failed", errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden text-left">
        <label className="text-slate-800 dark:text-slate-200 font-black mb-3 block">
          Edit ({fullName || "No data"}) Information
        </label>

        <div className="flex flex-col">
          {fieldMap.map((items, index) => (
            <div key={index} className="my-2 relative">
              <span className="absolute -top-2 left-3 bg-slate-50 px-1 text-sm font-bold text-gray-500 z-3 dark:bg-slate-800 dark:text-gray-400">
                {items.label}
              </span>
              {items.type === "dropdown" ? (
                <SelectDropdown
                  name={items.name}
                  label={items.name}
                  options={items.options}
                  onChange={handleChange}
                  value={formData[items.name]}
                />
              ) : (
                <Inputform
                  type={items.type || "text"}
                  placeholder={items.placeHolder}
                  name={items.name}
                  value={formData[items.name]}
                  onChange={handleChange}
                  className={
                    formErrors[items.name] ? "input-error border-red-500" : ""
                  }
                />
              )}
              {formErrors[items.name] && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors[items.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-sky-400 to-sky-600 my-5 text-white rounded-xl shadow-md overflow-hidden active:scale-95 transition-all">
          <button
            type="button"
            onClick={editMember}
            className="w-full py-4 font-black uppercase tracking-widest text-center"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col gap-6 text-left">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/admin/memberlist')}>Users</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:underline" onClick={() => navigate(`/admin/memberlist/${user_id}`)}>{fullName}</span>
            <span>&gt;</span>
            <span className="text-slate-500">Edit Information</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mt-1">
            Edit Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: User Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
              
              <div className="relative shrink-0">
                <img
                  src={getProfileImage(initialData?.profileImage)}
                  alt="Profile"
                  className="rounded-full w-24 h-24 border-2 border-slate-100 dark:border-slate-800 p-0.5 object-cover shadow-inner"
                />
              </div>

              <h3 className="text-base font-bold text-slate-850 dark:text-white mt-4 leading-tight">
                {fullName}
              </h3>
              <span className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-bold uppercase tracking-wider">
                {initialData?.role_name === "ROLE_ADMIN" ? "ADMIN" : "MEMBER"}
              </span>

              <div className="flex gap-2 mt-3.5">
                <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                  ACTIVE
                </span>
              </div>

              <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full my-6"></div>

              {/* Status details list */}
              <div className="w-full flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-405 font-bold">Last Login</span>
                  <span className="text-slate-700 dark:text-slate-205 font-semibold">
                    {initialData?.online ? "Active Now" : "Oct 24, 2023"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-405 font-bold">Account Created</span>
                  <span className="text-slate-700 dark:text-slate-205 font-semibold">
                    {formatDate(initialData?.verifiedDate) || "Jan 12, 2021"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-405 font-bold">Security Status</span>
                  <span className="text-blue-600 dark:text-sky-400 font-bold flex items-center gap-1">
                    <ShieldCheck size={14} />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Edit Forms cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Card 1: Identity Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              
              <div className="flex items-center gap-2">
                <User size={18} className="text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Identity Details
                </h3>
              </div>

              <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full"></div>

              <div className="grid grid-cols-2 gap-6">
                
                {/* First Name */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    First Name
                  </span>
                  <Inputform
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`${formErrors.firstName ? "border-red-500 animate-pulse" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"}`}
                  />
                  {formErrors.firstName && (
                    <span className="text-red-550 text-[10px] font-semibold">{formErrors.firstName}</span>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                    Last Name
                  </span>
                  <Inputform
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`${formErrors.lastName ? "border-red-500 animate-pulse" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"}`}
                  />
                  {formErrors.lastName && (
                    <span className="text-red-550 text-[10px] font-semibold">{formErrors.lastName}</span>
                  )}
                </div>

                {/* Middle Name */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                    Middle Name (Optional)
                  </span>
                  <Inputform
                    name="middleName"
                    placeholder="e.g. Kenny"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="dark:bg-slate-955 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                    Gender
                  </span>
                  <SelectDropdown
                    name="gender"
                    options={["Male", "Female"]}
                    onChange={handleChange}
                    value={formData.gender}
                    className="dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-11 text-xs"
                  />
                </div>

              </div>

              {/* Birthday Input */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Date of Birth
                </span>
                <div className="relative">
                  <Inputform
                    name="birthDay"
                    type="date"
                    value={formData.birthDay}
                    onChange={handleChange}
                    className={`${formErrors.birthDay ? "border-red-500" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs pr-10"}`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none">
                    <Calendar size={16} />
                  </div>
                </div>
                {formErrors.birthDay && (
                  <span className="text-red-550 text-[10px] font-semibold">{formErrors.birthDay}</span>
                )}
              </div>

            </div>

            {/* Card 2: Contact Information */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Contact Information
                </h3>
              </div>

              <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full"></div>

              {/* Primary Email */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Primary Email
                </span>
                <div className="relative">
                  <Inputform
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${formErrors.email ? "border-red-500" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs pl-10"}`}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none">
                    <Mail size={16} />
                  </div>
                </div>
                {formErrors.email && (
                  <span className="text-red-550 text-[10px] font-semibold">{formErrors.email}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                
                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    Phone Number
                  </span>
                  <div className="relative">
                    <Inputform
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`${formErrors.phoneNumber ? "border-red-500" : "dark:bg-slate-955 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs pl-10"}`}
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none">
                      <Phone size={16} />
                    </div>
                  </div>
                  {formErrors.phoneNumber && (
                    <span className="text-red-555 text-[10px] font-semibold">{formErrors.phoneNumber}</span>
                  )}
                </div>

                {/* Secondary Phone (Mock) */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    Secondary Phone (Optional)
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-transparent dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-blue-500 outline-none h-11 text-xs rounded-xl pl-10"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none">
                      <Phone size={16} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Street Address */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Street Address
                </span>
                <Inputform
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${formErrors.address ? "border-red-500 animate-pulse" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"}`}
                />
                {formErrors.address && (
                  <span className="text-red-550 text-[10px] font-semibold">{formErrors.address}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                
                {/* City */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    City
                  </span>
                  <input
                    type="text"
                    defaultValue="Pasig"
                    className="w-full bg-transparent dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-blue-500 outline-none h-11 text-xs rounded-xl px-4"
                  />
                </div>

                {/* State Dropdown */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    State / Province
                  </span>
                  <select className="w-full bg-transparent dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-blue-500 outline-none h-11 text-xs rounded-xl px-4">
                    <option>NCR</option>
                  </select>
                </div>

                {/* Zip Code */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                    ZIP / Postal Code
                  </span>
                  <input
                    type="text"
                    defaultValue="1602"
                    className="w-full bg-transparent dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-blue-500 outline-none h-11 text-xs rounded-xl px-4"
                  />
                </div>

                {/* Country Dropdown */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                    Country
                  </span>
                  <select className="w-full bg-transparent dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-blue-500 outline-none h-11 text-xs rounded-xl px-4">
                    <option>Philippines</option>
                  </select>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Sticky Bottom Actions Bar (Desktop Only) */}
      <div className="hidden md:flex justify-end items-center gap-6 mt-8 py-4 border-t border-t-slate-200 dark:border-t-slate-800 bg-transparent select-none">
        <button
          onClick={() => navigate(`/admin/memberlist/${user_id}`)}
          className="text-xs font-bold text-blue-650 hover:text-blue-700 cursor-pointer underline"
        >
          Discard Changes
        </button>
        <button
          onClick={editMember}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Save size={14} />
          <span>Save Changes</span>
        </button>
      </div>

    </div>
  );
}

export default EditMemberAdmin;
