import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./View.css";

const View = () => {

    const [user, setUser] = useState({});

    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`https://rma-management.onrender.com/api/get/${id}`)
            .then((resp) =>
                setUser({ ...resp.data })
            );
    }, [id]);
    return (
        <div className="details-container">
            <div className="details-card">

                <div className="top-section">
                    <h2>Customer Details</h2>
                
                </div>

                <div className="details-content">

                    <div className="detail-box">
                        <label>ID</label>
                        <span>{id}</span>
                    </div>

                    <div className="detail-box">
                        <label>Customer Name</label>
                        <span>{user.customer_name}</span>
                    </div>

                    <div className="detail-box">
                        <label>Company Name</label>
                        <span>{user.company_name||"null"}</span>
                    </div>

                    <div className="detail-box">
                        <label>Address</label>
                        <span>{user.address}</span>
                    </div>

                    <div className="detail-box">
                        <label>Phone</label>
                        <span>{user.phone_no}</span>
                    </div>

                    <div className="detail-box">
                        <label>GST No</label>
                        <span>{user.gst_no||"null"}</span>
                    </div>

                    <div className="detail-box">
                        <label>Location</label>
                        <span>{user.location}</span>
                    </div>

                    <div className="detail-box">
                        <label>Email</label>
                        <span>{user.email||"null"}</span>
                    </div>

                </div>

                <Link to="/home">
                    <button className="back-btn">
                        ← Go Back
                    </button>
                </Link>

            </div>
        </div>
    )
}

export default View