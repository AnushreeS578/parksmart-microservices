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

function Payments() {

  const [data,
    setData] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

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

  // FETCH

  useEffect(() => {

    fetchPayments();

  }, []);

  const fetchPayments =
    async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          "/payment"
        );

      // LATEST FIRST

      const sortedPayments =

        res.data.sort(
          (a, b) =>

            new Date(
              b.paymentTime
            ) -

            new Date(
              a.paymentTime
            )
        );

      setData(
        sortedPayments
      );

      setLoading(false);

    } catch (err) {

      console.log(err);

      setLoading(false);

      toast.error(

        err.response?.data?.message ||

        "Failed to load payments ❌"
      );
    }
  };

  return (

    <MainLayout>

      <div className="page-header">

        <div>

          <h1 className="page-title">
            Payment History
          </h1>

          <p className="page-subtitle">
            View all successful transactions
          </p>

        </div>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="empty-box">

          <h3>
            Loading Payments...
          </h3>

        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        data.length === 0 && (

        <div className="empty-box">

          <h3>
            No Payments Found
          </h3>

        </div>
      )}

      {/* PAYMENTS */}

      {!loading &&
        data.length > 0 && (

        <div className="payment-grid">

          {data.map((p) => (

            <div
              className="payment-history-card"
              key={p.id}
            >

              <div className="payment-top">

                <h3>
                  Payment #{p.id}
                </h3>

                <span
                  className={
                    p.status === "SUCCESS"

                    ? "success-badge"

                    : "failed-badge"
                  }
                >

                  {p.status}

                </span>

              </div>

              <div className="payment-body">

                <p>
                  <b>User ID:</b>
                  {" "}
                  {p.userId}
                </p>

                <p>
                  <b>Booking ID:</b>
                  {" "}
                  {p.bookingId}
                </p>

                <p>
                  <b>Amount:</b>
                  {" "}
                  ₹{p.amount}
                </p>

                <p>
                  <b>Method:</b>
                  {" "}
                  {p.paymentMethod}
                </p>

                <p>
                  <b>Time:</b>
                  {" "}
                  {
                    new Date(
                      p.paymentTime
                    ).toLocaleString()
                  }
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </MainLayout>
  );
}

export default Payments;