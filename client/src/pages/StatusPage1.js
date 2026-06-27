import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./StatusPage.css";

function StatusPage1() {
  const { item_id, reminder_id } = useParams();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [status, setStatus] = useState("Pending");
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    axios
      .get("https://rma-management.onrender.com/reminders_ls")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const saveStatus = async () => {
    try {
      await axios.post(
        `https://rma-management.onrender.com/update-status_ls/${item_id}`,
        {
          item_id,
          reminder_id,
          updated_by: `${username} (${role})`,
          status,
          status_text: statusText,
        }
      );

      alert("Status Updated");
      navigate(-1);
    } catch (err) {
      console.log("FULL ERROR:", err);

      if (err.response) {
        console.log("SERVER RESPONSE:", err.response.data);
        alert(err.response.data.message);
      }
    }
  };

  return (
    <div className="status-page">
      <div className="status-card">
        <h5>Status Update</h5>

        <select
          className="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <textarea
          className="status-textarea"
          value={statusText}
          onChange={(e) => setStatusText(e.target.value)}
        />

        <div className="status-buttons">
          <button className="btn btn-success" onClick={saveStatus}>
            Save
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatusPage1;