import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { toast } from "react-toastify";
import axios from "axios";

const Home = () => {
    const [data, setData] = useState([]);

    const loadData = async () => {
        const response = await axios.get(
            "http://localhost:5000/api/get"
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
                await axios.delete(`http://localhost:5000/api/remove/${id}`);
                toast.success("customer deleted successfully");
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

   
      <Link to="/home/addCustomer">
        <button className="btn-phone">
          + Add Customer
        </button>
      </Link>
    </div>

    <div className="table-wrapper">
      <table className="styled-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Customer Name</th>
            <th>Company Name</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <td data-label="No">
                  {index + 1}
                </td>

                <td data-label="Customer Name">
                  {item.customer_name}
                </td>

                <td data-label="Company Name">
                  {item.company_name}
                </td>

                <td data-label="Phone Number">
                  {item.phone_no}
                </td>

                <td data-label="Action">
                  <div className="action-btns">

                    {role === "admin" && (
                      <>
                        <Link to={`/home/update/${item.id}`}>
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

                    <Link to={`/home/View/${item.id}`}>
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

export default Home;