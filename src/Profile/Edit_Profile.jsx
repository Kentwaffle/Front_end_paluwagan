import React from "react";
import { Camera, X, EyeClosed, Eye } from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Inputform from "../reusableComponents/Inputform";
import { usePasswordToggle } from "../reusableComponents/Hooks/ToggleEye";
import SelectDropdown from "../reusableComponents/selectdropdown";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateEditProfile } from "../validations/CredentialValidation";
import { usePatchData } from "../serviceToApi/PatchData";
import { showAlert, swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProfileLoading } from "../reusableComponents/loading";

function Edit_Profile() {
  const passwordField = usePasswordToggle();
  const newPassword = usePasswordToggle();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: editData, isLoading: loadingEdit } = useFetchData(
    "/edit_profile",
    API_ENDPOINTS.PROFILE_GET,
  );

  const { mutate: editMutate } = usePatchData(
    "api/profile/update",
    API_ENDPOINTS.PROFILE_POST,
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

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    handleSubmit(e, () => {
      showAlert.loading("Loading...", "Please wait");

      editMutate(formData, {
        onSuccess: (response) => {
          if (response.success) {
            console.log("Success!", response);
            queryClient.invalidateQueries(["/profile"]);
            queryClient.invalidateQueries(["/edit_profile"]);
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
    const saveChanges = await swalModal({
      title: "Save changes?",
      text: "This will update your profile information.",
      icon: "question",
      confirmButtonText: "Save",
    });
    if (saveChanges) handleSave(e);
  };
  const discard = async () => {
    const discardChanges = await swalModal({
      title: "Discard changes?",
      text: "Ridirecting to profile",
      icon: "question",
      confirmButtonText: "Discard",
    });
    if (discardChanges) navigate("/profile");
  };
  return (
    <div className="min-h-screen">
      {loadingEdit ? (
        <ProfileLoading key={"EditLoading"} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <div className="flex-1">
              <button
                onClick={discard}
                className=" bg-sky-200 text-sky-500 rounded-lg p-1"
              >
                <X size={32} />
              </button>
            </div>

            <span className="text-2xl font-bold text-center text-slate-900">
              Edit profile
            </span>
            <button
              onClick={save}
              className="flex-1 flex text-xl justify-end text-sky-500 "
            >
              Save
            </button>
          </div>

          <div className="flex flex-col justify-center items-center">
            <div className="relative">
              <img
                src={Default_pic}
                alt="Profile_pic"
                className="rounded-full w-30 h-30 border-2 border-sky-500"
              />
              <button className="absolute right-1 bottom-1 text-white bg-sky-500 flex items-center p-1 rounded-full">
                <Camera />
              </button>
            </div>
            <label className="cursor-pointer bg-sky-500 text-white shadow-md p-1 px-2 mt-2 rounded-md">
              <input type="file" className="hidden" accept="image/*" />
              Change Photo
            </label>
          </div>

          <div className="flex flex-col gap-5 mt-5 bg-white shadow-sm p-3 rounded-xl">
            <span className="text-xl font-semibold text-slate-800">
              Personal Information
            </span>
            <div className="flex flex-col relative lazy">
              <div>
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
                  <span className="text-red-500 text-xs mt-1">
                    {formErrors.firstName}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col relative">
              <div>
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
                  <span className="text-red-500 text-xs mt-1">
                    {formErrors.lastNa2me}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col relative">
              <div>
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
              <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
                className="w-full not-last:focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 p-2 rounded-md"
                portalId="root"
                popperClassName="!z-99"
              />
              {/* <Inputform
              type="date"
              placeholder="Enter your first name"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
            /> */}
            </div>
            <div className="flex flex-col relative">
              <div>
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
                  Address
                </span>
                <Inputform
                  type="text"
                  placeholder="Enter your first name"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col relative">
              <div>
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
                  Phone number
                </span>
                <Inputform
                  type="text"
                  placeholder="Enter your first name"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={
                    formErrors.phoneNumber ? "input-error border-red-500" : ""
                  }
                />
                {formErrors.phoneNumber && (
                  <span className="text-red-500 text-xs mt-1">
                    {formErrors.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-5 bg-white shadow-sm p-3 rounded-xl">
            <span className="text-xl font-semibold text-slate-800">
              Account
            </span>
            <div className="flex flex-col relative">
              <div>
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.email}
                </span>
              )}
            </div>
            <div className="flex flex-col relative">
              <div
                className={`flex items-center border rounded-md px-3 transition-all duration-200 ${formErrors.oldPassword ? "border border-red-500" : "border border-slate-300"} `}
              >
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
                  Current password
                </span>
                <Inputform
                  type={passwordField.type}
                  name="oldPassword"
                  placeholder="i.e Juancruz21"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={`!border-none !outline-none !ring-0 !focus:ring-0 
                !focus:outline-none w-full px-0 shadow-none bg-transparent 
                `}
                />
                <div onClick={passwordField.toggle} className="cursor-pointer">
                  {passwordField.show ? <Eye /> : <EyeClosed />}
                </div>
              </div>
              {formErrors.oldPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.oldPassword}
                </span>
              )}
            </div>
            <div className="flex flex-col relative">
              <div
                className={`flex items-center border rounded-md px-3 transition-all duration-200 ${formErrors.newPassword ? "border border-red-500" : "border border-slate-300"} `}
              >
                <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
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
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.newPassword}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Edit_Profile;
