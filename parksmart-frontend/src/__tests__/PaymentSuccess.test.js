import React from "react";

import {
  render,
  screen,
  fireEvent
} from "@testing-library/react";

import "@testing-library/jest-dom";

import PaymentSuccess from "../pages/PaymentSuccess";

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

jest.mock(
  "jspdf",

  () => ({

    jsPDF: jest.fn()
  })
);

// ==============================
// MOCK TOAST
// ==============================

jest.mock(
  "react-toastify",

  () => ({

    toast: {

      success: jest.fn()
    }
  })
);

// ==============================
// MOCK JSPDF
// ==============================

jest.mock(
  "jspdf",

  () => {

    return {

      jsPDF: jest.fn(() => ({

        setFontSize:
          jest.fn(),

        text:
          jest.fn(),

        save:
          jest.fn()
      }))
    };
  }
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
  "PaymentSuccess Component",

  () => {

    beforeEach(() => {

      jest.clearAllMocks();

      localStorage.setItem(

        "paymentData",

        JSON.stringify({

          id: 1,

          bookingId: 10,

          userId: 5,

          amount: 500,

          paymentMethod:
            "UPI",

          status:
            "SUCCESS",

          paymentTime:
            "2026-01-01T10:00:00"
        })
      );
    });

    // ==============================
    // RENDER PAGE
    // ==============================

    test(
      "renders success page",

      () => {

        render(

          <BrowserRouter>

            <PaymentSuccess />

          </BrowserRouter>
        );

        expect(

          screen.getByText(
            /payment successful/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // SHOW PAYMENT DETAILS
    // ==============================

    test(
      "shows payment details",

      () => {

        render(

          <BrowserRouter>

            <PaymentSuccess />

          </BrowserRouter>
        );

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
// DOWNLOAD RECEIPT
// ==============================

test(
  "downloads receipt",

  () => {

    const mockDoc = {

      setFontSize:
        jest.fn(),

      text:
        jest.fn(),

      save:
        jest.fn()
    };

    const { jsPDF } =
      require("jspdf");

    jsPDF.mockImplementation(
      () => mockDoc
    );

    render(

      <BrowserRouter>

        <PaymentSuccess />

      </BrowserRouter>
    );

    fireEvent.click(

      screen.getByText(
        /download receipt/i
      )
    );

    expect(
      mockDoc.setFontSize
    ).toHaveBeenCalled();

    expect(
      mockDoc.text
    ).toHaveBeenCalled();

    expect(
      mockDoc.save
    ).toHaveBeenCalled();

    expect(

      toast.success

    ).toHaveBeenCalledWith(
      "Receipt Downloaded ✅"
    );
  }
);
    // ==============================
    // BACK TO PARKING
    // ==============================

    test(
      "navigates to parking",

      () => {

        render(

          <BrowserRouter>

            <PaymentSuccess />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /back to parking/i
          )
        );

        expect(
          mockedNavigate
        ).toHaveBeenCalledWith(
          "/parking"
        );
      }
    );

    // ==============================
    // LOGOUT
    // ==============================

    test(
      "logout works",

      () => {

        render(

          <BrowserRouter>

            <PaymentSuccess />

          </BrowserRouter>
        );

        fireEvent.click(

          screen.getByText(
            /logout/i
          )
        );

        expect(
          mockedNavigate
        ).toHaveBeenCalledWith(
          "/login"
        );
      }
    );

    // ==============================
    // NO PAYMENT DATA
    // ==============================

    test(
      "shows no payment data",

      () => {

        localStorage.removeItem(
          "paymentData"
        );

        render(

          <BrowserRouter>

            <PaymentSuccess />

          </BrowserRouter>
        );

        expect(

          screen.getByText(
            /no payment data/i
          )

        ).toBeInTheDocument();
      }
    );
  }
);