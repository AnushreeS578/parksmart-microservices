import React, {
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import API from "../services/api";

import {
  toast
} from "react-toastify";

import MainLayout from "../layouts/MainLayout";

import "../App.css";

function Booking() {

  const {
    state
  } = useLocation();

  const navigate =
    useNavigate();

  const [slotNumber,
    setSlotNumber] =
    useState("");

  const [startTime,
    setStartTime] =
    useState("");

  const [endTime,
    setEndTime] =
    useState("");

  // BOOKING

  const handleBooking =
  async () => {

  // VALIDATION

  if (!slotNumber) {

    toast.warning(
      "Slot Number is required ❌"
    );

    return;
  }

  if (
    Number(slotNumber) <= 0
  ) {

    toast.warning(
      "Invalid Slot Number ❌"
    );

    return;
  }

  if (!startTime) {

    toast.warning(
      "Start Time required ❌"
    );

    return;
  }

  if (!endTime) {

    toast.warning(
      "End Time required ❌"
    );

    return;
  }

  const currentTime =
    new Date();

  const start =
    new Date(startTime);

  const end =
    new Date(endTime);

  if (start < currentTime) {

    toast.warning(
      "Start time cannot be past ❌"
    );

    return;
  }

  if (end <= start) {

    toast.warning(
      "End time must be after start time ❌"
    );

    return;
  }

  try {

    const userId =
      Number(
        localStorage.getItem(
          "userId"
        )
      );

    const res =
      await API.post(
        "/booking",
        {

          userId,

          parkingId:
            state.id,

          slotNumber:
            Number(
              slotNumber
            ),

          startTime:
            startTime +
            ":00",

          endTime:
            endTime +
            ":00"
        }
      );

    

    // UPDATE DASHBOARD

    window.dispatchEvent(
      new Event(
        "notificationUpdated"
      )
    );

    localStorage.setItem(
      "latestBooking",

      JSON.stringify(
        res.data
      )
    );

    toast.success(
      "Booking Successful ✅"
    );

    setTimeout(() => {

      navigate(
        "/booking-confirm"
      );

    }, 1200);

  } catch (err) {

    console.log(err);

    toast.error(

      err.response?.data?.message ||

      "Booking Failed ❌"
    );
  }
};

  return (

    <MainLayout>

      <h1 className="page-title">
        Book Parking Slot
      </h1>

      <div className="form-card">

        <div className="parking-card">

          <p>
            <b>Location:</b>
            {" "}
            {state?.location}
          </p>

          <p>
            <b>Price Per Hour:</b>
            {" "}
            ₹
            {state?.pricePerHour}
          </p>

          <p>
            <b>Available Slots:</b>
            {" "}
            {state?.availableSlots}
          </p>

        </div>

        <input
          className="field"
          type="number"
          placeholder="Slot Number"
          value={slotNumber}
          onChange={(e) =>
            setSlotNumber(
              e.target.value
            )
          }
        />

        <input
          className="field"
          type="datetime-local"
          value={startTime}
          onChange={(e) =>
            setStartTime(
              e.target.value
            )
          }
        />

        <input
          className="field"
          type="datetime-local"
          value={endTime}
          onChange={(e) =>
            setEndTime(
              e.target.value
            )
          }
        />

        <button
          className="register-btn"
          onClick={handleBooking}
        >
          Confirm Booking
        </button>

      </div>

    </MainLayout>
  );
}

export default Booking;