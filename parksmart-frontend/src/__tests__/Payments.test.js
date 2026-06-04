import React from "react";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Payments from "../pages/Payments";

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
  "Payments Component",

  () => {

    beforeEach(() => {

      jest.clearAllMocks();
    });

    // ==============================
    // RENDER PAGE
    // ==============================

    test(
      "renders payments page",

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
              bookingId: 5,
              amount: 500,
              paymentMethod: "UPI",
              status: "SUCCESS",
              paymentTime:
                "2026-01-01T10:00:00"
            }
          ]
        });

        render(

          <BrowserRouter>

            <Payments />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /payment history/i
            )

          ).toBeInTheDocument();
        });
      }
    );

    // ==============================
    // SHOW PAYMENT DETAILS
    // ==============================

    test(
      "shows payment details",

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
              bookingId: 5,
              amount: 500,
              paymentMethod: "UPI",
              status: "SUCCESS",
              paymentTime:
                "2026-01-01T10:00:00"
            }
          ]
        });

        render(

          <BrowserRouter>

            <Payments />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /payment #1/i
            )

          ).toBeInTheDocument();
        });

        expect(

          screen.getByText(
            /₹500/i
          )

        ).toBeInTheDocument();

        expect(

          screen.getByText(
            /upi/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // EMPTY PAYMENTS
    // ==============================

    test(
      "shows no payments",

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

            <Payments />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /no payments found/i
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

            <Payments />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            toast.error

          ).toHaveBeenCalledWith(
            "Failed to load payments ❌"
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

            <Payments />

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

    // ==============================
    // FAILED STATUS BADGE
    // ==============================

    test(
      "shows failed badge",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockResolvedValue({

          data: [

            {
              id: 2,
              userId: 11,
              bookingId: 7,
              amount: 300,
              paymentMethod: "CARD",
              status: "FAILED",
              paymentTime:
                "2026-01-01T10:00:00"
            }
          ]
        });

        render(

          <BrowserRouter>

            <Payments />

          </BrowserRouter>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /failed/i
            )

          ).toBeInTheDocument();
        });
      }
    );
  }
);