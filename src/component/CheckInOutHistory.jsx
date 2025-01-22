import React, { useState } from "react";
import axios from "axios";
import './CheckInOutHistory.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx"; // Import xlsx

function CheckInOutHistory() {
  const [userId, setUserId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    if (!userId) {
      setError("Please enter a valid User ID");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:5000/api/checkinout/history/${userId}`);
      if (Array.isArray(response.data)) {
        setHistory(response.data);
      } else {
        setError("Received data is not in the expected format.");
      }
    } catch (err) {
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const data = history.map(record => ({
      Name: `${record.firstName} ${record.lastName}`,
      Date: formatDateWithDay(record.date),
      CheckInTime: new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      CheckOutTime: new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      TotalHours: calculateTotalHours(record.checkInTime, record.checkOutTime),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CheckInOutHistory");

    XLSX.writeFile(workbook, "CheckInOutHistory.xlsx");
  };

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const calculateTotalHours = (checkIn, checkOut) => {
    const differenceInMs = new Date(checkOut) - new Date(checkIn);
    return (differenceInMs / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours
  };

  return (
    <div>
      <div className="content-btn-futch">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <FontAwesomeIcon icon={faUser} className="input-icon" />
        </div>
        <button className="btn-dashbord-emp" onClick={fetchHistory} disabled={loading}>
          {loading ? "Loading..." : "Fetch History"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {history.length > 0 && (
        <>
          <button className="btn-dashbord-emp" onClick={exportToExcel}>Download as Excel</button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {history.map(record => (
                <tr key={record._id}>
                  <td>{`${record.firstName} ${record.lastName}`}</td>
                  <td>{formatDateWithDay(record.date)}</td>
                  <td>{new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{calculateTotalHours(record.checkInTime, record.checkOutTime)} hours</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default CheckInOutHistory;
