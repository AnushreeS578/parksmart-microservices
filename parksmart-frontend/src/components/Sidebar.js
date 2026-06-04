import React from "react";

import {
  FaHome,
  FaParking,
  FaUsers,
  FaMoneyBill,
  FaBook,
  FaPlusCircle,
  FaUserCircle,
  FaSignOutAlt,
  FaBell
} from "react-icons/fa";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

function Sidebar() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const role =
    localStorage.getItem(
      "role"
    );

  // LOGOUT

  const logout =
    () => {

      localStorage.clear();

      navigate("/login");
    };

  return (

    <div className="sidebar">

      <div>

        <h2 className="sidebar-logo">

          Park
          <span>
            Smart
          </span>

        </h2>

        <ul className="sidebar-menu">

          {/* DASHBOARD */}

          <li
            className={
              location.pathname === "/dashboard"
                ? "active"
                : ""
            }

            onClick={() =>
              navigate("/dashboard")
            }
          >

            <FaHome />

            <span>
              Dashboard
            </span>

          </li>

          {/* PARKING */}

          <li
            className={
              location.pathname === "/parking"
                ? "active"
                : ""
            }

            onClick={() =>
              navigate("/parking")
            }
          >

            <FaParking />

            <span>
              Parking
            </span>

          </li>

          {/* ADMIN */}

          {role === "ADMIN" && (

            <li
              className={
                location.pathname === "/add-parking"
                  ? "active"
                  : ""
              }

              onClick={() =>
                navigate("/add-parking")
              }
            >

              <FaPlusCircle />

              <span>
                Add Parking
              </span>

            </li>
          )}

          {/* BOOKINGS */}

          <li
            className={
              location.pathname === "/bookings"
                ? "active"
                : ""
            }

            onClick={() =>
              navigate("/bookings")
            }
          >

            <FaBook />

            <span>
              Bookings
            </span>

          </li>

          {/* PAYMENTS */}

          <li
            className={
              location.pathname === "/payments"
                ? "active"
                : ""
            }

            onClick={() =>
              navigate("/payments")
            }
          >

            <FaMoneyBill />

            <span>
              Payments
            </span>

          </li>

          {/* USERS */}

          {role === "ADMIN" && (

            <li
              className={
                location.pathname === "/users"
                  ? "active"
                  : ""
              }

              onClick={() =>
                navigate("/users")
              }
            >

              <FaUsers />

              <span>
                Users
              </span>

            </li>
          )}

          {/* NOTIFICATIONS */}

          <li
            className={
              location.pathname === "/notifications"
                ? "active"
                : ""
            }

            onClick={() =>
              navigate("/notifications")
            }
          >

            <FaBell />

            <span>
              Notifications
            </span>

          </li>

          {/* PROFILE */}

          <li
            className={
              location.pathname === "/profile"
                ? "active"
                : ""
            }

            onClick={() =>
              navigate("/profile")
            }
          >

            <FaUserCircle />

            <span>
              Profile
            </span>

          </li>

        </ul>

      </div>

      {/* LOGOUT */}

      <div
        className="logout-section"
      >

        <li
          className="logout-item"
          onClick={logout}
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

        </li>

      </div>

    </div>
  );
}

export default Sidebar;