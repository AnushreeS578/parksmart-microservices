import React, {
  useEffect,
  useState
} from "react";

import API from "../services/api";

import {
  useNavigate
} from "react-router-dom";

import {
  toast
} from "react-toastify";

import MainLayout from "../layouts/MainLayout";

import "../App.css";

function Profile() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const username =
    localStorage.getItem(
      "username"
    );

  // FETCH USER DATA

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res =
          await API.get(
            `/users/username/${username}`
          );

        setName(
          res.data.name || ""
        );

        setEmail(
          res.data.email || ""
        );

        setPhone(
          res.data.phone || ""
        );

      } catch (err) {

        console.log(err);

        toast.info(
          "Please complete your profile ⚠️"
        );
      }
    };

    fetchUser();

  }, [username]);

  // VALIDATION

  const validate = () => {

    if (!name.trim()) {

      toast.warning(
        "Name is required ❌"
      );

      return false;
    }

    if (name.length < 3) {

      toast.warning(
        "Name must be at least 3 characters ❌"
      );

      return false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {

      toast.warning(
        "Name must contain only letters ❌"
      );

      return false;
    }

    if (!email.trim()) {

      toast.warning(
        "Email is required ❌"
      );

      return false;
    }

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {

      toast.warning(
        "Invalid email format ❌"
      );

      return false;
    }

    if (!phone.trim()) {

      toast.warning(
        "Phone number is required ❌"
      );

      return false;
    }

    if (
      !/^[0-9]{10}$/.test(phone)
    ) {

      toast.warning(
        "Phone must be 10 digits ❌"
      );

      return false;
    }

    return true;
  };

  // UPDATE PROFILE

  const handleSave = async () => {

    if (!validate()) return;

    if (loading) return;

    setLoading(true);

    try {

      // OLD USER

      const oldUser =
        await API.get(
          `/users/username/${username}`
        );

      const payload = {

        username:
          oldUser.data.username,

        password:
          oldUser.data.password,

        role:
          oldUser.data.role,

        name,
        email,
        phone
      };

      await API.put(
        `/users/${username}`,
        payload
      );

      toast.success(
        "Profile Updated Successfully ✅"
      );

      setTimeout(() => {

        navigate("/dashboard");

      }, 1500);

    } catch (err) {

      console.log(
        err.response?.data
      );

      toast.error(

        err.response?.data?.message ||

        "Update Failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <MainLayout>

      <div className="profile-wrapper">

        <div className="profile-card">

          <h1 className="page-title">
            Complete Your Profile
          </h1>

          <p className="profile-subtitle">
            Update your personal details
          </p>

          {/* NAME */}

          <input
            className="field form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* EMAIL */}

          <input
            className="field form-control"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* PHONE */}

          <input
            className="field form-control"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          {/* BUTTON */}

          <button
            className="register-btn btn"
            onClick={handleSave}
            disabled={loading}
          >

            {
              loading

                ? "Updating..."

                : "Update Profile"
            }

          </button>

        </div>

      </div>

    </MainLayout>
  );
}

export default Profile;