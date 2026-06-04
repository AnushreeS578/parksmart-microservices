import React, {
  useState
} from "react";

import API from "../services/api";

import {
  useNavigate
} from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function Register() {

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [role,
    setRole] =
    useState("USER");

  const [loading,
    setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  // VALIDATION

  const validate =
    () => {

    if (!username.trim()) {

      toast.warning(
        "Username is required ❌"
      );

      return false;
    }

    if (username.length < 3) {

      toast.warning(
        "Username must be at least 3 characters ❌"
      );

      return false;
    }

    if (
      !/^[A-Za-z0-9_]+$/.test(username)
    ) {

      toast.warning(
        "Username can contain only letters, numbers and underscore ❌"
      );

      return false;
    }

    if (!password.trim()) {

      toast.warning(
        "Password is required ❌"
      );

      return false;
    }

    if (password.length < 6) {

      toast.warning(
        "Password must be at least 6 characters ❌"
      );

      return false;
    }

    if (
      !/[A-Z]/.test(password)
    ) {

      toast.warning(
        "Password must contain uppercase letter ❌"
      );

      return false;
    }

    if (
      !/[0-9]/.test(password)
    ) {

      toast.warning(
        "Password must contain number ❌"
      );

      return false;
    }

    if (!role) {

      toast.warning(
        "Please select role ❌"
      );

      return false;
    }

    return true;
  };

  // REGISTER FUNCTION

  const handleRegister =
    async () => {

    if (!validate()) return;

    if (loading) return;

    setLoading(true);

    try {

      await API.post(
        "/auth/register",
        {
          username,
          password,
          role
        }
      );

      toast.success(
        "Registration Success ✅"
      );

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (err) {

      console.log(err);

      const errorMsg =

        err.response?.data?.message ||

        err.response?.data ||

        "Registration Failed ❌";

      toast.error(
        errorMsg
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <AuthLayout
      title="Create Account 🚀"
      subtitle="Register new ParkSmart account"
    >

      {/* USERNAME */}

      <input
        className="field form-control"
        placeholder="Enter Username"
        value={username}
        onChange={(e) =>
          setUsername(
            e.target.value
          )
        }
      />

      {/* PASSWORD */}

      <input
        className="field form-control"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      {/* ROLE */}

      <select
        className="field form-select"
        value={role}
        onChange={(e) =>
          setRole(
            e.target.value
          )
        }
      >

        <option value="USER">
          User
        </option>

        <option value="ADMIN">
          Admin
        </option>

      </select>

      {/* BUTTON */}

      <button
        className="register-btn btn"
        onClick={handleRegister}
        disabled={loading}
      >

        {
          loading

            ? "Creating Account..."

            : "Create Account"
        }

      </button>

      {/* LOGIN */}

      <p className="switch-text">

        Already have account?

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

export default Register;