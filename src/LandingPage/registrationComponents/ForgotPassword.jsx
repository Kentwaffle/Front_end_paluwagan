import Inputform from "../../reusableComponents/Inputform";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { ValidateForgotPassword } from "../../validations/CredentialValidation";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

//Api
import api from "../../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

function ForgotPassword() {
  const { handleChange, formErrors, formData, handleSubmit } = useForm(
    {
      email: "",
    },
    ValidateForgotPassword
  );
  const navigate = useNavigate();

  const handleSendForgotPassword = async () => {
    try {
      const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD_OTP, {
        email: formData.email,
      });

      const userID = response.data.userId;

      await showAlert.success(
        "Verified Email!",
        "OTP has been send to your inbox or spam"
      );

      navigate("/forgot-password/changepassword", {
        state: {
          email: formData.email,
          userId: userID,
        },
      });
    } catch (error) {
      console.log(error);
      showAlert.error("Error", error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="p-5 w-full md:min-h-screen md:flex md:items-center md:justify-center ">
      <form
        onSubmit={(e) => handleSubmit(e, handleSendForgotPassword)}
        className="flex flex-col gap-3 w-full md:max-w-xl md:border md:border-stone-300 md:py-2 md:px-3 md:pb-5 md:rounded-md md:shadow-md"
      >
        <div className="w-full  flex justify-end">
          <button>
            <Link to={"/"} className="cursor-pointer  font-semibold">
              <X />
            </Link>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl">Enter your email</span>
          <Inputform
            type="email"
            placeholder="i.e juan@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
