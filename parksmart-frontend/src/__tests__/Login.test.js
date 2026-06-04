import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Login from "../pages/Login";

import API from "../services/api";

import { BrowserRouter } from "react-router-dom";

// ================================
// MOCK NAVIGATE
// ================================

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockedNavigate
}));

// ================================
// MOCK API
// ================================

jest.mock("../services/api");

// ================================
// MOCK AUTH LAYOUT
// ================================

jest.mock("../layouts/AuthLayout", () => ({ children }) => (
  <div>{children}</div>
));

describe("Login Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    localStorage.clear();
  });

  // ================================
  // RENDER TEST
  // ================================

  test("renders login form", () => {

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText("Username")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Login")
    ).toBeInTheDocument();
  });

  // ================================
  // EMPTY USERNAME
  // ================================

  test("shows username required validation", () => {

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(
      screen.getByText("Login")
    );

    expect(
      screen.getByText(
        "Username is required ❗"
      )
    ).toBeInTheDocument();
  });

  // ================================
  // EMPTY PASSWORD
  // ================================

  test("shows password required validation", () => {

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Username"),
      {
        target: {
          value: "admin"
        }
      }
    );

    fireEvent.click(
      screen.getByText("Login")
    );

    expect(
      screen.getByText(
        "Password is required ❗"
      )
    ).toBeInTheDocument();
  });

  // ================================
  // SHORT PASSWORD
  // ================================

  test("shows password length validation", () => {

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Username"),
      {
        target: {
          value: "admin"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Password"),
      {
        target: {
          value: "12"
        }
      }
    );

    fireEvent.click(
      screen.getByText("Login")
    );

    expect(
      screen.getByText(
        "Password must be at least 4 characters ❗"
      )
    ).toBeInTheDocument();
  });

   // ================================
 // LOGIN SUCCESS
 // ================================

 test("login success", async () => {

   API.post.mockResolvedValue({
     data: {
       token: "token123",
       userId: 1,
       username: "admin",
       role: "USER"
     }
   });

   API.get.mockResolvedValue({
     data: {
       name: "John",
       email: "john@gmail.com",
       phone: "9999999999"
     }
   });

   render(
     <BrowserRouter>
       <Login />
     </BrowserRouter>
   );

   fireEvent.change(
     screen.getByPlaceholderText("Username"),
     {
       target: {
         value: "admin"
       }
     }
   );

   fireEvent.change(
     screen.getByPlaceholderText("Password"),
     {
       target: {
         value: "1234"
       }
     }
   );

   fireEvent.click(
     screen.getByText("Login")
   );

   // CHECK TOKEN

   await waitFor(() => {

     expect(
       localStorage.getItem("token")
     ).toBe("token123");

   });

   // WAIT FOR NAVIGATION

   await waitFor(

     () => {

       expect(
         mockedNavigate
       ).toHaveBeenCalledWith(
         "/dashboard"
       );

     },

     {
       timeout: 3000
     }
   );
 });
  // ================================
  // LOGIN FAILURE
  // ================================

  test("shows invalid login message", async () => {

    API.post.mockRejectedValue({
      response: {
        data: {
          message:
            "Invalid username or password ❌"
        }
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Username"),
      {
        target: {
          value: "wrong"
        }
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Password"),
      {
        target: {
          value: "wrong123"
        }
      }
    );

    fireEvent.click(
      screen.getByText("Login")
    );

    await waitFor(() => {

      expect(
        screen.getByText(
          "Invalid username or password ❌"
        )
      ).toBeInTheDocument();
    });
  });

});