import React, {
  useState
} from "react";

import API from "../services/api";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function AddParking() {

  const role =
    localStorage.getItem("role");

  const [location, setLocation] =
    useState("");

  const [totalSlots, setTotalSlots] =
    useState("");

  const [price, setPrice] =
    useState("");

  // SECURITY

  if (role !== "ADMIN") {

    return (

      <h2 style={{
        color: "white",
        padding: "30px"
      }}>
        Access Denied ❌
      </h2>
    );
  }

  // VALIDATION

  const validate = () => {

    if (!location.trim()) {

      toast.warning(
        "Location is required"
      );

      return false;
    }

    if (!totalSlots) {

      toast.warning(
        "Total slots required"
      );

      return false;
    }

    if (
      Number(totalSlots) <= 0
    ) {

      toast.warning(
        "Total slots must be greater than 0"
      );

      return false;
    }

    if (!price) {

      toast.warning(
        "Price is required"
      );

      return false;
    }

    if (
      Number(price) <= 0
    ) {

      toast.warning(
        "Price must be greater than 0"
      );

      return false;
    }

    return true;
  };

  // ADD PARKING

  const handleAdd = async () => {

    if (!validate()) return;

    try {

      await API.post(
        "/parking",
        {
          location,
          totalSlots:
            Number(totalSlots),

          availableSlots:
            Number(totalSlots),

          pricePerHour:
            Number(price)
        }
      );

      toast.success(
        "Parking Added Successfully ✅"
      );

      // CLEAR

      setLocation("");

      setTotalSlots("");

      setPrice("");

    } catch (err) {

      console.log(err.response);

      toast.error(

        err.response?.data?.message ||

        "Failed ❌"
      );
    }
  };

  return (

    <MainLayout>

      <div className="form-wrapper">

        <div className="form-card">

          <h1 className="page-title">
            Add Parking
          </h1>

          <p className="profile-subtitle">
            Create new parking location
          </p>

          {/* LOCATION */}

          <input
            className="field form-control"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
          />

          {/* TOTAL SLOTS */}

          <input
            className="field form-control"
            type="number"
            placeholder="Total Slots"
            value={totalSlots}
            onChange={(e) =>
              setTotalSlots(
                e.target.value
              )
            }
          />

          {/* AVAILABLE */}

          {totalSlots && (

            <input
              className="field form-control"
              value={`Available Slots: ${totalSlots}`}
              readOnly
            />
          )}

          {/* PRICE */}

          <input
            className="field form-control"
            type="number"
            placeholder="Price Per Hour"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
          />

          {/* BUTTON */}

          <button
            className="register-btn btn"
            onClick={handleAdd}
          >
            Add Parking
          </button>

        </div>

      </div>

    </MainLayout>
  );
}

export default AddParking;