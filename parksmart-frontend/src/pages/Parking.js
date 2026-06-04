import React, {
  useEffect,
  useState
} from "react";

import API from "../services/api";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function Parking() {

  const [list,
    setList] =
    useState([]);

  const [editId,
    setEditId] =
    useState(null);

  const [location,
    setLocation] =
    useState("");

  const [totalSlots,
    setTotalSlots] =
    useState("");

  const [availableSlots,
    setAvailableSlots] =
    useState("");

  const [pricePerHour,
    setPricePerHour] =
    useState("");

  const navigate =
    useNavigate();

  const locationHook =
    useLocation();

  const role =
    localStorage.getItem(
      "role"
    );

  // FETCH PARKING

  useEffect(() => {

    fetchParking();

  }, [locationHook.pathname]);

  const fetchParking =
    async () => {

    try {

      const res =
        await API.get(
          "/parking"
        );

      setList(
        res.data
      );

    } catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        "Failed to load parking ❌"
      );
    }
  };

  // DELETE

  const handleDelete =
    async (id) => {

    try {

      await API.delete(
        `/parking/${id}`
      );

      toast.success(
        "Parking Deleted ✅"
      );

      fetchParking();

    } catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        "Delete Failed ❌"
      );
    }
  };

  // EDIT

  const handleEdit =
    (p) => {

    setEditId(p.id);

    setLocation(
      p.location
    );

    setTotalSlots(
      p.totalSlots
    );

    setAvailableSlots(
      p.availableSlots
    );

    setPricePerHour(
      p.pricePerHour
    );
  };

  // VALIDATION

  const validate =
    () => {

    if (
      !location.trim()
    ) {

      toast.error(
        "Location required ❌"
      );

      return false;
    }

    if (
      !totalSlots ||
      totalSlots <= 0
    ) {

      toast.error(
        "Invalid total slots ❌"
      );

      return false;
    }

    if (
      !availableSlots ||
      availableSlots < 0
    ) {

      toast.error(
        "Invalid available slots ❌"
      );

      return false;
    }

    if (
      Number(
        availableSlots
      ) >
      Number(
        totalSlots
      )
    ) {

      toast.error(
        "Available exceeds total ❌"
      );

      return false;
    }

    if (
      !pricePerHour ||
      pricePerHour <= 0
    ) {

      toast.error(
        "Invalid price ❌"
      );

      return false;
    }

    return true;
  };

  // UPDATE

  const handleUpdate =
    async () => {

    if (
      !validate()
    ) return;

    try {

      await API.put(
        `/parking/${editId}`,
        {
          location,

          totalSlots:
            Number(totalSlots),

          availableSlots:
            Number(availableSlots),

          pricePerHour:
            Number(pricePerHour)
        }
      );

      toast.success(
        "Parking Updated ✅"
      );

      setEditId(null);

      setLocation("");

      setTotalSlots("");

      setAvailableSlots("");

      setPricePerHour("");

      fetchParking();

    } catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        "Update Failed ❌"
      );
    }
  };

  return (

    <MainLayout>

      <div className="page-header">

        <div>

          <h1 className="page-title">
            Parking Locations
          </h1>

          <p className="page-subtitle">
            Manage and explore smart parking slots
          </p>

        </div>

      </div>

      {/* EDIT FORM */}

      {editId && (

        <div className="edit-form-card">

          <h2>
            Edit Parking
          </h2>

          <div className="form-grid">

            <input
              className="field"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
            />

            <input
              className="field"
              type="number"
              placeholder="Total Slots"
              value={totalSlots}
              onChange={(e) =>
                setTotalSlots(
                  e.target.value
                )
              }
            />

            <input
              className="field"
              type="number"
              placeholder="Available Slots"
              value={availableSlots}
              onChange={(e) =>
                setAvailableSlots(
                  e.target.value
                )
              }
            />

            <input
              className="field"
              type="number"
              placeholder="Price Per Hour"
              value={pricePerHour}
              onChange={(e) =>
                setPricePerHour(
                  e.target.value
                )
              }
            />

          </div>

          <button
            className="register-btn"
            onClick={handleUpdate}
          >
            Update Parking
          </button>

        </div>
      )}

      {/* EMPTY */}

      {list.length === 0 && (

        <div className="empty-box">

          <h3>
            No Parking Available
          </h3>

        </div>
      )}

      {/* PARKING LIST */}

      <div className="parking-container">

        {list.map((p) => (

          <div
            key={p.id}
            className="parking-card modern-card"
          >

            <div className="parking-top">

              <h2>
                📍 {p.location}
              </h2>

              <span className="slot-badge">

                {p.availableSlots}
                {" "}Slots Left

              </span>

            </div>

            <div className="parking-details">

              <p>
                <b>Total Slots:</b>
                {" "}
                {p.totalSlots}
              </p>

              <p>
                <b>Available:</b>
                {" "}
                {p.availableSlots}
              </p>

              <p>
                <b>Price:</b>
                {" "}
                ₹{p.pricePerHour}/hr
              </p>

            </div>

            {/* USER */}

            {role === "USER" && (

              <button
                className="register-btn"
                onClick={() =>
                  navigate(
                    "/book",
                    { state: p }
                  )
                }
              >

                Book Slot

              </button>
            )}

            {/* ADMIN */}

            {role === "ADMIN" && (

              <div className="action-buttons">

                <button
                  className="register-btn"
                  onClick={() =>
                    handleEdit(p)
                  }
                >

                  Edit

                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(p.id)
                  }
                >

                  Delete

                </button>

              </div>
            )}

          </div>
        ))}

      </div>

    </MainLayout>
  );
}

export default Parking;