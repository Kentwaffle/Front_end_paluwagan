import React from "react";
import { Camera, X } from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Modal from "../reusableComponents/Modal";
import Inputform from "../reusableComponents/Inputform";
import { usePasswordToggle } from "../reusableComponents/Hooks/ToggleEye";
import SelectDropdown from "../reusableComponents/selectdropdown";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateEditProfile } from "../validations/CredentialValidation";
import { usePatchData } from "../serviceToApi/PatchData";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Edit_Profile() {
  const passwordField = usePasswordToggle();
  const confirmPasswordField = usePasswordToggle();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const back_openModal = () =>
    document.getElementById("back_modal").showModal();
  const save_openModal = () =>
    document.getElementById("save_modal").showModal();

  const { data } = useFetchData("/edit_profile", API_ENDPOINTS.PROFILE_GET);

  const { mutate } = usePatchData(
    "api/profile/update",
    API_ENDPOINTS.PROFILE_POST,
  );

  const { formData, formErrors, handleChange, setFormErrors, handleSubmit } =
    useForm(
      {
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        middleName: data?.middlleName || "",
        suffix: data?.suffix || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
        password: "",
        gender: data?.gender || "",
        address: data?.address || "",
        birthDay: data?.birthday || "",
      },
      ValidateEditProfile,
    );

  const handleSave = (e) => {
    showAlert.loading("Loading...", "Please wait");

    handleSubmit(e, () => {
      mutate(formData, {
        onSuccess: (data) => {
          console.log("Success!", data);
          queryClient.invalidateQueries(["/profile"]);
          queryClient.invalidateQueries(["/edit_profile"]);
          showAlert.success(
            "Successfully updated",
            "Your information has been saved",
          );
          console.log("Edit profile", formData);
          navigate("/profile");
        },
        onError: (error) => {
          console.error("Error saving data", error);
          showAlert.warning("Error saving!", error);
        },
      });
    });
  };

  return (
    <div className="min-h-screen p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <button
            onClick={back_openModal}
            className=" bg-sky-200 text-sky-500 rounded-lg p-1"
          >
            <X size={32} />
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
        <button
          onClick={save_openModal}
          className="flex-1 flex text-xl justify-end text-sky-500 "
        >
          Save
        </button>
        <Modal
          id="save_modal"
          title="Save Changes?"
          actionButton={
            <button onClick={handleSave} className="btn btn-info text-white">
              Yes
            </button>
          }
        ></Modal>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="relative">
          <img
            src={Default_pic}
            alt="Profile_pic"
            className="rounded-full w-30 h-30 border-2 border-sky-300"
          />
          <button className="absolute right-1 bottom-1 bg-sky-300 p-1 rounded-full">
            <Camera />
          </button>
        </div>
        <label className="cursor-pointer bg-sky-300 shadow-md p-1 px-2 mt-2 rounded-md">
          <input type="file" className="hidden" accept="image/*" />
          Change Photo
        </label>
      </div>

      <div className="flex flex-col gap-5 mt-5 bg-gray-50 shadow-md p-3 rounded-xl">
        <span className="text-xl font-semibold">Personal Information</span>
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
                {formErrors.lastName}
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
            selected={formData.birthDay ? new Date(formData.birthDay) : null}
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
              className={formErrors.email ? "input-error border-red-500" : ""}
            />
            {formErrors.phoneNumber && (
              <span className="text-red-500 text-xs mt-1">
                {formErrors.phoneNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-5 mt-5 bg-gray-50 shadow-md p-3 rounded-xl">
        <span className="text-xl font-semibold">Account</span>
        <div className="flex flex-col relative">
          <div>
            <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
              Email
            </span>
            <Inputform
              type="text"
              placeholder="Enter your first name"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "input-error border-red-500" : ""}
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
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.password
                ? "border-red-500"
                : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
            }`}
          >
            <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
              Current password
            </span>
            <Inputform
              type="password"
              name="password"
              placeholder="Enter your first name"
              value={formData.password}
              onChange={handleChange}
              className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
            />
            <div onClick={passwordField.toggle} className="cursor-pointer">
              {passwordField.show ? <Eye /> : <EyeClosed />}
            </div>
          </div>
          {formErrors.password && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.password}
            </span>
          )}
        </div>
        <div className="flex flex-col relative">
          <div
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.confirmPassword
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
            }`}
          >
            <span className="absolute -top-2 left-3 bg-white px-1 text-sm font-bold text-gray-500 z-10 ">
              New password
            </span>
            <div className="flex items-center justify-between w-full">
              <Inputform
                type={confirmPasswordField.type}
                placeholder="i.e Juancruz21"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
              />
              <div
                onClick={confirmPasswordField.toggle}
                className="cursor-pointer"
              >
                {confirmPasswordField.show ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Edit_Profile;
