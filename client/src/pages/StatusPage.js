

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./StatusPage.css";

function StatusPage() {

  const { item_id, reminder_id } = useParams();
 const username = localStorage.getItem("username");
const role = localStorage.getItem("role"); 
const navigate = useNavigate();
  const [data, setData] = useState({});
  const [status, setStatus] = useState("pending");
  const [statusText, setStatusText] = useState("");

// const [selectedItem, setSelectedItem] =
//     useState({ item_id: id });

const loadData = () => {
  axios.get("http://localhost:5000/reminders_lsr")
    .then(res => setData(res.data));
};

useEffect(() => {
  loadData();
}, []);

  useEffect(() => {

    axios
      .get(`http://localhost:5000/reminders_lsr`)
      .then((res) => {
        setData(res.data);
      });

  }, []);

  const saveStatus = async () => {  
try{
    await axios.post(
  `http://localhost:5000/update-status_lsr/${item_id}`,
  {
    item_id,
    reminder_id,
    updated_by:`${username} (${role})`,
    status,
    status_text: statusText
  }
);

    alert("Status Updated");
    navigate(-1);
    loadData();

}catch (err) {

    console.log("FULL ERROR:", err);

    if (err.response) {
        console.log("SERVER RESPONSE:", err.response.data);
        alert(err.response.data.message);
    }

}
  }



  const completeStatus = async () => {

  console.log("DATA:", data);

  await axios.post(
    "http://localhost:5000/update-status_l",
    {
      reminder_id: item_id,
      rma_id: data.rma_id,
      status_text: status,
      completed: true
    }
  );

  alert("Completed");
};

  return (
    // <div>
    // {selectedItem && (
<div className="status-page">
<div className="status-card">

    <h5>Status Update</h5>

    <select
        className="status-select"
        value={status}
        onChange={(e) =>
            setStatus(e.target.value)}
    >

        <option value="Pending">
            Pending
        </option>

        <option value="Completed">
            Completed
        </option>

    </select>

    <textarea
        className="status-textarea"
        value={statusText}
        onChange={(e) =>
            setStatusText(e.target.value)
        }
    />

   <div className="status-buttons">
    <button
        className="btn btn-success"
        onClick={saveStatus}
    >
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

export default StatusPage;