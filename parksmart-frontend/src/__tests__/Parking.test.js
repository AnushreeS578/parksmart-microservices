import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Parking from "../pages/Parking";

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
      pathname: "/parking"
    })
  })
);

describe(
  "Parking Component",
  () => {

    beforeEach(() => {

      jest.clearAllMocks();
    });

    const parkingData = [
      {
        id: 1,
        location: "MG Road",
        totalSlots: 100,
        availableSlots: 50,
        pricePerHour: 20
      }
    ];

    test(
      "renders parking page",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "USER"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        expect(
          screen.getByText(
            /Parking Locations/i
          )
        ).toBeInTheDocument();

        await waitFor(() => {

          expect(
            screen.getByText(
              /MG Road/i
            )
          ).toBeInTheDocument();
        });
      }
    );

    test(
      "shows empty parking",
      async () => {

        API.get.mockResolvedValue({
          data: []
        });

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          expect(
            screen.getByText(
              /No Parking Available/i
            )
          ).toBeInTheDocument();
        });
      }
    );

    test(
      "fetch parking failure",
      async () => {

        API.get.mockRejectedValue({
          response: {
            data: {
              message:
                "Failed"
            }
          }
        });

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Failed"
          );
        });
      }
    );

    test(
      "user can navigate to booking",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "USER"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Book Slot/i
            )
          );

          expect(
            mockNavigate
          ).toHaveBeenCalled();
        });
      }
    );

    test(
      "admin can edit parking",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        expect(
          screen.getByDisplayValue(
            "MG Road"
          )
        ).toBeInTheDocument();
      }
    );

    test(
      "shows validation for empty location",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        const locationInput =
          screen.getByDisplayValue(
            "MG Road"
          );

        fireEvent.change(
          locationInput,
          {
            target: {
              value: ""
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Update Parking/i
          )
        );

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Location required ❌"
        );
      }
    );

    test(
      "shows invalid total slots",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        const totalInput =
          screen.getByDisplayValue(
            "100"
          );

        fireEvent.change(
          totalInput,
          {
            target: {
              value: 0
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Update Parking/i
          )
        );

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Invalid total slots ❌"
        );
      }
    );

    test(
      "shows invalid available slots",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        const availableInput =
          screen.getByDisplayValue(
            "50"
          );

        fireEvent.change(
          availableInput,
          {
            target: {
              value: -1
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Update Parking/i
          )
        );

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Invalid available slots ❌"
        );
      }
    );

    test(
      "shows available exceeds total",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        const availableInput =
          screen.getByDisplayValue(
            "50"
          );

        fireEvent.change(
          availableInput,
          {
            target: {
              value: 200
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Update Parking/i
          )
        );

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Available exceeds total ❌"
        );
      }
    );

    test(
      "shows invalid price",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        const priceInput =
          screen.getByDisplayValue(
            "20"
          );

        fireEvent.change(
          priceInput,
          {
            target: {
              value: 0
            }
          }
        );

        fireEvent.click(
          screen.getByText(
            /Update Parking/i
          )
        );

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Invalid price ❌"
        );
      }
    );

    test(
      "update parking success",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        API.put.mockResolvedValue({});

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        fireEvent.click(
          screen.getByText(
            /Update Parking/i
          )
        );

        await waitFor(() => {

          expect(
            API.put
          ).toHaveBeenCalled();

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "Parking Updated ✅"
          );
        });
      }
    );

    test(
      "update parking failure",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        API.put.mockRejectedValue({
          response: {
            data: {
              message:
                "Update Failed"
            }
          }
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Edit/i
            )
          );
        });

        fireEvent.click(
          screen.getByText(
            /Update Parking/i
          )
        );

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Update Failed"
          );
        });
      }
    );

    test(
      "delete parking success",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        API.delete.mockResolvedValue({});

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Delete/i
            )
          );
        });

        await waitFor(() => {

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "Parking Deleted ✅"
          );
        });
      }
    );

    test(
      "delete parking failure",
      async () => {

        API.get.mockResolvedValue({
          data: parkingData
        });

        API.delete.mockRejectedValue({
          response: {
            data: {
              message:
                "Delete Failed"
            }
          }
        });

        localStorage.setItem(
          "role",
          "ADMIN"
        );

        render(
          <MemoryRouter>
            <Parking />
          </MemoryRouter>
        );

        await waitFor(() => {

          fireEvent.click(
            screen.getByText(
              /Delete/i
            )
          );
        });

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Delete Failed"
          );
        });
      }
    );
  }
);