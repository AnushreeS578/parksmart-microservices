import React from "react";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Bookings from "../pages/Bookings";

import API from "../services/api";

import {
  BrowserRouter
} from "react-router-dom";

import { toast } from "react-toastify";

// ==============================
// MOCK NAVIGATE
// ==============================

const mockedNavigate =
  jest.fn();

jest.mock(
  "react-router-dom",

  () => ({

    ...jest.requireActual(
      "react-router-dom"
    ),

    useNavigate: () =>
      mockedNavigate
  })
);

// ==============================
// MOCK API
// ==============================

jest.mock(
  "../services/api"
);

// ==============================
// MOCK TOAST
// ==============================

jest.mock(
  "react-toastify",

  () => ({

    toast: {

      error: jest.fn()
    }
  })
);

// ==============================
// MOCK LAYOUT
// ==============================

jest.mock(
  "../layouts/MainLayout",

  () => ({
    children
  }) => <div>{children}</div>
);

describe(
  "Bookings Component",

  () => {

    beforeEach(() => {

      jest.clearAllMocks();
    });

    // ==============================
    // RENDER BOOKINGS
    // ==============================

    test(
      "renders bookings page",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockResolvedValue({

          data: [

            {
              id: 1,
              userId: 10,
              parkingId: 5,
              slotNumber: 2,
              status: "BOOKED",
              bookingTime: "10AM",
              startTime: "11AM",
              endTime: "1PM"
            }
          ]
        });

        render(

          <BrowserRouter>

            <Bookings />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /all bookings/i
            )

          ).toBeInTheDocument();
        });
      }
    );

    // ==============================
    // SHOW BOOKING DETAILS
    // ==============================

    test(
      "shows booking details",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockResolvedValue({

          data: [

            {
              id: 1,
              userId: 10,
              parkingId: 5,
              slotNumber: 2,
              status: "BOOKED",
              bookingTime: "10AM",
              startTime: "11AM",
              endTime: "1PM"
            }
          ]
        });

        render(

          <BrowserRouter>

            <Bookings />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /booking #1/i
            )

          ).toBeInTheDocument();
        });

        expect(

          screen.getByText(
            /booked/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // EMPTY BOOKINGS
    // ==============================

    test(
      "shows empty bookings",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockResolvedValue({

          data: []
        });

        render(

          <BrowserRouter>

            <Bookings />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /no bookings found/i
            )

          ).toBeInTheDocument();
        });
      }
    );

    // ==============================
    // FETCH FAILURE
    // ==============================

    test(
      "shows fetch failure",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockRejectedValue(
          {}
        );

        render(

          <BrowserRouter>

            <Bookings />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            toast.error

          ).toHaveBeenCalledWith(
            "Failed to load bookings ❌"
          );
        });
      }
    );

    // ==============================
    // SECURITY REDIRECT
    // ==============================

    test(
      "redirects non admin",

      async () => {

        localStorage.setItem(
          "role",
          "USER"
        );

        API.get.mockResolvedValue({

          data: []
        });

        render(

          <BrowserRouter>

            <Bookings />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(
            mockedNavigate
          ).toHaveBeenCalledWith(
            "/dashboard"
          );
        });
      }
    );
  }
);