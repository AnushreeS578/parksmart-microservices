import React, {
  useEffect,
  useState
} from "react";

import API from "../services/api";

import {
  useNavigate
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function Bookings() {

  const [data,
    setData] =
    useState([]);

  const navigate =
    useNavigate();

  const role =
    localStorage.getItem(
      "role"
    );

  // SECURITY

  useEffect(() => {

    if (
      role !== "ADMIN"
    ) {

      navigate(
        "/dashboard"
      );
    }

  }, [role, navigate]);

  // FETCH BOOKINGS

  useEffect(() => {

    fetchBookings();

  }, []);

  const fetchBookings =
    async () => {

    try {

      const res =
        await API.get(
          "/booking"
        );

      setData(
        res.data
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load bookings ❌"
      );
    }
  };

  return (

    <MainLayout>

      <h1 className="page-title">
        All Bookings
      </h1>

      {data.length === 0 ? (

        <div className="empty-box">

          <h3>
            No bookings found
          </h3>

        </div>

      ) : (

        <div className="booking-grid">

          {data.map((b) => (

            <div
              className="booking-card"
              key={b.id}
            >

              <h3>
                Booking #{b.id}
              </h3>

              <p>
                <b>User ID:</b>
                {" "}
                {b.userId}
              </p>

              <p>
                <b>Parking ID:</b>
                {" "}
                {b.parkingId}
              </p>

              <p>
                <b>Slot:</b>
                {" "}
                {b.slotNumber}
              </p>

              <p>
                <b>Status:</b>
                {" "}
                {b.status}
              </p>

              <p>
                <b>Booking Time:</b>
                {" "}
                {b.bookingTime}
              </p>

              <p>
                <b>Start:</b>
                {" "}
                {b.startTime}
              </p>

              <p>
                <b>End:</b>
                {" "}
                {b.endTime}
              </p>

            </div>
          ))}

        </div>
      )}

    </MainLayout>
  );
}

export default Bookings;