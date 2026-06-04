import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Parking from "./pages/Parking";
import AddParking from "./pages/AddParking";
import Users from "./pages/Users";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";
import BookingConfirm from "./pages/BookingConfirm";
import Payment from "./pages/Payment";
import Payments from "./pages/Payments";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Notification from "./pages/Notification";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* PARKING */}
        <Route path="/parking" element={<Parking />} />
        <Route path="/add-parking" element={<AddParking />} />

        {/* USERS */}
        <Route path="/users" element={<Users />} />

        {/* BOOKING */}
        <Route path="/book" element={<Booking />} />
        <Route path="/booking-confirm" element={<BookingConfirm />} />

        {/* ADMIN */}
        <Route path="/bookings" element={<Bookings />} />

        {/* PAYMENT */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payments" element={<Payments />} />

        <Route path="/notifications" element={<Notification />} />

        
      </Routes>
      <ToastContainer
          position="top-right"
          autoClose={2500}
      />
    </BrowserRouter>
  );
}

export default App;