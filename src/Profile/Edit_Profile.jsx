import React, { useState, useEffect } from "react";
import {
  Camera,
  X,
  EyeClosed,
  Eye,
  ArrowLeft,
  Save,
  MapPin,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Lock,
  Key,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { getProfileImage } from "../reusableComponents/Hooks/ImageGet";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { usePasswordToggle } from "../reusableComponents/Forms/ToggleEye";
import SelectDropdown from "../reusableComponents/Forms/selectdropdown";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateEditProfile } from "../validations/CredentialValidation";
import { usePatchData } from "../serviceToApi/PatchData";
import { showAlert, swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProfileLoading } from "../reusableComponents/Feedbacks/loading";
import imageCompression from "browser-image-compression";
import { usePostData } from "../serviceToApi/PostData";
import { useAuth } from "../auth/Auth";
import Swal from "sweetalert2";
import Inputform from "../reusableComponents/Forms/Inputform";

function Edit_Profile() {
  const passwordField = usePasswordToggle();
  const newPassword = usePasswordToggle();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const queryClient = useQueryClient();
  const { user, UserDetails, isLoadingAuth } = useAuth();
  const userRole = user?.role;

  const editData = UserDetails;
  const loadingEdit = isLoadingAuth;

  useEffect(() => {
    const ua = navigator.userAgent || window.opera;
    const isMessenger = /FBAN|FBAV|Messenger/i.test(ua);

    if (isMessenger) {
      showAlert.warning(
        "You are in Messenger Browser",
        "Please use Chrome or Safari for better use. The camera might not work. Thank you!",
      );
    }
  }, []);

  const { mutate: editMutate } = usePatchData(
    "api/profile/update",
    API_ENDPOINTS.PROFILE_POST,
  );

  const { mutate: uploadMutate } = usePostData(
    "/api/profile/upload",
    API_ENDPOINTS.IMAGE_UPLOAD,
  );

  const { formData, formErrors, handleChange, setFormErrors, handleSubmit } =
    useForm(
      {
        firstName: editData?.firstName || "",
        lastName: editData?.lastName || "",
        middleName: editData?.middlleName || "",
        suffix: editData?.suffix || "",
        email: editData?.email || "",
        phoneNumber: editData?.phoneNumber || "",
        newPassword: "",
        oldPassword: "",
        gender: editData?.gender || "",
        address: editData?.address || "",
        birthDay: editData?.birthday || "",
      },
      ValidateEditProfile,
    );

  const handleChangeImage = async (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    const optionImg = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };

    try {
      showAlert.loading("Proccesing...", "Please wait");
      const compressedFile = await imageCompression(imageFile, optionImg);
      setSelectedFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
      let confirmUpload = false;
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      if (isDesktop) {
        await Swal.fire({
          html: `
            <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-200">
              <!-- Header -->
              <div class="flex items-start gap-4 text-left">
                <div class="w-12 h-12 bg-blue-50 dark:bg-blue-955/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div class="flex flex-col gap-1">
                  <h2 class="text-xl font-black text-slate-905 dark:text-white leading-tight">Update Profile Picture?</h2>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You are about to upload a new profile photo. Please confirm if you want to proceed with this update.
                  </p>
                </div>
              </div>

              <div class="h-[1px] bg-slate-200/80 dark:bg-slate-805 w-full my-1"></div>

              <!-- Content Card -->
              <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl text-left flex flex-col gap-3">
                <div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505">Profile Name</div>
                  <div class="flex items-center gap-1.5 mt-1.5">
                    <span class="text-sm font-bold text-slate-800 dark:text-slate-202">${fullName || "No Name"}</span>
                  </div>
                </div>

                <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-505">Action</span>
                  <span class="font-bold text-blue-600 dark:text-blue-400">Upload Photo</span>
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
                  Yes, Upload it!
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
                confirmUpload = true;
                Swal.close();
              });
            }
          }
        });
      } else {
        confirmUpload = await swalModal({
          title: "Update Profile Picture?",
          text: "Do you want to upload this new photo?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Upload it!",
        });
      }

      console.log(`New size: ${compressedFile.size / 1024 / 1024} MB`);
      if (confirmUpload) {
        showAlert.loading("Uploading image...", "Please wait");
        const photoData = new FormData();
        photoData.append("file", compressedFile);

        uploadMutate(photoData, {
          onSuccess: async (response) => {
            if (response.success) {
              setTimeout(async () => {
                await queryClient.refetchQueries(["/edit_profile"]);
                await queryClient.refetchQueries(["/header"]);
                await queryClient.refetchQueries(["/api/profile/info"]);

                showAlert.success("Success!", "Profile picture updated.");
              }, 1000);
            } else {
              setPreviewUrl(null);
              showAlert.error("Upload Failed", response.message);
            }
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fullName =
    `${formData?.firstName || ""} ${formData?.middleName || ""} ${formData?.lastName || ""} ${formData?.suffix || ""}`.trim();

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    handleSubmit(e, () => {
      showAlert.loading("Loading...", "Please wait");

      editMutate(formData, {
        onSuccess: (response) => {
          if (response.success) {
            console.log("Success!", response);
            queryClient.invalidateQueries(["/api/profile/info"]);
            queryClient.invalidateQueries(["/edit_profile"]);
            queryClient.invalidateQueries(["/header"]);
            showAlert.success(
              "Successfully updated",
              "Your information has been saved",
            );
            console.log("Edit profile", formData);
            navigate("/profile");
          } else {
            if (response.message === "Old password does not match") {
              showAlert.error("Update Failed", "Current password do not match");
            } else {
              showAlert.error("Update Failed", response.message);
            }
          }
        },
        onError: (error) => {
          console.error("Error saving data", error);
          showAlert.warning("Error saving!", error);
        },
      });
    });
  };

  const save = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    if (isDesktop) {
      let isConfirmed = false;
      await Swal.fire({
        html: `
          <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-205">
            <!-- Header -->
            <div class="flex items-start gap-4 text-left">
              <div class="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </div>
              <div class="flex flex-col gap-1">
                <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">Save changes?</h2>
                <p class="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
                  You are about to save changes to your profile information. Please review the details below to ensure accuracy before proceeding.
                </p>
              </div>
            </div>

            <div class="h-[1px] bg-slate-200/80 dark:bg-slate-800 w-full my-1"></div>

            <!-- Content Card -->
            <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl text-left flex flex-col gap-3">
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Profile Name</div>
                <div class="flex items-center gap-1.5 mt-1.5">
                  <span class="text-sm font-bold text-slate-800 dark:text-slate-200">${fullName || "No Name"}</span>
                </div>
              </div>

              <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

              <div class="flex justify-between items-center text-xs">
                <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-500">Date Modified</span>
                <span class="font-bold text-slate-800 dark:text-slate-202">
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
      if (isConfirmed) handleSave(e);
    } else {
      const saveChanges = await swalModal({
        title: "Save changes?",
        text: "This will update your profile information.",
        icon: "question",
        confirmButtonText: "Save",
      });
      if (saveChanges) handleSave(e);
    }
  };

  const discard = async () => {
    let discardChanges = false;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    if (isDesktop) {
      await Swal.fire({
        html: `
          <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-205">
            <!-- Header -->
            <div class="flex items-start gap-4 text-left">
              <div class="w-12 h-12 bg-red-50 dark:bg-red-955/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div class="flex flex-col gap-1">
                <h2 class="text-xl font-black text-slate-905 dark:text-white leading-tight">Discard changes?</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to discard your unsaved changes? Any edits you made will be permanently lost.
                </p>
              </div>
            </div>

            <div class="h-[1px] bg-slate-200/80 dark:bg-slate-805 w-full my-1"></div>

            <!-- Content Card -->
            <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl text-left flex flex-col gap-3">
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">Destination</div>
                <div class="flex items-center gap-1.5 mt-1.5">
                  <span class="text-sm font-bold text-slate-800 dark:text-slate-202">My Profile</span>
                </div>
              </div>

              <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

              <div class="flex justify-between items-center text-xs">
                <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Action</span>
                <span class="font-bold text-red-600 dark:text-red-400">Discard Edits</span>
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
                class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
              >
                Yes, Discard
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
              discardChanges = true;
              Swal.close();
            });
          }
        }
      });
    } else {
      discardChanges = await swalModal({
        title: "Discard changes?",
        text: "Redirecting to profile",
        icon: "question",
        confirmButtonText: "Discard",
      });
    }
    if (discardChanges) navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 py-4 md:py-8 px-4 md:px-8">
      {loadingEdit ? (
        <ProfileLoading />
      ) : (
        <>
          {/* ==================== MOBILE VIEW ==================== */}
          <div className="block md:hidden max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1">
                <button
                  type="button"
                  onClick={discard}
                  className="bg-sky-200 text-sky-500 rounded-lg p-1 dark:bg-slate-700 flex items-center gap-1"
                >
                  <X size={32} />
                </button>
              </div>

              <span className="text-2xl font-bold text-center text-slate-900 dark:text-white">
                Edit profile
              </span>
              <button
                type="button"
                onClick={save}
                className="flex-1 flex text-xl justify-end text-sky-500 dark:text-sky-400 font-bold items-center gap-1"
              >
                Save
              </button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <div className="relative">
                <img
                  src={
                    previewUrl
                      ? getProfileImage(previewUrl)
                      : getProfileImage(editData?.profileImage)
                  }
                  alt="Profile_pic"
                  className="rounded-full w-30 h-30 border-2 border-sky-500 dark:border-sky-400"
                />
                <label
                  htmlFor="classicFileInput"
                  className="absolute right-1 bottom-1 text-white bg-sky-500 flex items-center p-1 rounded-full dark:bg-sky-400 cursor-pointer shadow-md"
                >
                  <Camera />
                </label>
                <input
                  id="classicFileInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleChangeImage}
                />
              </div>
              <div className="flex mt-2">
                <label
                  htmlFor="classicFileInput"
                  className="cursor-pointer bg-sky-500 text-white shadow-md p-1 px-2 rounded-md dark:bg-sky-400 flex items-center gap-1 dark:text-slate-900"
                >
                  Change Photo
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-5 mt-5 bg-white shadow-sm p-3 rounded-xl dark:bg-slate-800">
              <span className="text-xl font-semibold text-slate-800 dark:text-slate-202">
                Personal Information
              </span>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    First name
                  </span>
                  <Inputform
                    type="text"
                    placeholder="Enter your first name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={
                      formErrors.firstName ? "input-error border-red-500" : ""
                    }
                  />
                  {formErrors.firstName && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {formErrors.firstName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Middle name
                  </span>
                  <Inputform
                    type="text"
                    placeholder="Enter your Middle name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Last name
                  </span>
                  <Inputform
                    type="text"
                    placeholder="Enter your Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={
                      formErrors.lastName ? "input-error border-red-500" : ""
                    }
                  />
                  {formErrors.lastName && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {formErrors.lastName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Suffix
                  </span>
                  <SelectDropdown
                    name="suffix"
                    label="Suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                    options={["Jr.", "Sr.", "II", "III", "IV"]}
                  />
                </div>
              </div>
              <div className="flex flex-col relative">
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                  Birthday
                </span>
                <DatePicker
                  selected={
                    formData.birthDay ? new Date(formData.birthDay) : null
                  }
                  onChange={(date) => {
                    handleChange({
                      target: {
                        name: "birthDay",
                        value: date,
                      },
                    });
                  }}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  scrollableYearDropdown
                  placeholderText="Select Birthday"
                  maxDate={new Date()}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  portalId="root"
                  popperClassName="!z-99"
                />
              </div>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Gender
                  </span>
                  <SelectDropdown
                    name="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={["Male", "Female"]}
                  />
                </div>
              </div>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Address
                  </span>
                  <Inputform
                    type="text"
                    placeholder="Enter your address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Phone number
                  </span>
                  <Inputform
                    type="text"
                    placeholder="Enter your phone number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={
                      formErrors.phoneNumber ? "input-error border-red-500" : ""
                    }
                  />
                  {formErrors.phoneNumber && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {formErrors.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 mt-5 bg-white shadow-sm p-3 rounded-xl dark:bg-slate-800 mb-6">
              <span className="text-xl font-semibold text-slate-800 dark:text-gray-202">
                Account
              </span>
              <div className="flex flex-col relative">
                <div>
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Email
                  </span>
                  <Inputform
                    type="text"
                    placeholder="Enter your new email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={
                      formErrors.email ? "input-error border-red-500" : ""
                    }
                  />
                </div>
                {formErrors.email && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className="flex flex-col relative">
                <div
                  className={`flex items-center border rounded-md px-3 transition-all duration-200 ${formErrors.oldPassword ? "border border-red-500" : "border border-slate-300"} `}
                >
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    Current password
                  </span>
                  <Inputform
                    type={passwordField.type}
                    name="oldPassword"
                    placeholder="i.e Juancruz21"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
                  />
                  <div onClick={passwordField.toggle} className="cursor-pointer">
                    {passwordField.show ? <Eye /> : <EyeClosed />}
                  </div>
                </div>
                {formErrors.oldPassword && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {formErrors.oldPassword}
                  </span>
                )}
              </div>
              <div className="flex flex-col relative">
                <div
                  className={`flex items-center border rounded-md px-3 transition-all duration-200 ${formErrors.newPassword ? "border border-red-500" : "border border-slate-300"} `}
                >
                  <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 dark:bg-slate-800 dark:text-gray-400">
                    New password
                  </span>
                  <div className="flex items-center justify-between w-full">
                    <Inputform
                      type={newPassword.type}
                      placeholder="i.e Juancruz21"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
                    />
                    <div onClick={newPassword.toggle} className="cursor-pointer">
                      {newPassword.show ? <Eye /> : <EyeClosed />}
                    </div>
                  </div>
                </div>
                {formErrors.newPassword && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {formErrors.newPassword}
                  </span>
                )}
              </div>
            </div>
          </div>
        {/* ==================== DESKTOP EDIT PROFILE LAYOUT ==================== */}
        <div className="hidden md:block max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold mb-1">
                <span>Settings</span>
                <span>&gt;</span>
                <span className="text-slate-500 dark:text-slate-400">Edit Profile</span>
              </div>
              <h1 className="text-2xl font-black text-slate-805 dark:text-slate-100">
                Edit Profile
              </h1>
              <p className="text-xs text-slate-505 dark:text-slate-400 mt-1">
                Manage personal details and security credentials.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={discard}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-55 dark:hover:bg-slate-800 transition-colors cursor-pointer bg-white dark:bg-slate-900 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm p-8 flex flex-col items-center shrink-0">
              <div className="relative group">
                <img
                  src={
                    previewUrl
                      ? getProfileImage(previewUrl)
                      : getProfileImage(editData?.profileImage)
                  }
                  alt="Profile"
                  className="rounded-full w-28 h-28 border-2 border-blue-200 dark:border-slate-700 object-cover"
                />
                <label
                  htmlFor="fileInput"
                  className="absolute right-1 bottom-1 text-white bg-blue-600 hover:bg-blue-700 flex items-center p-2 rounded-full cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  <Camera size={16} />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleChangeImage}
                />
              </div>

              <h2 className="text-lg font-black text-center text-slate-800 dark:text-slate-100 uppercase tracking-tight mt-4">
                {fullName || "No Name Provided"}
              </h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-505 mt-1">
                {userRole === "ROLE_ADMIN" ? "Administrator" : "Member"}
              </span>

              <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-805 my-6"></div>

              {/* Status and Joined Date */}
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-55 dark:bg-blue-955/40 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Joined</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-202">
                    {editData?.createdAt ? new Date(editData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Oct 2022"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Edit Forms */}
            <div className="flex-1 w-full space-y-6">
              {/* Identity Information */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600 dark:text-blue-500" size={18} />
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    Identity Information
                  </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                      First Name
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full bg-slate-50/30 dark:bg-slate-955/20 border border-slate-202 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-blue-505 ${
                        formErrors.firstName ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {formErrors.firstName && (
                      <span className="text-red-500 text-xs mt-1 block pl-2">{formErrors.firstName}</span>
                    )}
                  </div>

                  {/* Middle Name */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider z-10">
                      Middle Name
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your Middle name"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full bg-slate-50/30 dark:bg-slate-955/20 border border-slate-202 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-blue-505"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                      Last Name
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your Last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full bg-slate-50/30 dark:bg-slate-955/20 border border-slate-202 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-blue-505 ${
                        formErrors.lastName ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {formErrors.lastName && (
                      <span className="text-red-500 text-xs mt-1 block pl-2">{formErrors.lastName}</span>
                    )}
                  </div>

                  {/* Suffix */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                      Suffix
                    </span>
                    <SelectDropdown
                      name="suffix"
                      label="Suffix"
                      value={formData.suffix}
                      onChange={handleChange}
                      options={["Jr.", "Sr.", "II", "III", "IV"]}
                    />
                  </div>

                  {/* Gender */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                      Gender
                    </span>
                    <SelectDropdown
                      name="gender"
                      label="Gender"
                      value={formData.gender}
                      onChange={handleChange}
                      options={["Male", "Female"]}
                    />
                  </div>

                  {/* Birthday */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider z-10">
                      Birthday
                    </span>
                    <div className="relative w-full">
                      <DatePicker
                        selected={
                          formData.birthDay ? new Date(formData.birthDay) : null
                        }
                        onChange={(date) => {
                          handleChange({
                            target: {
                              name: "birthDay",
                              value: date,
                            },
                          });
                        }}
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        scrollableYearDropdown
                        placeholderText="Select Birthday"
                        maxDate={new Date()}
                        className="w-full bg-slate-50/30 dark:bg-slate-955/20 border border-slate-202 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-blue-505"
                        portalId="root"
                        popperClassName="!z-99"
                      />
                      <Calendar className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-855 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
                  <MapPin className="text-blue-600 dark:text-blue-505" size={18} />
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    Contact Details
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Address */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                      Address
                    </span>
                    <div className="relative flex items-center border border-slate-202 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-955/20 focus-within:ring-2 focus-within:ring-blue-505 transition-all px-4">
                      <MapPin size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter full address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none pl-3 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                      Phone Number
                    </span>
                    <div className="relative flex items-center border border-slate-202 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-955/20 focus-within:ring-2 focus-within:ring-blue-505 transition-all px-4">
                      <PhoneIcon size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter phone number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none pl-3 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650"
                      />
                    </div>
                    {formErrors.phoneNumber && (
                      <span className="text-red-500 text-xs mt-1 block pl-2">{formErrors.phoneNumber}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-855 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
                  <Lock className="text-blue-600 dark:text-blue-505" size={18} />
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    Credentials
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Email Address */}
                  <div className="relative flex flex-col">
                    <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                      Email Address
                    </span>
                    <div className="relative flex items-center border border-slate-202 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-955/20 focus-within:ring-2 focus-within:ring-blue-505 transition-all px-4">
                      <MailIcon size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter email address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none pl-3 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650"
                      />
                    </div>
                    {formErrors.email && (
                      <span className="text-red-500 text-xs mt-1 block pl-2">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Password */}
                    <div className="relative flex flex-col">
                      <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider z-10">
                        Current Password
                      </span>
                      <div className="relative flex items-center border border-slate-202 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-955/20 focus-within:ring-2 focus-within:ring-blue-505 transition-all px-4">
                        <Lock size={16} className="text-slate-400 shrink-0" />
                        <input
                          type={passwordField.type}
                          name="oldPassword"
                          placeholder="i.e. Juancruz21"
                          value={formData.oldPassword}
                          onChange={handleChange}
                          className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none pl-3 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650"
                        />
                        <div onClick={passwordField.toggle} className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors ml-2 shrink-0">
                          {passwordField.show ? <Eye size={16} /> : <EyeClosed size={16} />}
                        </div>
                      </div>
                      {formErrors.oldPassword && (
                        <span className="text-red-500 text-xs mt-1 block pl-2">{formErrors.oldPassword}</span>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="relative flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider z-10">
                          New Password
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider self-end pr-2">
                          Min 8 chars
                        </span>
                      </div>
                      <div className="relative flex items-center border border-slate-202 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-955/20 focus-within:ring-2 focus-within:ring-blue-505 transition-all px-4">
                        <Key size={16} className="text-slate-400 shrink-0" />
                        <input
                          type={newPassword.type}
                          placeholder="i.e. Juancruz21"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none pl-3 py-3 text-sm font-semibold text-slate-707 dark:text-slate-200 placeholder-slate-350 dark:placeholder-slate-650"
                        />
                        <div onClick={newPassword.toggle} className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors ml-2 shrink-0">
                          {newPassword.show ? <Eye size={16} /> : <EyeClosed size={16} />}
                        </div>
                      </div>
                      {formErrors.newPassword && (
                        <span className="text-red-500 text-xs mt-1 block pl-2">{formErrors.newPassword}</span>
                      )}
                    </div>
                  </div>
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

export default Edit_Profile;
