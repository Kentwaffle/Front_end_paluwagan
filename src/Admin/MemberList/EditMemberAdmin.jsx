import React from "react";
import { useParams } from "react-router-dom";
import Inputform from "../../reusableComponents/Forms/Inputform";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { usePatchData } from "../../serviceToApi/PatchData";
import { ValidateEditMemberAdmin } from "../../validations/CredentialValidation";
import {
  showAlert,
  swalModal,
} from "../../reusableComponents/Alerts/SweetAlerts";
import SelectDropdown from "../../reusableComponents/Forms/selectdropdown";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

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

  //  {
  //     firstName: "",
  //     middleName: "",
  //     lastName: "",
  //     suffix: "",
  //     gender: "",
  //     birthDay: "",
  //     address: "",
  //     phoneNumber: "",
  //     email: "",
  //   },

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
      const edit = await swalModal({
        title: `Are you sure you want to edit?`,
        html: `You're about to edit <b>${fullName}</b> personal information.`,
        confirmButtonText: "Yes, edit now",
        icon: "question",
      });
      if (edit) handleEdit();
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
    <div className="p-5">
      <label className="text-slate-800  font-black mb-3 block">
        Edit ({fullName || "No data"}) Information
      </label>

      <div className="flex flex-col">
        {fieldMap.map((items, index) => (
          <div key={index} className="my-2 relative">
            <span className="absolute -top-2 left-3 bg-slate-50 px-1 text-sm font-bold text-gray-500 z-3 dark:bg-slate-800 dark:text-gray-400dark:bg-slate-800 dark:text-gray-400">
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
  );
}

export default EditMemberAdmin;
