import React, {
  useState
} from "react";

import API from "../services/api";

import {
  useNavigate
} from "react-router-dom";

import {
  toast
} from "react-toastify";

import AuthLayout from "../layouts/AuthLayout";

import "../App.css";

function ForgotPassword() {

  const [step, setStep] =
    useState(1);

  const [username, setUsername] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const navigate =
    useNavigate();

  // SEND OTP

  const handleSendOtp =
    async () => {

    if (!username.trim()) {

      toast.error(
        "Username is required ❌"
      );

      return;
    }

    try {

      await API.post(
        "/auth/send-otp",
        { username }
      );

      toast.success(
        "OTP Sent Successfully ✅"
      );

      setStep(2);

    } catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        err.response?.data?.error ||

        "Failed To Send OTP ❌"
      );
    }
  };

  // VERIFY OTP

  const handleVerifyOtp =
  async () => {

  if (!otp.trim()) {

    toast.error(
      "OTP is required ❌"
    );

    return;
  }

  if (
    !/^[0-9]{4,6}$/.test(otp)
  ) {

    toast.error(
      "Invalid OTP Format ❌"
    );

    return;
  }

  try {

    await API.post(
      "/auth/verify-otp",
      {
        username,
        otp
      }
    );

    toast.success(
      "OTP Verified ✅"
    );

    setStep(3);

  } catch (err) {

    console.log(err);

    toast.error(

      err.response?.data?.message ||

      err.response?.data?.error ||

      "Invalid OTP ❌"
    );
  }
};

  // RESET PASSWORD

  const handleResetPassword =
  async () => {

  if (!newPassword.trim()) {

    toast.error(
      "Password required ❌"
    );

    return;
  }

  if (newPassword.length < 6) {

    toast.error(
      "Minimum 6 characters ❌"
    );

    return;
  }

  if (
    !/[A-Z]/.test(newPassword)
  ) {

    toast.error(
      "Password must contain uppercase letter ❌"
    );

    return;
  }

  if (
    !/[0-9]/.test(newPassword)
  ) {

    toast.error(
      "Password must contain number ❌"
    );

    return;
  }

  try {

    await API.put(
      "/auth/reset-password",
      {
        username,
        otp,
        newPassword
      }
    );

    toast.success(
      "Password Reset Successful ✅"
    );

    setTimeout(() => {

      navigate("/login");

    }, 1500);

  } catch (err) {

    console.log(err);

    toast.error(

      err.response?.data?.message ||

      err.response?.data?.error ||

      "Password Reset Failed ❌"
    );
  }
};

  return (

    <AuthLayout
      title="Forgot Password 🔐"
      subtitle="Recover your account securely"
    >

      {/* STEP 1 */}

      {step === 1 && (

        <div className="modern-form">

          <input
            className="field"
            placeholder="Enter Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <button
            className="register-btn"
            onClick={handleSendOtp}
          >

            Send OTP

          </button>

        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && (

        <div className="modern-form">

          <input
            className="field"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

          <button
            className="register-btn"
            onClick={handleVerifyOtp}
          >

            Verify OTP

          </button>

        </div>
      )}

      {/* STEP 3 */}

      {step === 3 && (

        <div className="modern-form">

          <input
            className="field"
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
          />

          <button
            className="register-btn"
            onClick={
              handleResetPassword
            }
          >

            Reset Password

          </button>

        </div>
      )}

      {/* LOGIN */}

      <p className="switch-text">

        Back to

        <span
          onClick={() =>
            navigate("/login")
          }
        >

          Login

        </span>

      </p>

    </AuthLayout>
  );
}

export default ForgotPassword;