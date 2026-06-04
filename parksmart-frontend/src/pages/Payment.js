import React, {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../services/api";

import MainLayout from "../layouts/MainLayout";

import {
  toast
} from "react-toastify";

import "../App.css";

function Payment() {

  const navigate =
    useNavigate();

  const booking =
    JSON.parse(
      localStorage.getItem(
        "latestBooking"
      )
    );

  const [method,
    setMethod] =
    useState("UPI");

  const [loading,
    setLoading] =
    useState(false);

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

  // VALIDATION

  const validate =
    () => {

    if (!method) {

      toast.error(
        "Select payment method ❌"
      );

      return false;
    }

    return true;
  };

  // PAYMENT

  const handlePayment =
    async () => {

    if (!validate()) return;

    if (loading) return;

    setLoading(true);

    try {

      // CREATE ORDER

      const orderRes =
        await API.post(
          `/payment/create-order/${booking.id}`
        );

      const orderData =
        orderRes.data;

      const options = {

        key:
          orderData.key,

        amount:
          orderData.amount * 100,

        currency:
          orderData.currency,

        name:
          "ParkSmart",

        description:
          "Parking Payment",

        order_id:
          orderData.orderId,

        handler:
          async function (
            response
          ) {

          try {

            // VERIFY PAYMENT

            const verifyRes =
              await API.post(
                "/payment/verify",
                {

                  bookingId:
                    booking.id,

                  razorpayOrderId:
                    response.razorpay_order_id,

                  razorpayPaymentId:
                    response.razorpay_payment_id,

                  razorpaySignature:
                    response.razorpay_signature
                }
              );

            // SAVE PAYMENT

            localStorage.setItem(
              "paymentData",

              JSON.stringify(
                verifyRes.data
              )
            );

            // DASHBOARD REFRESH

            window.dispatchEvent(
              new Event(
                "paymentSuccess"
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
                `Payment Successful for Booking ${booking.id}`,

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

            // LIVE NOTIFICATION UPDATE

            window.dispatchEvent(
              new Event(
                "notificationUpdated"
              )
            );

            toast.success(
              "Payment Successful ✅"
            );

            setTimeout(() => {

              navigate(
                "/payment-success"
              );

            }, 1200);

          } catch (err) {

            console.log(err);

            toast.error(

              err.response?.data?.message ||

              "Verification Failed ❌"
            );

            setLoading(false);
          }
        },

        prefill: {

          name:
            localStorage.getItem(
              "username"
            ) || "ParkSmart User"
        },

        theme: {
          color: "#6366f1"
        },

        modal: {

          ondismiss:
            function () {

            setLoading(false);

            toast.error(
              "Payment Cancelled ❌"
            );
          }
        }
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();

    } catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        "Payment Failed ❌"
      );

      setLoading(false);
    }
  };

  return (

    <MainLayout>

      <div className="payment-page">

        <div className="payment-header">

          <h1 className="page-title">
            Secure Payment 💳
          </h1>

          <p className="page-subtitle">
            Complete your booking payment securely
          </p>

        </div>

        <div className="payment-card">

          <div className="payment-info">

            <div className="payment-row">

              <span>
                Booking ID
              </span>

              <strong>
                #{booking.id}
              </strong>

            </div>

            <div className="payment-row">

              <span>
                Slot Number
              </span>

              <strong>
                {booking.slotNumber}
              </strong>

            </div>

            <div className="payment-row">

              <span>
                Amount
              </span>

              <strong className="amount-text">

                ₹{booking.amount}

              </strong>

            </div>

          </div>

          <div className="payment-method-box">

            <label>
              Payment Method
            </label>

            <select
              className="field"
              value={method}
              onChange={(e) =>
                setMethod(
                  e.target.value
                )
              }
            >

              <option value="UPI">
                UPI
              </option>

              <option value="CARD">
                Card
              </option>

            </select>

          </div>

          <button
            className="register-btn"
            onClick={handlePayment}
            disabled={loading}
          >

            {
              loading

                ? "Processing..."

                : "Pay Now"
            }

          </button>

        </div>

      </div>

    </MainLayout>
  );
}

export default Payment;