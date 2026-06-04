import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import AddParking from "../pages/AddParking";

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
    error: jest.fn(),
    warning: jest.fn()
  }
}));

// ==============================
// MOCK LAYOUT
// ==============================

jest.mock("../layouts/MainLayout", () => ({
  children
}) => <div>{children}</div>);

describe("AddParking Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    localStorage.setItem(
      "role",
      "ADMIN"
    );
  });

  // ==============================
  // RENDER
  // ==============================

  test("renders form", () => {

    render(<AddParking />);

    expect(
      screen.getByPlaceholderText(
        "Location"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Total Slots"
      )
    ).toBeInTheDocument();
  });

  // ==============================
  // ACCESS DENIED
  // ==============================

  test("shows access denied", () => {

    localStorage.setItem(
      "role",
      "USER"
    );

    render(<AddParking />);

    expect(
      screen.getByText(
        "Access Denied ❌"
      )
    ).toBeInTheDocument();
  });

  // ==============================
  // EMPTY LOCATION
  // ==============================

  test("validates location", () => {

    render(<AddParking />);

    fireEvent.click(
      screen.getAllByText(
        "Add Parking"
      )[1]
    );

    expect(
      toast.warning
    ).toHaveBeenCalledWith(
      "Location is required"
    );
  });

  // ==============================
  // EMPTY TOTAL SLOTS
  // ==============================

  test("validates total slots", () => {

    render(<AddParking />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Location"
      ),
      {
        target: {
          value: "Bangalore"
        }
      }
    );

    fireEvent.click(
      screen.getAllByText(
        "Add Parking"
      )[1]
    );

    expect(
      toast.warning
    ).toHaveBeenCalledWith(
      "Total slots required"
    );
  });

  // ==============================
  // INVALID TOTAL SLOTS
  // ==============================

  test("validates invalid slots", () => {

    render(<AddParking />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Location"
      ),
      {
        target: {
          value: "Bangalore"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Total Slots"
      ),
      {
        target: {
          value: "-1"
        }
      }
    );

    fireEvent.click(
      screen.getAllByText(
        "Add Parking"
      )[1]
    );

    expect(
      toast.warning
    ).toHaveBeenCalledWith(
      "Total slots must be greater than 0"
    );
  });

  // ==============================
  // EMPTY PRICE
  // ==============================

  test("validates empty price", () => {

    render(<AddParking />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Location"
      ),
      {
        target: {
          value: "Bangalore"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Total Slots"
      ),
      {
        target: {
          value: "10"
        }
      }
    );

    fireEvent.click(
      screen.getAllByText(
        "Add Parking"
      )[1]
    );

    expect(
      toast.warning
    ).toHaveBeenCalledWith(
      "Price is required"
    );
  });

  // ==============================
  // INVALID PRICE
  // ==============================

  test("validates invalid price", () => {

    render(<AddParking />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Location"
      ),
      {
        target: {
          value: "Bangalore"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Total Slots"
      ),
      {
        target: {
          value: "10"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Price Per Hour"
      ),
      {
        target: {
          value: "-5"
        }
      }
    );

    fireEvent.click(
      screen.getAllByText(
        "Add Parking"
      )[1]
    );

    expect(
      toast.warning
    ).toHaveBeenCalledWith(
      "Price must be greater than 0"
    );
  });

  // ==============================
  // SUCCESS
  // ==============================

  test("adds parking successfully", async () => {

    API.post.mockResolvedValue({
      data: {}
    });

    render(<AddParking />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Location"
      ),
      {
        target: {
          value: "Bangalore"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Total Slots"
      ),
      {
        target: {
          value: "50"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Price Per Hour"
      ),
      {
        target: {
          value: "20"
        }
      }
    );

    fireEvent.click(
      screen.getAllByText(
        "Add Parking"
      )[1]
    );

    await waitFor(() => {

      expect(
        toast.success
      ).toHaveBeenCalledWith(
        "Parking Added Successfully ✅"
      );
    });
  });

  // ==============================
  // API FAILURE
  // ==============================

  test("shows api failure", async () => {

    API.post.mockRejectedValue({
      response: {
        data: {
          message: "Failed ❌"
        }
      }
    });

    render(<AddParking />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Location"
      ),
      {
        target: {
          value: "Bangalore"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Total Slots"
      ),
      {
        target: {
          value: "50"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Price Per Hour"
      ),
      {
        target: {
          value: "20"
        }
      }
    );

    fireEvent.click(
      screen.getAllByText(
        "Add Parking"
      )[1]
    );

    await waitFor(() => {

      expect(
        toast.error
      ).toHaveBeenCalled();
    });
  });

});