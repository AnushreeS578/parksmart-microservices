import React, { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../services/api";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function BookingConfirm() {

  const navigate =
    useNavigate();

  const [message,
    setMessage] =
    useState("");

  const booking =
    JSON.parse(
      localStorage.getItem(
        "latestBooking"
      )
    );

  // SAFETY

  if (!booking) {

    return (

      <MainLayout>

        <div className="empty-box">

          <h2>
            No booking found ❌
          </h2>

          <button
            className="register-btn"
            onClick={() =>
              navigate("/parking")
            }
          >
            Go Back
          </button>

        </div>

      </MainLayout>
    );
  }

  // CANCEL BOOKING

  const handleCancel =
  async () => {

  try {

    await API.delete(
      `/booking/${booking.id}`
    );

    booking.status =
      "CANCELLED";

    localStorage.setItem(
      "latestBooking",

      JSON.stringify(
        booking
      )
    );

    // NOTIFICATION

    const oldNotifications =
      JSON.parse(
        localStorage.getItem(
          "notifications"
        )
      ) || [];

    oldNotifications.unshift({

      id: Date.now(),

      text:
        `Booking Cancelled for Slot ${booking.slotNumber}`,

      time:
        new Date()
          .toLocaleString(),

      status:
        "UNREAD"
    });

    localStorage.setItem(
      "notifications",

      JSON.stringify(
        oldNotifications
      )
    );

    // UPDATE DASHBOARD

    window.dispatchEvent(
      new Event(
        "notificationUpdated"
      )
    );

    toast.success(
      "Booking Cancelled ✅"
    );

    setMessage(
      "Booking Cancelled ✅"
    );

    setTimeout(() => {

      localStorage.removeItem(
        "latestBooking"
      );

      navigate("/parking");

    }, 1500);

  } catch (err) {

    console.log(err);

    const errorMessage =

      err.response?.data?.error ||

      err.response?.data?.message ||

      "Cancel Failed ❌";

    toast.error(
      errorMessage
    );

    setMessage(
      errorMessage
    );
  }
};

  return (

    <MainLayout>

      <h1 className="page-title">
        Booking Confirmation
      </h1>

      {message && (

        <p className="message">
          {message}
        </p>

      )}

      <div className="booking-confirm-card">

        <div className="booking-info">

          <p style={{ color: "white" }}>
  <strong style={{ color: "white" }}>
    Booking ID:
  </strong>{" "}
  {booking.id}
</p> 

          <p style={{ color: "white" }}>
  <strong style={{ color: "white" }}>
    Slot Number:
  </strong>{" "}
  {booking.slotNumber}
</p>

<p style={{ color: "white" }}>
  <strong style={{ color: "white" }}>
    Status:
  </strong>{" "}
  {booking.status}
</p>

<p style={{ color: "white" }}>
  <strong style={{ color: "white" }}>
    Amount:
  </strong>{" "}
  ₹{booking.amount}
</p>

<p style={{ color: "white" }}>
  <strong style={{ color: "white" }}>
    Start Time:
  </strong>{" "}
  {booking.startTime}
</p>

<p style={{ color: "white" }}>
  <strong style={{ color: "white" }}>
    End Time:
  </strong>{" "}
  {booking.endTime}
</p>

        </div>

        <div className="booking-actions">

          {booking.status !==
            "CANCELLED" && (

            <>
              <button
                className="delete-btn"
                onClick={handleCancel}
              >
                Cancel Booking
              </button>

              <button
                className="register-btn"
                onClick={() =>
                  navigate("/payment")
                }
              >
                Continue Payment
              </button>
            </>
          )}

        </div>

      </div>

    </MainLayout>
  );
}

export default BookingConfirm;