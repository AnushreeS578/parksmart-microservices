import React, {
  useEffect,
  useState
} from "react";

import API from "../services/api";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../styles/Notification.css";

function Notification() {

  const [notifications,
    setNotifications] =
    useState([]);

  const userId =
    localStorage.getItem(
      "userId"
    );

  // FETCH

  useEffect(() => {

    fetchNotifications();
      // eslint-disable-next-line
  }, []);

  const fetchNotifications =
    async () => {

    try {

      const res =
        await API.get(
          `/notify/user/${userId}`
        );

      setNotifications(
        res.data
      );
      localStorage.setItem(
  "notifications",
  JSON.stringify(
    res.data
  )
);

window.dispatchEvent(
  new Event(
    "notificationUpdated"
  )
);

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load notifications ❌"
      );
    }
  };

  // MARK AS READ

  const markAsRead =
  async (id) => {

  try {

    await API.put(
      `/notify/read/${id}`
    );

    const updatedNotifications =

      notifications
  .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
  .map((n) =>

        n.id === id

          ? {
              ...n,
              status: "READ"
            }

          : n
      );

    setNotifications(
      updatedNotifications
    );

    // SAVE UPDATED DATA

    localStorage.setItem(
      "notifications",
      JSON.stringify(
        updatedNotifications
      )
    );

    // UPDATE SIDEBAR

    window.dispatchEvent(
      new Event(
        "notificationUpdated"
      )
    );

    toast.success(
      "Notification Read ✅"
    );

  } catch (err) {

    console.log(err);

    toast.error(
      "Update Failed ❌"
    );
  }
};
  return (

    <MainLayout>

      <div className="notification-page">

        <div className="notification-header">

          <h1 className="page-title">
            🔔 Notifications
          </h1>

          <p className="notification-subtitle">
            View all booking and payment updates
          </p>

        </div>

        {notifications.length === 0 ? (

          <div className="empty-notification">

            <h3>
              No Notifications Yet
            </h3>

            <p>
              New booking and payment alerts
              will appear here.
            </p>

          </div>

        ) : (

          <div className="notification-grid">

            {notifications.map((n) => (

              <div

                key={n.id}

                className={

                  n.status === "UNREAD"

                    ? "notification-card unread"

                    : "notification-card read"
                }

                onClick={() =>
                  markAsRead(n.id)
                }
              >

                <div className="notification-top">

                  <h3>
                    {n.title}
                  </h3>

                  <span

                    className={

                      n.status === "UNREAD"

                        ? "badge-unread"

                        : "badge-read"
                    }
                  >

                    {n.status}

                  </span>

                </div>

                <p className="notification-message">

                  {n.message}

                </p>

                <small className="notification-time">

                  {
                    new Date(
                      n.createdAt
                    ).toLocaleString()
                  }

                </small>

              </div>
            ))}

          </div>
        )}

      </div>

    </MainLayout>
  );
}

export default Notification;