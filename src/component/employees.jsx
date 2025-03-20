import { useState } from "react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { background, header } from "../assets/image.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CheckInOutHistory from "./CheckInOutHistory.jsx";
import UserTable from "./UserTable.jsx";

function Employees() {
  // State for error handling
  const [error, setError] = useState(null);
  const { user } = useUser();

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
      <h1 style={{ marginTop: "25px" }}>
        Hi, {user ? `${user.firstName}  👋` : "Employee!"}
      </h1>

      <CheckInOutHistory />

      <UserTable />

      {error && <p>{error}</p>}

      <ToastContainer />
    </div>
  );
}

export default Employees;
