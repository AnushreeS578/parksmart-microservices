import React from "react";

function AuthLayout({
  title,
  subtitle,
  children
}) {

  return (

    <div className="auth-container">

      {/* LEFT SIDE */}

      <div className="auth-left">

        <div className="overlay">

          <h1 className="hero-title">

            Park
            <span className="hero-highlight">
              Smart
            </span>

          </h1>

          <p className="hero-text">

            Smart Parking
            Management Platform

          </p>

          <div className="hero-features">

            <div className="feature-box">
              🚗 Easy Slot Booking
            </div>

            <div className="feature-box">
              💳 Secure Payments
            </div>

            <div className="feature-box">
              🔔 Real-time Notifications
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">

        <div className="auth-card">

          <h2>
            {title}
          </h2>

          <p className="auth-subtitle">
            {subtitle}
          </p>

          {children}

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;