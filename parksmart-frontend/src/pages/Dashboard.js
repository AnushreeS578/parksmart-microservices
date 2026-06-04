import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useSelector
} from "react-redux";

import API from "../services/api";

import MainLayout from "../layouts/MainLayout";

import {
  ClipLoader
} from "react-spinners";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

import Swal from "sweetalert2";

import "../App.css";

function Dashboard() {

  const navigate =
    useNavigate();

  // REDUX

  const reduxUser =
    useSelector(
      (state) => state.user
    );

  // USER INFO

  const role =
    reduxUser.role ||
    localStorage.getItem(
      "role"
    );

  const token =
    reduxUser.token ||
    localStorage.getItem(
      "token"
    );

  const userId =
    reduxUser.userId ||
    localStorage.getItem(
      "userId"
    );

  // STATES

  const [loading,
    setLoading] =
    useState(true);

  const [parkingCount,
    setParkingCount] =
    useState(0);

  const [availableCount,
    setAvailableCount] =
    useState(0);

  const [bookingCount,
    setBookingCount] =
    useState(0);

  const [paymentTotal,
    setPaymentTotal] =
    useState(0);

  const [notifications,
    setNotifications] =
    useState([]);

  const [chartData,
    setChartData] =
    useState([]);

  const [recentPayments,
    setRecentPayments] =
    useState([]);

  // COLORS

  const COLORS = [
    "#4facfe",
    "#8b5cf6",
    "#00e5a8"
  ];

  // SECURITY

  useEffect(() => {

    if (!token) {

      navigate("/login");
    }

  }, [token, navigate]);

  // FETCH


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    fetchDashboardData();

    fetchNotifications();
    
    

  }, []);


  useEffect(() => {

  const updateNotifications =
    () => {

      const savedNotifications =

        JSON.parse(
          localStorage.getItem(
            "notifications"
          )
        ) || [];

      setNotifications(
        savedNotifications
      );
    };

  // INITIAL LOAD

  updateNotifications();

  // LIVE UPDATE

  window.addEventListener(
    "notificationUpdated",
    updateNotifications
  );

  return () => {

    window.removeEventListener(
      "notificationUpdated",
      updateNotifications
    );
  };

}, []);

  // PAYMENT REFRESH


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    const refreshDashboard =
      () => {

      fetchDashboardData();

    };

    window.addEventListener(
      "paymentSuccess",
      refreshDashboard
    );

    return () => {

      window.removeEventListener(
        "paymentSuccess",
        refreshDashboard
      );
    };

  }, []);

  // FETCH DATA

  const fetchDashboardData =
    async () => {

    try {

      setLoading(true);

      // PARKING

      const parkingRes =
        await API.get(
          "/parking"
        );

      const parking =
        parkingRes.data;

      setParkingCount(
        parking.length
      );

      // AVAILABLE SLOTS

      const available =
        parking.reduce(
          (sum, p) =>
            sum +
            p.availableSlots,
          0
        );

      setAvailableCount(
        available
      );

      // =====================
      // ADMIN
      // =====================

      if (
        role === "ADMIN"
      ) {

        const bookingRes =
          await API.get(
            "/booking"
          );

        const bookings =
          bookingRes.data;

        setBookingCount(
          bookings.length
        );

        try {

          const paymentRes =
            await API.get(
              "/payment"
            );

          const payments =
            paymentRes.data;

          setRecentPayments(
            payments.slice(-5)
          );

          const revenue =
            payments.reduce(
              (sum, p) =>
                sum +
                Number(p.amount),
              0
            );

          setPaymentTotal(
            revenue
          );

          setChartData([
            {
              name:
                "Parking",
              value:
                parking.length
            },
            {
              name:
                "Bookings",
              value:
                bookings.length
            },
            {
              name:
                "Revenue",
              value:
                revenue
            }
          ]);

        } catch {

          setPaymentTotal(0);
        }
      }

      // =====================
      // USER
      // =====================

      else {

        const bookingRes =
          await API.get(
            "/booking"
          );

        const userBookings =
          bookingRes.data.filter(
            (b) =>
              Number(b.userId) ===
              Number(userId)
          );

        setBookingCount(
          userBookings.length
        );

        try {

          const paymentRes =
            await API.get(
              `/payment/user/${userId}`
            );

          const userPayments =
            paymentRes.data;

          setRecentPayments(
            userPayments.slice(-5)
          );

          const totalSpending =
            userPayments.reduce(
              (sum, p) =>
                sum +
                Number(p.amount),
              0
            );

          setPaymentTotal(
            totalSpending
          );

          setChartData([
            {
              name:
                "Slots",
              value:
                available
            },
            {
              name:
                "Bookings",
              value:
                userBookings.length
            },
            {
              name:
                "Spending",
              value:
                totalSpending
            }
          ]);

        } catch {

          setPaymentTotal(0);
        }
      }

      setLoading(false);

    } catch (err) {

      console.log(err);

      setLoading(false);

      Swal.fire({
        icon: "error",
        title:
          "Dashboard Error",
        text:
          "Failed to load dashboard"
      });
    }
  };

  // NOTIFICATIONS

  const fetchNotifications =
    () => {

    const data =
      JSON.parse(
        localStorage.getItem(
          "notifications"
        )
      ) || [];

    setNotifications(data);
  };

  // LOADER

  if (loading) {

    return (

      <MainLayout>

        <div className="loader-container">

          <ClipLoader
            color="#8b5cf6"
            size={70}
          />

        </div>

      </MainLayout>
    );
  }

  return (

    <MainLayout>

      {/* HEADER */}

      <div className="dashboard-topbar">

  <h1 className="page-title">
    Dashboard
  </h1>

  <div
  className="notification-bell"
  onClick={() =>
    navigate("/notifications")
  }
>

  <div className="bell-icon">

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="currentColor"
      viewBox="0 0 16 16"
    >

      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.104-14.804A1 1 0 0 0 7 2v.09a5.002 5.002 0 0 0-4 4.9v2.5l-.717 1.793A1 1 0 0 0 3.217 13h9.566a1 1 0 0 0 .934-1.217L13 9.49v-2.5a5.002 5.002 0 0 0-4-4.9V2a1 1 0 0 0-.896-.804z"/>

    </svg>

  </div>

 {
  notifications.filter(
    (n) =>
      n.status !== "READ"
  ).length > 0 && (

    <span className="notification-badge">

      {
        notifications.filter(
          (n) =>
            n.status !== "READ"
        ).length
      }

    </span>
  )
}

</div>

</div>

      {/* STATS */}

      <div className="stats-grid">

        {/* ADMIN */}

        {role === "ADMIN" && (

          <>
            <div className="stat-card">

              <h3>
                Total Parking
              </h3>

              <h1>
                {parkingCount}
              </h1>

            </div>

            <div className="stat-card">

              <h3>
                Available Slots
              </h3>

              <h1>
                {availableCount}
              </h1>

            </div>

            <div className="stat-card">

              <h3>
                Total Bookings
              </h3>

              <h1>
                {bookingCount}
              </h1>

            </div>

            <div className="stat-card">

              <h3>
                Revenue
              </h3>

              <h1>
                ₹{paymentTotal}
              </h1>

            </div>
          </>
        )}

        {/* USER */}

        {role === "USER" && (

          <>
            <div className="stat-card">

              <h3>
                Available Slots
              </h3>

              <h1>
                {availableCount}
              </h1>

            </div>

            <div className="stat-card">

              <h3>
                Your Bookings
              </h3>

              <h1>
                {bookingCount}
              </h1>

            </div>

            <div className="stat-card">

              <h3>
                Your Spending
              </h3>

              <h1>
                ₹{paymentTotal}
              </h1>

            </div>
          </>
        )}

      </div>

      {/* CHARTS */}

      <div className="charts-grid">

        {/* BAR */}

        <div className="chart-card">

          <h2>
            Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={220}
          >

            <BarChart
              data={chartData}
            >

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                radius={[10,10,0,0]}
                fill="#8b5cf6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE */}

        <div className="chart-card">

          <h2>
            Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={220}
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                outerRadius={70}
                label
              >

                {chartData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Legend />

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* LINE CHART */}

        <div className="chart-card">

          <h2>
            Trend Analysis
          </h2>

          <ResponsiveContainer
            width="100%"
            height={220}
          >

            <LineChart
              data={chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#00e5a8"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* RECENT PAYMENTS */}

        <div className="chart-card">

          <h2>
            Recent Payments
          </h2>

          {
            recentPayments.length === 0
            ? (

              <p>
                No Payments Yet
              </p>

            ) : (

              recentPayments.map(
                (p) => (

                  <div
                    key={p.id}
                    className="payment-row"
                  >

                    <span>
                      ₹{p.amount}
                    </span>

                    <span>
                      {p.paymentMethod}
                    </span>

                    <span>
                      {p.status}
                    </span>

                  </div>
                )
              )
            )
          }

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;