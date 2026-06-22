import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const Staff = () => {
    const [data, setData] = useState([]);

    const loadData = async () => {
        const response = await axios.get(
            "https://crud-operation-wn6g.onrender.com/api/staff"
        );

        console.log(response.data);

        setData(response.data);
    };
    useEffect(() => {
        loadData();
    }, []);
    return (
        <div className="home-container">
            <div className="top-section">
            <div className="top-section1">
            <Link to={`/Dashboard`}>
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
                        {data
                            .filter(
                                (item) =>
                                    item.role ===
                                    "user"
                            )
                            .map((item) => {
                                return (
                                    <tr key={item.id}>

                                        <td data-label="No">
                                            {item.id}
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
                                                    to={`/staff/password/${item.id}`}
                                                >
                                                    <button className="btn-view">
                                                        Reset
                                                    </button>
                                                </Link>

                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                
            </div>

        </div>

    );
};

export default Staff;