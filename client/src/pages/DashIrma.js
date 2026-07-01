import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function DashIrma() {

    //const [type, setType] = useState("pending");

    const [pendingData, setPendingData] = useState([]);
    const [completeData, setCompleteData] = useState([]);

    const location = useLocation();

    const type =
        location.pathname === "/all-irma-data_complete"
            ? "completed"
            : "pending";

    useEffect(() => {
        axios
            .get("https://rma-management.onrender.com/all-irma-data_pending")
            .then((res) => {
                setPendingData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);



    useEffect(() => {
        axios
            .get("https://rma-management.onrender.com/all-irma-data_complete")
            .then((res) => {
                setCompleteData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);



    return (
        <div className="container mt-4">

            <h3> RMA Inward</h3>


            <table border="1">
                <thead>
                    <tr>
                        <th>RMA No</th>
                        <th>Customer Name</th>
                        <th>DC No</th>
                        <th>Product</th>
                        <th>Model</th>
                        <th>Entry date</th>
                        <th>All Data</th>
                        {/* <th>Serial No</th>
            <th>Accessory</th>
            <th>Issues</th>
            <th>Status </th> */}
                    </tr>
                </thead>

                <tbody>
                    {(type === "pending" ? pendingData : completeData).map((item, index) => (
                        <tr key={index}>
                            <td>{item.rma_no}</td>
                            <td>{item.customer_name}</td>
                            <td>{item.customer_dc_no}</td>
                            <td>{item.product_name}</td>
                            <td>{item.model_number}</td>
                            <td>
                                {item.entry_date
                                    ? new Date(item.entry_date).toLocaleDateString("en-GB")
                                    : "-"}
                            </td>
                            <td>
                                <Link

                                    to={`/rma-details_r/${item.rma_no}`}
                                >
                                    View
                                </Link>
                            </td>
                            {/* <td>{item.serial_no}</td>
                <td>{item.accessory}</td>
                <td>{item.issues}</td>
                 <td> <Link

                to={`/status-history_lsr/${item.item_id}`}
              >
                View
              </Link></td> */}
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


export default DashIrma;