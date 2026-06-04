import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Profile from "../pages/Profile";

import API from "../services/api";

import { BrowserRouter } from "react-router-dom";

import { toast } from "react-toastify";

// ==============================
// MOCK NAVIGATE
// ==============================

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockedNavigate
}));

// ==============================
// MOCK API
// ==============================

jest.mock("../services/api");

// ==============================
// MOCK TOAST
// ==============================

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  }
}));

// ==============================
// MOCK LAYOUT
// ==============================

jest.mock("../layouts/MainLayout", () => ({
  children
}) => <div>{children}</div>);

describe("Profile Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    localStorage.setItem(
      "username",
      "admin"
    );
  });

  // ==============================
  // RENDER TEST
  // ==============================

  test("renders profile form", async () => {

    API.get.mockResolvedValue({
      data: {
        name: "",
        email: "",
        phone: ""
      }
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText(
        "Full Name"
      )
    ).toBeInTheDocument();
  });

  // ==============================
  // FETCH USER SUCCESS
  // ==============================

  test("fetches user data", async () => {

    API.get.mockResolvedValue({
      data: {
        name: "John",
        email: "john@gmail.com",
        phone: "9999999999"
      }
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {

      expect(
        screen.getByDisplayValue(
          "John"
        )
      ).toBeInTheDocument();
    });
  });

  // ==============================
  // FETCH USER FAILURE
  // ==============================

  test("shows fetch profile warning", async () => {

    API.get.mockRejectedValue({});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {

      expect(
        toast.info
      ).toHaveBeenCalledWith(
        "Please complete your profile ⚠️"
      );
    });
  });

  // ==============================
  // EMPTY NAME
  // ==============================

  test("validates empty name", async () => {

    API.get.mockResolvedValue({
      data: {}
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(
      screen.getByText(
        "Update Profile"
      )
    );

    expect(
  toast.warning
).toHaveBeenCalledWith(
  "Name is required ❌"
);
  });

  // ==============================
  // INVALID EMAIL
  // ==============================

  test("validates invalid email", async () => {

    API.get.mockResolvedValue({
      data: {}
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Full Name"
      ),
      {
        target: {
          value: "John"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Email Address"
      ),
      {
        target: {
          value: "wrongemail"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Phone Number"
      ),
      {
        target: {
          value: "9999999999"
        }
      }
    );

    fireEvent.click(
      screen.getByText(
        "Update Profile"
      )
    );

    expect(
  toast.warning
).toHaveBeenCalledWith(
  "Invalid email format ❌"
);
  });

  // ==============================
  // INVALID PHONE
  // ==============================

  test("validates invalid phone", async () => {

    API.get.mockResolvedValue({
      data: {}
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Full Name"
      ),
      {
        target: {
          value: "John"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Email Address"
      ),
      {
        target: {
          value: "john@gmail.com"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Phone Number"
      ),
      {
        target: {
          value: "123"
        }
      }
    );

    fireEvent.click(
      screen.getByText(
        "Update Profile"
      )
    );

    expect(
  toast.warning
).toHaveBeenCalledWith(
  "Phone must be 10 digits ❌"
);
  });

  // ==============================
  // UPDATE SUCCESS
  // ==============================

  test("updates profile successfully", async () => {

    API.get.mockResolvedValue({
      data: {
        username: "admin",
        password: "1234",
        role: "USER"
      }
    });

    API.put.mockResolvedValue({
      data: {}
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Full Name"
      ),
      {
        target: {
          value: "John"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Email Address"
      ),
      {
        target: {
          value: "john@gmail.com"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Phone Number"
      ),
      {
        target: {
          value: "9999999999"
        }
      }
    );

    fireEvent.click(
      screen.getByText(
        "Update Profile"
      )
    );

    await waitFor(() => {

      expect(
        toast.success
      ).toHaveBeenCalledWith(
        "Profile Updated Successfully ✅"
      );
    });

    await waitFor(

      () => {

        expect(
          mockedNavigate
        ).toHaveBeenCalledWith(
          "/dashboard"
        );

      },

      {
        timeout: 3000
      }
    );
  });

  // ==============================
  // UPDATE FAILURE
  // ==============================

  test("shows update failure", async () => {

    API.get.mockResolvedValue({
      data: {
        username: "admin",
        password: "1234",
        role: "USER"
      }
    });

    API.put.mockRejectedValue({
      response: {
        data: {}
      }
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Full Name"
      ),
      {
        target: {
          value: "John"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Email Address"
      ),
      {
        target: {
          value: "john@gmail.com"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Phone Number"
      ),
      {
        target: {
          value: "9999999999"
        }
      }
    );

    fireEvent.click(
      screen.getByText(
        "Update Profile"
      )
    );

    await waitFor(() => {

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Update Failed ❌"
      );
    });
  });

});