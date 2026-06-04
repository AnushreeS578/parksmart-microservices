import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Notification from "../pages/Notification";

import API from "../services/api";

import { toast } from "react-toastify";

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
    error: jest.fn()
  }
}));

// ==============================
// MOCK LAYOUT
// ==============================

jest.mock("../layouts/MainLayout", () => ({
  children
}) => <div>{children}</div>);

describe("Notification Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    localStorage.setItem(
      "userId",
      "1"
    );
  });

  // ==============================
  // EMPTY NOTIFICATIONS
  // ==============================

  test("shows empty notification message", async () => {

    API.get.mockResolvedValue({
      data: []
    });

    render(<Notification />);

    await waitFor(() => {

      expect(
        screen.getByText(
          "No Notifications Yet"
        )
      ).toBeInTheDocument();
    });
  });

  // ==============================
  // FETCH NOTIFICATIONS
  // ==============================

  test("fetches notifications", async () => {

    API.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Payment Success",
          message: "Payment completed",
          status: "UNREAD",
          createdAt: new Date()
        }
      ]
    });

    render(<Notification />);

    await waitFor(() => {

      expect(
        screen.getByText(
          "Payment Success"
        )
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Payment completed"
      )
    ).toBeInTheDocument();
  });

  // ==============================
  // FETCH FAILURE
  // ==============================

  test("shows fetch error", async () => {

    API.get.mockRejectedValue({});

    render(<Notification />);

    await waitFor(() => {

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Failed to load notifications ❌"
      );
    });
  });

  // ==============================
  // MARK AS READ SUCCESS
  // ==============================

  test("marks notification as read", async () => {

    API.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Booking Success",
          message: "Parking booked",
          status: "UNREAD",
          createdAt: new Date()
        }
      ]
    });

    API.put.mockResolvedValue({
      data: {}
    });

    render(<Notification />);

    await waitFor(() => {

      expect(
        screen.getByText(
          "Booking Success"
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByText(
        "Booking Success"
      )
    );

    await waitFor(() => {

      expect(
        toast.success
      ).toHaveBeenCalledWith(
        "Notification Read ✅"
      );
    });
  });

  // ==============================
  // MARK AS READ FAILURE
  // ==============================

  test("shows mark as read failure", async () => {

    API.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Booking Success",
          message: "Parking booked",
          status: "UNREAD",
          createdAt: new Date()
        }
      ]
    });

    API.put.mockRejectedValue({});

    render(<Notification />);

    await waitFor(() => {

      expect(
        screen.getByText(
          "Booking Success"
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByText(
        "Booking Success"
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