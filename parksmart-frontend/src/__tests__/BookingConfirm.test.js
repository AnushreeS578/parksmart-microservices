import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import BookingConfirm from "../pages/BookingConfirm";

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

      success: jest.fn(),

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
  "BookingConfirm Component",

  () => {

    beforeEach(() => {

      jest.clearAllMocks();

      localStorage.setItem(

        "latestBooking",

        JSON.stringify({

          id: 1,

          slotNumber: 5,

          status: "BOOKED",

          amount: 200,

          startTime:
            "2026-05-01T10:00",

          endTime:
            "2026-05-01T12:00"
        })
      );
    });

    // ==============================
    // RENDER PAGE
    // ==============================

    test(
      "renders booking confirmation",

      () => {

        render(

          <BrowserRouter>

            <BookingConfirm />

          </BrowserRouter>
        );

        expect(

          screen.getByText(
            /booking confirmation/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // SHOW BOOKING DETAILS
    // ==============================

    test(
      "shows booking details",

      () => {

        render(

          <BrowserRouter>

            <BookingConfirm />

          </BrowserRouter>
        );

        expect(

          screen.getByText(
            /slot number/i
          )

        ).toBeInTheDocument();

        expect(

          screen.getByText(
            /₹200/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // CANCEL SUCCESS
    // ==============================

    test(
      "cancels booking successfully",

      async () => {

        API.delete.mockResolvedValue(
          {}
        );

        render(

          <BrowserRouter>

            <BookingConfirm />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /cancel booking/i
          )
        );

        await waitFor(() => {

          expect(

            toast.success

          ).toHaveBeenCalledWith(
            "Booking Cancelled ✅"
          );
        });
      }
    );

    // ==============================
    // CANCEL FAILURE
    // ==============================

    test(
      "shows cancel failure",

      async () => {

        API.delete.mockRejectedValue(
          {

            response: {

              data: {

                message:
                  "Cancel Failed ❌"
              }
            }
          }
        );

        render(

          <BrowserRouter>

            <BookingConfirm />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /cancel booking/i
          )
        );

        await waitFor(() => {

          expect(

            toast.error

          ).toHaveBeenCalledWith(
            "Cancel Failed ❌"
          );
        });
      }
    );

    // ==============================
    // NO BOOKING
    // ==============================

    test(
      "shows no booking found",

      () => {

        localStorage.removeItem(
          "latestBooking"
        );

        render(

          <BrowserRouter>

            <BookingConfirm />

          </BrowserRouter>
        );

        expect(

          screen.getByText(
            /no booking found/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // PAYMENT BUTTON
    // ==============================

    test(
      "continue payment button exists",

      () => {

        render(

          <BrowserRouter>

            <BookingConfirm />

          </BrowserRouter>
        );

        expect(

          screen.getByText(
            /continue payment/i
          )

        ).toBeInTheDocument();
      }
    );
  }
);