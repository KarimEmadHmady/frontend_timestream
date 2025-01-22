import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import "./employees.css";
import { background, header } from "../assets/image.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CheckInOutHistory from "./CheckInOutHistory.jsx";
import UserTable from "./UserTable.jsx";


function Employees() {
  // State for error handling
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Example: Fetching data or performing some operation that might trigger an error
  useEffect(() => {
    axios
      .get("/some-api-endpoint")
      .then((response) => {
        // Handle success
      })
      .catch((err) => {
        // Set error state if something goes wrong
        setError("Something went wrong, please try again later.");
      });
  }, []);

  

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
      <h1 style={{marginTop:'25px'}}>Hi, {user ? `${user.firstName}  👋` : 'Employee!'}</h1>

      <CheckInOutHistory/>

      <UserTable />
      {/* Display the error message if there is an error */}
      {error && <p>{error}</p>}

      <ToastContainer />
    </div>
  );
}

export default Employees;
