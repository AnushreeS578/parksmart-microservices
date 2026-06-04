import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Register from "../pages/Register";

import API from "../services/api";

import { toast } from "react-toastify";

import {
  MemoryRouter
} from "react-router-dom";

// MOCKS

const mockNavigate = jest.fn();

jest.mock(
  "../services/api"
);

jest.mock(
  "react-toastify",
  () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn()
    }
  })
);

jest.mock(
  "../layouts/AuthLayout",
  () => ({ children }) =>
    <div>{children}</div>
);

jest.mock(
  "react-router-dom",
  () => ({
    ...jest.requireActual(
      "react-router-dom"
    ),

    useNavigate: () =>
      mockNavigate
  })
);

describe(
  "Register Component",
  () => {

    beforeEach(() => {

      jest.clearAllMocks();
    });

    const setup = () => {

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      const usernameInput =
        screen.getByPlaceholderText(
          /Enter Username/i
        );

      const passwordInput =
        screen.getByPlaceholderText(
          /Enter Password/i
        );

      const roleSelect =
        screen.getByRole(
          "combobox"
        );

      const button =
        screen.getByText(
          /Create Account/i
        );

      return {
        usernameInput,
        passwordInput,
        roleSelect,
        button
      };
    };

    test(
      "renders register page",
      () => {

        setup();

        expect(
          screen.getByText(
            /Create Account/i
          )
        ).toBeInTheDocument();
      }
    );

    test(
      "shows username required",
      () => {

        const { button } =
          setup();

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Username is required ❌"
        );
      }
    );

    test(
      "shows username minimum length",
      () => {

        const {
          usernameInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "ab"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Username must be at least 3 characters ❌"
        );
      }
    );

    test(
      "shows invalid username format",
      () => {

        const {
          usernameInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu@123"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Username can contain only letters, numbers and underscore ❌"
        );
      }
    );

    test(
      "shows password required",
      () => {

        const {
          usernameInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu123"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Password is required ❌"
        );
      }
    );

    test(
      "shows password minimum length",
      () => {

        const {
          usernameInput,
          passwordInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu123"
            }
          }
        );

        fireEvent.change(
          passwordInput,
          {
            target: {
              value: "Ab1"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Password must be at least 6 characters ❌"
        );
      }
    );

    test(
      "shows uppercase validation",
      () => {

        const {
          usernameInput,
          passwordInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu123"
            }
          }
        );

        fireEvent.change(
          passwordInput,
          {
            target: {
              value: "password1"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Password must contain uppercase letter ❌"
        );
      }
    );

    test(
      "shows number validation",
      () => {

        const {
          usernameInput,
          passwordInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu123"
            }
          }
        );

        fireEvent.change(
          passwordInput,
          {
            target: {
              value: "Password"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Password must contain number ❌"
        );
      }
    );

    test(
      "successful registration",
      async () => {

        API.post.mockResolvedValue({});

        const {
          usernameInput,
          passwordInput,
          roleSelect,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu123"
            }
          }
        );

        fireEvent.change(
          passwordInput,
          {
            target: {
              value: "Password1"
            }
          }
        );

        fireEvent.change(
          roleSelect,
          {
            target: {
              value: "USER"
            }
          }
        );

        fireEvent.click(
          button
        );

        await waitFor(() => {

          expect(
            API.post
          ).toHaveBeenCalledWith(
            "/auth/register",
            {
              username: "anu123",
              password: "Password1",
              role: "USER"
            }
          );

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "Registration Success ✅"
          );
        });
      }
    );

    test(
      "registration failure",
      async () => {

        API.post.mockRejectedValue({
          response: {
            data: {
              message:
                "User already exists"
            }
          }
        });

        const {
          usernameInput,
          passwordInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu123"
            }
          }
        );

        fireEvent.change(
          passwordInput,
          {
            target: {
              value: "Password1"
            }
          }
        );

        fireEvent.click(
          button
        );

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "User already exists"
          );
        });
      }
    );

    test(
      "button disabled during loading",
      async () => {

        API.post.mockImplementation(
          () =>
            new Promise(
              (resolve) =>
                setTimeout(
                  () =>
                    resolve({}),
                  100
                )
            )
        );

        const {
          usernameInput,
          passwordInput,
          button
        } = setup();

        fireEvent.change(
          usernameInput,
          {
            target: {
              value: "anu123"
            }
          }
        );

        fireEvent.change(
          passwordInput,
          {
            target: {
              value: "Password1"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          screen.getByText(
            /Creating Account/i
          )
        ).toBeInTheDocument();
      }
    );

    test(
      "navigate to login page",
      () => {

        setup();

        fireEvent.click(
          screen.getByText(
            /Login/i
          )
        );

        expect(
          mockNavigate
        ).toHaveBeenCalledWith(
          "/login"
        );
      }
    );
  }
);