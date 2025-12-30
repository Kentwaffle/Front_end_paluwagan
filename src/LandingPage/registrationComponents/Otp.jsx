import React from "react";

function Otp() {
  return (
    <div>
      <div className="flex flex-col">
        <span>Verify email via OTP(One time password)</span>
        <Inputform
          type="text"
          placeholder="I.E 123456"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          className={formErrors.otp ? "input-error border-red-500" : ""}
        />
        {formErrors.first_name && (
          <span className="text-red-500 text-xs mt-1">{formErrors.otp}</span>
        )}
      </div>
    </div>
  );
}

export default Otp;
