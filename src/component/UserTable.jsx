import './UserTable.css';
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify

function UserTable() {
  const [users, setUsers] = useState([]);
  const [isUsersLoaded, setIsUsersLoaded] = useState(false);

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/checkinout/all-users");
        const data = await response.json();

        

        // Check if data is an array and contains the necessary fields
        if (Array.isArray(data) && data.length > 0) {
          const uniqueUsers = Array.from(new Map(data.map(user => [user._id, user])).values());
          

          setUsers(uniqueUsers); // Set the users state
          setIsUsersLoaded(true); // Mark users as loaded
        } else {
          console.error("No users found or invalid data:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to copy userId (which is _id) to clipboard
  const copyToClipboard = (userId) => {
    navigator.clipboard.writeText(userId).then(() => {
      toast.success("User ID copied to clipboard!"); // Use toast.success for success message
    }).catch((error) => {
      console.error("Failed to copy user ID: ", error);
      toast.error("Failed to copy user ID"); // Show error message if copy fails
    });
  };

  return (
    <div>
      {isUsersLoaded && (
        <div>
          <h1>All Users</h1>
          <table border="1">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>employee ID</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>
                      <button className='btn-dashbord-emp' onClick={() => copyToClipboard(user._id)}>
                        Copy User ID
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* ToastContainer to show toasts */}
      <ToastContainer />
    </div>
  );
}

export default UserTable;
