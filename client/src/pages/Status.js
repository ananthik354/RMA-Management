import React, {
    useEffect,
    useState,
    useCallback
} from "react";

import axios from "axios";

import "./Status.css";

import {
    useParams,
    Link
} from "react-router-dom";

const Status = () => {

    const { id } = useParams();

    const [
        data,
        setData
    ] = useState({});

    const [
        status,
        setStatus
    ] = useState("");

    const loadData = useCallback(async () => {

        const res =
            await axios.get(
                `https://crud-operation-wn6g.onrender.com/api/rma/${id}`
            );

        setData(
            res.data[0]
        );

        setStatus(
            res.data[0].status
        );
    }, [id]);

    useEffect(() => {

        loadData();

    }, [loadData]);


        const updateStatus = async () => {

    try {

        await axios.put(
            `https://crud-operation-wn6g.onrender.com/api/status/${id}`,
            {
                status
            }
        );

        alert("Status Updated");

        loadData();

    } catch (err) {
        console.log(err);
    }
};
    const completeStatus =
        async () => {

            try {

                await axios.put(
                    `https://crud-operation-wn6g.onrender.com/api/status/${id}`,
                    {
                        status:
                            "Completed"
                    });

                setStatus(
                    "Completed"
                );

                alert(
                    "Status Completed"
                );

                loadData();

            }

            catch (err) {

                console.log(err);

            }
        };

    return (

        <div
            style={{
                padding: "40px"
            }}
        >

            <h2>
                RMA Details
            </h2>

            <p>
                Customer:
                {
                    data.customer_name
                }
            </p>

            <p>
                Product:
                {
                    data.product_name
                }
            </p>

            <p>
                Model:
                {
                    data.model_number
                }
            </p>

            <p>
                Serial No:
                {
                    data.serial_no
                }
            </p>

            <p>
                Reminder Date:
                {
                    data.reminder_date
                        ?.split("T")[0]
                }
            </p>

            <h3>
                Update Status
            </h3>

            <input
                type="text"
                value={status}
                onChange={(e) =>
                    setStatus(
                        e.target.value
                    )
                }
                placeholder=
                "Enter Status"
                className=
                "status-input"
            />

            <br /><br />

            <button onClick={updateStatus}>
                Update
            </button>

            <button
                className=
                "completed-btn"
                onClick={
                    completeStatus
                }
            >
                Completed
            </button>

            <Link
                to="/Dashboard"
            >
                <button
                    className=
                    "back-btn"
                >
                    ← Go Back
                </button>
            </Link>

        </div>
    );
};

export default Status;