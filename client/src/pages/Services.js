import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { toast } from "react-toastify";
import axios from "axios";

const Services = () => {
     const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const filteredData = data.filter((item) => {
      const value = search.toLowerCase();
    
      return (
        item.center_name?.toLowerCase().includes(value) ||
        
        item.phone_no?.toLowerCase().includes(value)
      );
    });

    const loadData = async () => {
        const response = await axios.get(
            "https://rma-management.onrender.com/api/service"
        );

        console.log(response.data);

        setData(response.data);
    };
    useEffect(() => {
        loadData();
    }, []);

    const role=localStorage.getItem("role")

    const deleteContact = async (id) => {
        console.log("Delete id:", id);
        if (window.confirm("Are you sure you wanted to delete the customer ?")) {
            try {
                await axios.delete(`https://rma-management.onrender.com/api/ser_remove/${id}`);
                toast.success("service details deleted successfully");
                loadData();
            } catch (error) {
                console.log(error);
            }
        }
    };
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
                <div style={{ marginBottom: "15px" }}>
  <input
    type="text"
    placeholder="Search Center name or Phone..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: "300px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px"
    }}
  />
</div>

                <Link to="/home/addservice">
                    <button className="btn-phone">
                        + Add Services
                    </button>
                </Link>
            </div>
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Servicer Name</th>
                            <th>Center Name</th>
                            <th>Phone No</th>
                            

                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.map((item) => {
                            return (
                                <tr key={item.id}>

                                    <td data-label="No">
                                        {item.id}
                                    </td>

                                    <td data-label="Servicer Name">
                                        {item.servicer_name}
                                    </td>

                                    <td data-label="Center Name">
                                        {item.center_name}
                                    </td>
                                    <td data-label="Phone No">
                                        {item.phone_no}
                                    </td>
                                   

                                    <td data-label="Action">
                                        <div className="action-btns">
                                        {role === "admin" && (
                                      <>


                                            <Link to={`/home/update_ser/${item.id}`}>
                                                <button className="btn-edit">
                                                    Edit
                                                </button>
                                            </Link>

                                            <button
                                                className="btn-delete"
                                                onClick={() => deleteContact(item.id)}
                                            >
                                                Delete
                                            </button>
                                            </>
                                   )}


                                            <Link to={`/home/SView/${item.id}`}>
                                                <button className="btn-view">
                                                    View
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

export default Services;