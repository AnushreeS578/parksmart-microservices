import React, { useState } from "react";

import API from "../services/api";

import { useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import "../App.css";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const navigate = useNavigate();

  // LOGIN FUNCTION

  const handleLogin = async () => {

    // VALIDATION

    if (!username.trim()) {

      setMessage(
        "Username is required ❗"
      );

      return;
    }

    if (!password.trim()) {

      setMessage(
        "Password is required ❗"
      );

      return;
    }

    if (password.length < 4) {

      setMessage(
        "Password must be at least 4 characters ❗"
      );

      return;
    }

    try {

      const res = await API.post(
        "/auth/login",
        {
          username,
          password
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        res.data
      );

      // STORE DATA

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "userId",
        res.data.userId
      );

      localStorage.setItem(
        "username",
        res.data.username
      );

      localStorage.setItem(
        "role",
        res.data.role
      );

      setMessage(
        "Login Success ✅"
      );

      // CHECK PROFILE

      setTimeout(async () => {

        try {

          const profileRes =
            await API.get(
              `/users/username/${res.data.username}`
            );

          const user =
            profileRes.data;

          // PROFILE COMPLETE?

          if (
            !user.name ||
            !user.email ||
            !user.phone
          ) {

            navigate("/profile");

          } else {

            navigate("/dashboard");
          }

        } catch {

          // PROFILE NOT FOUND

          navigate("/profile");
        }

      }, 1000);

    } catch (err) {

      setMessage(

        err.response?.data?.message ||

        "Invalid username or password ❌"
      );
    }
  };

  return (

    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue"
    >

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      <input
        className="field"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        className="field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        className="register-btn"
        onClick={handleLogin}
      >
        Login
      </button>

      <p className="switch-text">

        New User?

        <span
          onClick={() =>
            navigate("/register")
          }
        >
          Register
        </span>

      </p>

      <p className="switch-text">

        <span
          onClick={() =>
            navigate("/forgot-password")
          }
        >
          Forgot Password?
        </span>

      </p>

    </AuthLayout>
  );
}

export default Login;