import React from "react";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Dashboard from "../pages/Dashboard";

import API from "../services/api";

import {
  BrowserRouter
} from "react-router-dom";

import {
  Provider
} from "react-redux";

import {
  createStore
} from "redux";

// ==============================
// MOCK matchMedia
// ==============================

global.matchMedia =
  global.matchMedia ||

  function () {

    return {

      matches: false,

      addListener: jest.fn(),

      removeListener: jest.fn()
    };
  };

// ==============================
// MOCK SWEETALERT
// ==============================

jest.mock(
  "sweetalert2",

  () => ({

    fire: jest.fn()
  })
);

// ==============================
// MOCK NAVIGATE
// ==============================

jest.mock(
  "react-router-dom",

  () => ({

    ...jest.requireActual(
      "react-router-dom"
    ),

    useNavigate: () =>
      jest.fn()
  })
);

// ==============================
// REDUX STORE
// ==============================

const initialState = {

  user: {

    role: "USER",

    token: "token123",

    userId: 1
  }
};

const reducer = (
  state = initialState
) => state;

const store =
  createStore(reducer);

// ==============================
// MOCK API
// ==============================

jest.mock(
  "../services/api"
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

// ==============================
// MOCK CHARTS
// ==============================

jest.mock(
  "recharts",

  () => ({

    ResponsiveContainer:
      ({ children }) =>
        <div>{children}</div>,

    BarChart:
      ({ children }) =>
        <div>{children}</div>,

    Bar: () =>
      <div>Bar</div>,

    XAxis: () =>
      <div>XAxis</div>,

    YAxis: () =>
      <div>YAxis</div>,

    Tooltip: () =>
      <div>Tooltip</div>,

    PieChart:
      ({ children }) =>
        <div>{children}</div>,

    Pie:
      ({ children }) =>
        <div>{children}</div>,

    Cell: () =>
      <div>Cell</div>,

    Legend: () =>
      <div>Legend</div>,

    LineChart:
      ({ children }) =>
        <div>{children}</div>,

    Line: () =>
      <div>Line</div>,

    CartesianGrid: () =>
      <div>Grid</div>
  })
);

// ==============================
// MOCK SPINNER
// ==============================

jest.mock(
  "react-spinners",

  () => ({

    ClipLoader: () =>
      <div>Loading...</div>
  })
);

describe(
  "Dashboard Component",

  () => {

    beforeEach(() => {

      jest.clearAllMocks();

      localStorage.setItem(
        "role",
        "USER"
      );

      localStorage.setItem(
        "token",
        "token123"
      );

      localStorage.setItem(
        "userId",
        "1"
      );

      localStorage.setItem(
        "notifications",

        JSON.stringify([
          {
            id: 1,
            status: "UNREAD"
          }
        ])
      );
    });

    // ==============================
    // RENDER DASHBOARD
    // ==============================

    test(
      "renders dashboard",

      async () => {

        API.get

          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                availableSlots: 20
              }
            ]
          })

          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                userId: 1
              }
            ]
          })

          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                amount: 500,
                paymentMethod: "UPI",
                status: "SUCCESS"
              }
            ]
          });

        render(

          <Provider store={store}>

            <BrowserRouter>

              <Dashboard />

            </BrowserRouter>

          </Provider>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /dashboard/i
            )

          ).toBeInTheDocument();
        });
      }
    );

    // ==============================
    // USER STATS
    // ==============================

    test(
      "shows user stats",

      async () => {

        API.get

          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                availableSlots: 10
              }
            ]
          })

          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                userId: 1
              }
            ]
          })

          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                amount: 200,
                paymentMethod: "CARD",
                status: "SUCCESS"
              }
            ]
          });

        render(

          <Provider store={store}>

            <BrowserRouter>

              <Dashboard />

            </BrowserRouter>

          </Provider>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /your spending/i
            )

          ).toBeInTheDocument();
        });

        expect(

  screen.getAllByText(
    /₹200/i
  )[0]

).toBeInTheDocument();
      }
    );

    // ==============================
    // NO PAYMENTS
    // ==============================

    test(
      "shows no payments",

      async () => {

        API.get

          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                availableSlots: 10
              }
            ]
          })

          .mockResolvedValueOnce({
            data: []
          })

          .mockResolvedValueOnce({
            data: []
          });

        render(

          <Provider store={store}>

            <BrowserRouter>

              <Dashboard />

            </BrowserRouter>

          </Provider>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /no payments yet/i
            )

          ).toBeInTheDocument();
        });
      }
    );

    // ==============================
    // API FAILURE
    // ==============================

    test(
      "handles dashboard api failure",

      async () => {

        API.get.mockRejectedValue(
          {}
        );

        render(

          <Provider store={store}>

            <BrowserRouter>

              <Dashboard />

            </BrowserRouter>

          </Provider>
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /dashboard/i
            )

          ).toBeInTheDocument();
        });
      }
    );
    // ==============================
// ADMIN DASHBOARD
// ==============================

test(
  "shows admin dashboard stats",

  async () => {

    const adminStore =
      createStore(() => ({

        user: {

          role: "ADMIN",

          token: "token123",

          userId: 1
        }
      }));

    API.get

      // PARKING
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            availableSlots: 10
          }
        ]
      })

      // BOOKINGS
      .mockResolvedValueOnce({
        data: [
          {
            id: 1
          }
        ]
      })

      // PAYMENTS
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            amount: 500,
            paymentMethod: "UPI",
            status: "SUCCESS"
          }
        ]
      });

    render(

      <Provider store={adminStore}>

        <BrowserRouter>

          <Dashboard />

        </BrowserRouter>

      </Provider>
    );

    await waitFor(() => {

      expect(

        screen.getByText(
          /revenue/i
        )

      ).toBeInTheDocument();
    });

    expect(

      screen.getAllByText(
        /₹500/i
      )[0]

    ).toBeInTheDocument();
  }
);
  }
);