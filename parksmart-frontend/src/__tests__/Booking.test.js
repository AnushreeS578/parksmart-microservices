import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Booking from "../pages/Booking";

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
  "../layouts/MainLayout",
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
      mockNavigate,

    useLocation: () => ({
      state: {
        id: 1,
        location: "MG Road",
        pricePerHour: 50,
        availableSlots: 10
      }
    })
  })
);

describe(
  "Booking Component",
  () => {

    beforeEach(() => {

      jest.clearAllMocks();

      localStorage.setItem(
        "userId",
        "1"
      );
    });

    const setup = () => {

      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const slotInput =
        screen.getByPlaceholderText(
          /Slot Number/i
        );

      const startInput =
        document.querySelectorAll(
          'input[type="datetime-local"]'
        )[0];

      const endInput =
        document.querySelectorAll(
          'input[type="datetime-local"]'
        )[1];

      const button =
        screen.getByText(
          /Confirm Booking/i
        );

      return {
        slotInput,
        startInput,
        endInput,
        button
      };
    };

    test(
      "renders booking page",
      () => {

        setup();

        expect(
          screen.getByText(
            /Book Parking Slot/i
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /MG Road/i
          )
        ).toBeInTheDocument();
      }
    );

    test(
      "shows warning if slot number empty",
      () => {

        const { button } =
          setup();

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Slot Number is required ❌"
        );
      }
    );

    test(
      "shows warning for invalid slot",
      () => {

        const {
          slotInput,
          button
        } = setup();

        fireEvent.change(
          slotInput,
          {
            target: {
              value: -1
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Invalid Slot Number ❌"
        );
      }
    );

    test(
      "shows warning if start time missing",
      () => {

        const {
          slotInput,
          button
        } = setup();

        fireEvent.change(
          slotInput,
          {
            target: {
              value: 2
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Start Time required ❌"
        );
      }
    );

    test(
      "shows warning if end time missing",
      () => {

        const {
          slotInput,
          startInput,
          button
        } = setup();

        fireEvent.change(
          slotInput,
          {
            target: {
              value: 2
            }
          }
        );

        fireEvent.change(
          startInput,
          {
            target: {
              value: "2099-12-20T10:00"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "End Time required ❌"
        );
      }
    );

    test(
      "shows warning if start time in past",
      () => {

        const {
          slotInput,
          startInput,
          endInput,
          button
        } = setup();

        fireEvent.change(
          slotInput,
          {
            target: {
              value: 2
            }
          }
        );

        fireEvent.change(
          startInput,
          {
            target: {
              value: "2020-01-01T10:00"
            }
          }
        );

        fireEvent.change(
          endInput,
          {
            target: {
              value: "2099-01-01T12:00"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "Start time cannot be past ❌"
        );
      }
    );

    test(
      "shows warning if end before start",
      () => {

        const {
          slotInput,
          startInput,
          endInput,
          button
        } = setup();

        fireEvent.change(
          slotInput,
          {
            target: {
              value: 2
            }
          }
        );

        fireEvent.change(
          startInput,
          {
            target: {
              value: "2099-01-01T12:00"
            }
          }
        );

        fireEvent.change(
          endInput,
          {
            target: {
              value: "2099-01-01T10:00"
            }
          }
        );

        fireEvent.click(
          button
        );

        expect(
          toast.warning
        ).toHaveBeenCalledWith(
          "End time must be after start time ❌"
        );
      }
    );

    test(
      "successful booking",
      async () => {

        API.post.mockResolvedValue({
          data: {
            id: 1
          }
        });

        const {
          slotInput,
          startInput,
          endInput,
          button
        } = setup();

        fireEvent.change(
          slotInput,
          {
            target: {
              value: 5
            }
          }
        );

        fireEvent.change(
          startInput,
          {
            target: {
              value: "2099-01-01T10:00"
            }
          }
        );

        fireEvent.change(
          endInput,
          {
            target: {
              value: "2099-01-01T12:00"
            }
          }
        );

        fireEvent.click(
          button
        );

        await waitFor(() => {

          expect(
            API.post
          ).toHaveBeenCalled();

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "Booking Successful ✅"
          );
        });
      }
    );

    test(
      "booking failure",
      async () => {

        API.post.mockRejectedValue({
          response: {
            data: {
              message:
                "Slot already booked"
            }
          }
        });

        const {
          slotInput,
          startInput,
          endInput,
          button
        } = setup();

        fireEvent.change(
          slotInput,
          {
            target: {
              value: 5
            }
          }
        );

        fireEvent.change(
          startInput,
          {
            target: {
              value: "2099-01-01T10:00"
            }
          }
        );

        fireEvent.change(
          endInput,
          {
            target: {
              value: "2099-01-01T12:00"
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
            "Slot already booked"
          );
        });
      }
    );
  }
);