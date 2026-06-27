import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import "./View.css";

const SView = () => {
    const [user, setUser] = useState({});

    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getservice/${id}`)
            .then((resp) => setUser({ ...resp.data }))
    }, [id]);
    return (
        <div className="details-container">
            <div className="details-card">

                <div className="top-section">
                    <h2>Service Details</h2>
                
                </div>

                <div className="details-content">

                    <div className="detail-box">
                        <label>ID</label>
                        <span>{id}</span>
                    </div>

                    <div className="detail-box">
                        <label>Servicer Name</label>
                        <span>{user.servicer_name}</span>
                    </div>

                    <div className="detail-box">
                        <label>Center Name</label>
                        <span>{user.center_name}</span>
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
                        <label>Mobile No</label>
                        <span>{user.mobile}</span>
                    </div>

                    <div className="detail-box">
                        <label>Location</label>
                        <span>{user.location}</span>
                    </div>

                    <div className="detail-box">
                        <label>Email</label>
                        <span>{user.email}</span>
                    </div>

                </div>

                <Link to="/home/services">
                    <button className="back-btn">
                        ← Go Back
                    </button>
                </Link>

            </div>
        </div>
    )
}

export default SView;