import React, { useState } from "react";
import axios from "axios";
import './CheckInOutHistory.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx"; 

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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/checkinout/history/${userId}`);
      setHistory(response.data || []);
    } catch (err) {
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const data = history.map(record => ({
      Name: `${record.firstName} ${record.lastName}`,
      Date: formatDateWithDay(record.checkInTime),
      CheckInTime: record.checkInTime,
      CheckOutTime: record.checkOutTime ? record.checkOutTime : "-",
      
      TotalHours: record.checkOutTime ? calculateTotalHours(record.checkInTime, record.checkOutTime) : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CheckInOutHistory");
    XLSX.writeFile(workbook, "CheckInOutHistory.xlsx");
  };

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateTotalHours = (checkIn, checkOut) => {
    return ((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60)).toFixed(2);
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
                  <td>{formatDateWithDay(record.checkInTime)}</td>
                  <td>{record.checkInTime}</td>
<td>{record.checkOutTime ? record.checkOutTime : "-"}</td>


                  <td>{record.checkOutTime ? calculateTotalHours(record.checkInTime, record.checkOutTime) : "-"} hours</td>
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
