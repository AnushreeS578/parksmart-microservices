import React, {
  useEffect,
  useState
} from "react";

import API from "../services/api";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function Users() {

  const [users,
    setUsers] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const role =
    localStorage.getItem(
      "role"
    );

  // FETCH USERS

  useEffect(() => {

    if (role === "ADMIN") {

      fetchUsers();

    } else {

      setLoading(false);
    }

  }, [role]);

  const fetchUsers =
    async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          "/users"
        );

      setUsers(
        res.data
      );

      setLoading(false);

    } catch (err) {

      console.log(err);

      setLoading(false);

      toast.error(

        err.response?.data?.message ||

        "Failed to load users ❌"
      );
    }
  };

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

  return (

    <MainLayout>

      <h1 className="page-title">
        Users List
      </h1>

      {/* LOADING */}

      {loading && (

        <div className="empty-box">

          <h3>
            Loading Users...
          </h3>

        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        users.length === 0 && (

        <div className="empty-box">

          <h3>
            No Users Found
          </h3>

        </div>
      )}

      {/* USERS */}

      {!loading &&
        users.length > 0 && (

        <div className="users-grid">

          {users.map((u, index) => (

            <div
              className="user-card"
              key={u.id || index}
            >

              <h3>
                {u.username || "Unknown User"}
              </h3>

              <p>
                <b>Name:</b>
                {" "}
                {u.name || "N/A"}
              </p>

              <p>
                <b>Email:</b>
                {" "}
                {u.email || "N/A"}
              </p>

              <p>
                <b>Phone:</b>
                {" "}
                {u.phone || "N/A"}
              </p>

              <p>
                <b>Role:</b>
                {" "}
                {u.role || "USER"}
              </p>

            </div>
          ))}

        </div>
      )}

    </MainLayout>
  );
}

export default Users;