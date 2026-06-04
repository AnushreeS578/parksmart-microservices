import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Payment from "../pages/Payment";

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
  "Payment Component",

  () => {

    beforeEach(() => {

      jest.clearAllMocks();

      localStorage.setItem(

        "latestBooking",

        JSON.stringify({

          id: 1,

          slotNumber: 5,

          amount: 200
        })
      );

      localStorage.setItem(
        "username",
        "anu"
      );

      window.Razorpay =
        jest.fn(() => ({

          open: jest.fn()
        }));
    });

    // ==============================
    // RENDER PAGE
    // ==============================

    test(
      "renders payment page",

      () => {

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        expect(

          screen.getByText(
            /secure payment/i
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

            <Payment />

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
    // CREATE PAYMENT ORDER
    // ==============================

    test(
      "creates payment order",

      async () => {

        API.post.mockResolvedValueOnce({

          data: {

            key: "rzp_test",

            amount: 200,

            currency: "INR",

            orderId: "order123"
          }
        });

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /pay now/i
          )
        );

        await waitFor(() => {

          expect(

            API.post

          ).toHaveBeenCalled();
        });
      }
    );

    // ==============================
    // PAYMENT FAILURE
    // ==============================

    test(
      "shows payment failure",

      async () => {

        API.post.mockRejectedValue(
          {}
        );

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /pay now/i
          )
        );

        await waitFor(() => {

          expect(

            toast.error

          ).toHaveBeenCalledWith(
            "Payment Failed ❌"
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

            <Payment />

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
    // CHANGE PAYMENT METHOD
    // ==============================

    test(
      "changes payment method",

      () => {

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        const select =
          screen.getByRole(
            "combobox"
          );

        fireEvent.change(
          select,

          {
            target: {
              value: "CARD"
            }
          }
        );

        expect(
          select.value
        ).toBe("CARD");
      }
    );

    // ==============================
    // VERIFY RAZORPAY OPEN
    // ==============================

    test(
      "opens razorpay payment",

      async () => {

        const openMock =
          jest.fn();

        window.Razorpay =
          jest.fn(() => ({

            open: openMock
          }));

        API.post.mockResolvedValueOnce({

          data: {

            key: "rzp_test",

            amount: 200,

            currency: "INR",

            orderId: "order123"
          }
        });

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /pay now/i
          )
        );

        await waitFor(() => {

          expect(

            window.Razorpay

          ).toHaveBeenCalled();
        });
      }
    );

    // ==============================
    // VERIFY PAYMENT SUCCESS
    // ==============================

    test(
      "verifies payment successfully",

      async () => {

        jest.useFakeTimers();

        let razorpayOptions;

        window.Razorpay =
          jest.fn((options) => {

            razorpayOptions =
              options;

            return {
              open: jest.fn()
            };
          });

        API.post

          .mockResolvedValueOnce({

            data: {

              key: "rzp_test",

              amount: 200,

              currency: "INR",

              orderId: "order123"
            }
          })

          .mockResolvedValueOnce({

            data: {

              paymentId: 1
            }
          });

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /pay now/i
          )
        );

        await waitFor(() => {

          expect(

            window.Razorpay

          ).toHaveBeenCalled();
        });

        await razorpayOptions.handler({

          razorpay_order_id:
            "order123",

          razorpay_payment_id:
            "payment123",

          razorpay_signature:
            "signature123"
        });

        expect(

          toast.success

        ).toHaveBeenCalledWith(
          "Payment Successful ✅"
        );

        jest.runAllTimers();
      }
    );

    // ==============================
    // VERIFY FAILURE
    // ==============================

    test(
      "shows verification failure",

      async () => {

        let razorpayOptions;

        window.Razorpay =
          jest.fn((options) => {

            razorpayOptions =
              options;

            return {
              open: jest.fn()
            };
          });

        API.post

          .mockResolvedValueOnce({

            data: {

              key: "rzp_test",

              amount: 200,

              currency: "INR",

              orderId: "order123"
            }
          })

          .mockRejectedValueOnce({});

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /pay now/i
          )
        );

        await waitFor(() => {

          expect(

            window.Razorpay

          ).toHaveBeenCalled();
        });

        await razorpayOptions.handler({

          razorpay_order_id:
            "order123",

          razorpay_payment_id:
            "payment123",

          razorpay_signature:
            "signature123"
        });

        expect(

          toast.error

        ).toHaveBeenCalledWith(
          "Verification Failed ❌"
        );
      }
    );

    // ==============================
    // PAYMENT CANCELLED
    // ==============================

    test(
      "handles payment cancel",

      async () => {

        let razorpayOptions;

        window.Razorpay =
          jest.fn((options) => {

            razorpayOptions =
              options;

            return {
              open: jest.fn()
            };
          });

        API.post.mockResolvedValueOnce({

          data: {

            key: "rzp_test",

            amount: 200,

            currency: "INR",

            orderId: "order123"
          }
        });

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /pay now/i
          )
        );

        await waitFor(() => {

          expect(

            window.Razorpay

          ).toHaveBeenCalled();
        });

        razorpayOptions.modal
          .ondismiss();

        expect(

          toast.error

        ).toHaveBeenCalledWith(
          "Payment Cancelled ❌"
        );
      }
    );

    // ==============================
    // GO BACK BUTTON
    // ==============================

    test(
      "go back button works",

      () => {

        localStorage.removeItem(
          "latestBooking"
        );

        render(

          <BrowserRouter>

            <Payment />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /go back/i
          )
        );

        expect(
          mockedNavigate
        ).toHaveBeenCalled();
      }
    );
  }
);