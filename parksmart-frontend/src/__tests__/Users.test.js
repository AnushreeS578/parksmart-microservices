import React from "react";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Users from "../pages/Users";

import API from "../services/api";

import { toast } from "react-toastify";

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
  "Users Component",

  () => {

    beforeEach(() => {

      jest.clearAllMocks();
    });

    // ==============================
    // ACCESS DENIED
    // ==============================

    test(
      "shows access denied",

      () => {

        localStorage.setItem(
          "role",
          "USER"
        );

        render(
          <Users />
        );

        expect(

          screen.getByText(
            /access denied/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // RENDER USERS PAGE
    // ==============================

    test(
      "renders users page",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockResolvedValue({

          data: [

            {
              username:
                "anu",

              name:
                "Anu",

              email:
                "anu@gmail.com",

              phone:
                "9999999999"
            }
          ]
        });

        render(
          <Users />
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /users list/i
            )

          ).toBeInTheDocument();
        });
      }
    );

    // ==============================
    // SHOW USER DETAILS
    // ==============================

    test(
      "shows user details",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockResolvedValue({

          data: [

            {
              username:
                "anu",

              name:
                "Anu",

              email:
                "anu@gmail.com",

              phone:
                "9999999999"
            }
          ]
        });

        render(
          <Users />
        );

        await waitFor(() => {

          expect(

            screen.getByText(
              /anu@gmail.com/i
            )

          ).toBeInTheDocument();
        });

        expect(

          screen.getByText(
            /9999999999/i
          )

        ).toBeInTheDocument();
      }
    );

    // ==============================
    // SHOW N/A VALUES
    // ==============================

    test(
      "shows na values",

      async () => {

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        API.get.mockResolvedValue({

          data: [

            {
              username:
                "test"
            }
          ]
        });

        render(
          <Users />
        );

        await waitFor(() => {

          expect(

            screen.getAllByText(
              /n\/a/i
            ).length

          ).toBeGreaterThan(0);
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
          <Users />
        );

        await waitFor(() => {

          expect(

            toast.error

          ).toHaveBeenCalledWith(
            "Failed to load users ❌"
          );
        });
      }
    );
  }
);