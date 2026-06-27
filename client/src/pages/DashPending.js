import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

 function DashPending() {

    //const [type, setType] = useState("pending");

const [pendingData, setPendingData] = useState([]);
const [completeData, setCompleteData] = useState([]);

const location = useLocation();

const type =
  location.pathname === "/complete-serials"
    ? "completed"
    : "pending";

useEffect(() => {
    axios
        .get("https://rma-management.onrender.com/pending-serials")
        .then((res) => {
            setPendingData(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
}, []);



useEffect(() => {
    axios
        .get("https://rma-management.onrender.com/complete-serials")
        .then((res) => {
            setCompleteData(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
}, []);



  return (
    <div className="container mt-4">

      <h3>Pending Inward</h3>

            
    <table border="1">
    <thead>
        <tr>
            <th>RMA No</th>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Model</th>
            <th>Serial No</th>
            <th>Accessory</th>
            <th>Issues</th>
            <th>Status </th>
        </tr>
    </thead>

    <tbody>
       {(type === "pending" ? pendingData : completeData).map((item, index) => (
            <tr key={index}>
                <td>{item.rma_no}</td>
                <td>{item.customer_name}</td>
                <td>{item.product_name}</td>
                <td>{item.model_number}</td>
                <td>{item.serial_no}</td>
                <td>{item.accessory}</td>
                <td>{item.issues}</td>
                   <td> <Link

                to={`/serial-history/${item.serial_no}`}
              >
                View
              </Link></td>
            </tr>
        ))}
    </tbody>
</table>

      <Link to="/Dashboard">
                          <button className="back-btn">
                              Go Back
                          </button>
                      </Link>

    </div>
  );
}


export default DashPending;