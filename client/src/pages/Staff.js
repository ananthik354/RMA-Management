
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const Staff = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const response = await axios.get(
                "https://rma-management.onrender.com/api/staff"
            );

            console.log(response.data);

            // Show all staff: admin and user
            setData(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error("Error loading staff:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="home-container">
            <div className="top-section">
                <div className="top-section1">
                    <Link to="/Dashboard">
                        <button className="back-btn">
                            Go Back
                        </button>
                    </Link>
                </div>

                <Link to="/home/addstaff">
                    <button className="btn-phone">
                        + Add Staff
                    </button>
                </Link>
            </div>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Staff Name</th>
                            <th>Staff Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4">
                                    Loading staff...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan="4">
                                    No staff records found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.id}>
                                    <td data-label="No">
                                        {index + 1}
                                    </td>

                                    <td data-label="Staff Name">
                                        {item.username}
                                    </td>

                                    <td data-label="Staff Role">
                                        {item.role}
                                    </td>

                                    <td data-label="Action">
                                        <div className="action-btns">
                                            <Link
                                                to={`/home/editstaff/${item.id}`}
                                            >
                                                <button className="btn-view">
                                                    Edit
                                                </button>
                                            </Link>

                                            <Link
                                                to={`/staff/password/${item.id}`}
                                            >
                                                <button className="btn-view">
                                                    Reset
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Staff;
