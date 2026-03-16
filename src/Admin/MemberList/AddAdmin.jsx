import React from "react";
import { Camera } from "lucide-react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import Inputform from "../../reusableComponents/Inputform";
import SelectDropdown from "../../reusableComponents/selectdropdown";

function AddAdmin() {
  return (
    <div className="p-5 min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="relative">
          <img
            // src={
            //   previewUrl
            //     ? getProfileImage()
            //     : getProfileImage(editData?.profileImage)
            // }
            src={getProfileImage()}
            alt="Profile_pic"
            className="rounded-full w-30 h-30 border-2 border-sky-500 dark:border-sky-400"
          />
          <label
            htmlFor="fileInput"
            type="button"
            className="absolute right-1 bottom-1 text-white bg-sky-500 flex items-center p-1 rounded-full dark:bg-sky-400 cursor-pointer shadow-md"
          >
            <Camera />
          </label>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept="image/*"
            capture="environment"
            //   onChange={handleChangeImage}
          />
        </div>
      </div>

      <div className="my-5">
        {[
          {
            name: "firstName",
            label: "First name",
            placeholderText: "eg. Juan",
            valueData: "niga",
            onChangeData: "asd",
            onErrorData: "asdad",
            type: "input",
          },
          {
            name: "middleName",
            label: "Middle name",
            placeholderText: "eg. Cruz",
            valueData: "niga",
            onChangeData: "asd",
            onErrorData: "asdad",
            type: "input",
          },
          {
            name: "lastName",
            label: "Last name",
            placeholderText: "eg. Dela",
            valueData: "niga",
            onChangeData: "asd",
            onErrorData: "asdad",
            type: "input",
          },
          {
            name: "suffixName",
            label: "Suffix name",

            valueData: "niga",
            onChangeData: "asd",
            onErrorData: "asdad",
            options: ["Jr.", "Sr.", "III", "IV"],
            type: "dropdown",
          },
          {
            name: "number",
            label: "Number",
            placeholderText: "eg. 09000000000",
            valueData: "niga",
            onChangeData: "asd",
            onErrorData: "asdad",
            type: "input",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col md:col-span-2 my-5"
          >
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              {item.label}
            </span>
            {item.type === "dropdown" ? (
              <SelectDropdown
                name={item.name}
                label={"Suffix"}
                options={item.options}
              />
            ) : (
              <Inputform
                type="text"
                placeholder={item.placeholderText}
                name={item.name}
                //   value={formData.firstName}
                //   onChange={handleChange}
                //   className={
                //     formErrors.firstName
                //       ? "input-error border-red-500"
                //       : "border-slate-300 dark:border-slate-700 focus:border-sky-500"
                //   }
              />
              //  {formErrors.firstName && (
              //   <span className="text-red-500 text-[10px] mt-1">
              //     {formErrors.firstName}
              //   </span>
              // )}
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddAdmin;
