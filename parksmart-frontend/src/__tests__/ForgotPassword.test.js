import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import ForgotPassword from "../pages/ForgotPassword";

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
      error: jest.fn()
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
  "ForgotPassword Component",
  () => {

    beforeEach(() => {

      jest.clearAllMocks();
    });

    const setup = () => {

      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );
    };

    test(
      "renders forgot password page",
      () => {

        setup();

        expect(
          screen.getByText(
            /Send OTP/i
          )
        ).toBeInTheDocument();
      }
    );

    test(
      "shows error if username empty",
      () => {

        setup();

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Username is required ❌"
        );
      }
    );

    test(
      "send otp success",
      async () => {

        API.post.mockResolvedValue({});

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          expect(
            API.post
          ).toHaveBeenCalledWith(
            "/auth/send-otp",
            {
              username: "anu"
            }
          );

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "OTP Sent Successfully ✅"
          );
        });
      }
    );

    test(
      "send otp failure",
      async () => {

        API.post.mockRejectedValue({
          response: {
            data: {
              message:
                "User not found"
            }
          }
        });

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "User not found"
          );
        });
      }
    );

    test(
      "shows otp required error",
      async () => {

        API.post.mockResolvedValue({});

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Verify OTP/i
            )
          );

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "OTP is required ❌"
          );
        });
      }
    );

    test(
      "shows invalid otp format",
      async () => {

        API.post.mockResolvedValue({});

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter OTP/i
            ),
            {
              target: {
                value: "abc"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Verify OTP/i
            )
          );

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Invalid OTP Format ❌"
          );
        });
      }
    );

    test(
      "verify otp success",
      async () => {

        API.post
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({});

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter OTP/i
            ),
            {
              target: {
                value: "1234"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Verify OTP/i
            )
          );
        });

        await waitFor(() => {

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "OTP Verified ✅"
          );
        });
      }
    );

    test(
      "verify otp failure",
      async () => {

        API.post
          .mockResolvedValueOnce({})
          .mockRejectedValueOnce({
            response: {
              data: {
                message:
                  "Invalid OTP"
              }
            }
          });

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter OTP/i
            ),
            {
              target: {
                value: "1234"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Verify OTP/i
            )
          );
        });

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Invalid OTP"
          );
        });
      }
    );

    test(
      "shows password required error",
      async () => {

        API.post
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({});

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter OTP/i
            ),
            {
              target: {
                value: "1234"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Verify OTP/i
            )
          );
        });

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Reset Password/i
            )
          );

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Password required ❌"
          );
        });
      }
    );

    test(
      "reset password success",
      async () => {

        API.post
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({});

        API.put.mockResolvedValue({});

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter OTP/i
            ),
            {
              target: {
                value: "1234"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Verify OTP/i
            )
          );
        });

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter New Password/i
            ),
            {
              target: {
                value: "Password1"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Reset Password/i
            )
          );
        });

        await waitFor(() => {

          expect(
            API.put
          ).toHaveBeenCalled();

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "Password Reset Successful ✅"
          );
        });
      }
    );

    test(
      "reset password failure",
      async () => {

        API.post
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({});

        API.put.mockRejectedValue({
          response: {
            data: {
              message:
                "Reset failed"
            }
          }
        });

        setup();

        fireEvent.change(
          screen.getByPlaceholderText(
            /Enter Username/i
          ),
          {
            target: {
              value: "anu"
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Send OTP/i
          )
        );

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter OTP/i
            ),
            {
              target: {
                value: "1234"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Verify OTP/i
            )
          );
        });

        await waitFor(() => {

          fireEvent.change(
            screen.getByPlaceholderText(
              /Enter New Password/i
            ),
            {
              target: {
                value: "Password1"
              }
            }
          );

          fireEvent.click(
            screen.getByText(
              /Reset Password/i
            )
          );
        });

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Reset failed"
          );
        });
      }
    );
  }
);