import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { header } from "../assets/image.js";
import Clock from "./timeAnddate.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const { user } = useUser();

  // Check the status and time from localStorage when the component loads
  useEffect(() => {
    const status = localStorage.getItem("status");
    const checkInTime = localStorage.getItem("checkInTime");
    const checkOutTime = localStorage.getItem("checkOutTime");

    if (status === "checked-in") {
      setIsCheckedIn(true);
      setStartTime(checkInTime);
    } else if (status === "checked-out") {
      setIsCheckedIn(false);
    }

    if (checkInTime) {
      const checkInDate = new Date(checkInTime);
      const now = new Date();
      const timeDifference = Math.floor((now - checkInDate) / (1000 * 60)); // Time difference in minutes
      console.log(`Time since check-in: ${timeDifference} minutes`);
    }
  }, []);

  const handleCheckIn = async () => {
    setIsCheckedIn(true);
    const checkInTime = new Date().toISOString();
    setStartTime(checkInTime);

    localStorage.setItem("status", "checked-in");
    localStorage.setItem("checkInTime", checkInTime);

    if (user) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/checkinout/checkin`,
          
          {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            checkInTime,
          }
        );
        toast.success(response.data.message);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
          toast.error(error.response.data.error || "Failed to record check-in");
        } else {
          toast.error("Failed to record check-in");
        }
      }
    } else {
      toast.error("User not found");
    }
  };

  const handleCheckOut = async () => {
    const checkOutTime = new Date().toISOString();

    localStorage.setItem("status", "checked-out");
    localStorage.setItem("checkOutTime", checkOutTime);

    if (user) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/checkinout/checkout`,
          {
            userId: user.id,
            checkOutTime,
          }
        );
        toast.success(response.data.message);
        setIsCheckedIn(false);
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.error
          : "Failed to record check-out";
        toast.error(errorMessage);
        console.error(errorMessage);
      }
    } else {
      toast.error("User not found");
    }
  };

  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <img src={header} className="header-image" alt="Header" />

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          display: "flex",
          justifyContent: "cente",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Clock />
      </div>

      <div className="continare-all-btn">
        <h1>
          Welcome,{" "}
          {user ? `${user.firstName} ${user.lastName} 👋` : "Employee!"}
        </h1>
        {!isCheckedIn ? (
          <button onClick={handleCheckIn}>
            <FontAwesomeIcon
              icon={faSignInAlt}
              style={{ marginRight: "8px" }}
            />
            Check In
          </button>
        ) : (
          <button onClick={handleCheckOut}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              style={{ marginRight: "8px" }}
            />
            Check Out
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
