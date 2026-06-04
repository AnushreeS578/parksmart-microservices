import React from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  jsPDF
} from "jspdf";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function PaymentSuccess() {

  const navigate =
    useNavigate();

  const data =
    JSON.parse(
      localStorage.getItem(
        "paymentData"
      )
    );

  // SAFETY

  if (!data) {

    return (

      <MainLayout>

        <div className="empty-box">

          <h2>
            No Payment Data ❌
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

  // FORMAT

  const formattedTime =
    new Date(
      data.paymentTime
    ).toLocaleString();

  // PDF DOWNLOAD

  const downloadReceipt =
    () => {

    try {

      const doc =
        new jsPDF();

      doc.setFontSize(20);

      doc.text(
        "ParkSmart Receipt",
        20,
        20
      );

      doc.setFontSize(12);

      doc.text(
        `Payment ID: ${data.id}`,
        20,
        40
      );

      doc.text(
        `Booking ID: ${data.bookingId}`,
        20,
        50
      );

      doc.text(
        `User ID: ${data.userId}`,
        20,
        60
      );

      doc.text(
        `Amount: ₹${data.amount}`,
        20,
        70
      );

      doc.text(
        `Method: ${data.paymentMethod}`,
        20,
        80
      );

      doc.text(
        `Status: ${data.status}`,
        20,
        90
      );

      doc.text(
        `Time: ${formattedTime}`,
        20,
        100
      );

      doc.save(
        `receipt_${data.id}.pdf`
      );

      toast.success(
        "Receipt Downloaded ✅"
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Receipt Download Failed ❌"
      );
    }
  };

  // LOGOUT

  const handleLogout =
    () => {

    localStorage.clear();

    navigate("/login");
  };

  // BACK TO PARKING

  const handleBack =
    () => {

    localStorage.removeItem(
      "paymentData"
    );

    navigate("/parking");
  };

  return (

    <MainLayout>

      <div className="success-page">

        <div className="success-card">

          <div className="success-icon">

            ✅

          </div>

          <h1>
            Payment Successful
          </h1>

          <p>
            Your parking slot has been booked successfully.
          </p>

          <div className="success-details">

            <div className="success-row">

              <span>
                Payment ID
              </span>

              <strong>
                #{data.id}
              </strong>

            </div>

            <div className="success-row">

              <span>
                Booking ID
              </span>

              <strong>
                {data.bookingId}
              </strong>

            </div>

            <div className="success-row">

              <span>
                Amount
              </span>

              <strong className="amount-text">

                ₹{data.amount}

              </strong>

            </div>

            <div className="success-row">

              <span>
                Method
              </span>

              <strong>
                {data.paymentMethod}
              </strong>

            </div>

            <div className="success-row">

              <span>
                Status
              </span>

              <strong>
                {data.status}
              </strong>

            </div>

            <div className="success-row">

              <span>
                Time
              </span>

              <strong>
                {formattedTime}
              </strong>

            </div>

          </div>

          <div className="success-actions">

            <button
              className="register-btn"
              onClick={downloadReceipt}
            >

              Download Receipt

            </button>

            <button
              className="secondary-btn"
              onClick={handleBack}
            >

              Back To Parking

            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >

              Logout

            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default PaymentSuccess;