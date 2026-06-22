import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddEdit.css";
import { Link, useParams } from "react-router-dom";


const AddService = () => {

    const initialState = {
        servicer_name: "",
        center_name: "",
        address: "",
        phone_no: "",
        mobile: "",
        location: "",
        email: ""
    };

    const [state, setState] = useState(initialState);
    const { id } = useParams();

     const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    useEffect(() => {
    axios
        .get(
            `http://localhost:5000/api/getservice/${id}`
        )
        .then((resp) => {
            console.log(resp.data);
            setState(resp.data[0]);
        })
        .catch((err) => console.log(err));
    }, [id]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setState({
            ...state,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            servicer_name,
            center_name,
            address,
            phone_no,
            mobile,
            location
        } = state;

        // Required validation
        if (
            !servicer_name ||
            !center_name||
            !address ||
            !phone_no ||
            !location
        ) {
            toast.error(
                "Servicer Name, center Name,Address, Phone No and Location are required"
            );
            
        }
        if (!validatePhone(phone_no,mobile)) {
                    toast.error("Phone number must contain exactly 10 digits");
                    return;
                }
                const emailRegex =
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                        if (!emailRegex.test(state.email)) {
                            toast.error("Invalid Email Address");
                            return;
                        }
        else {
            if (!id) {

                try {
                    await axios.post(
                        "http://localhost:5000/api/service_d",
                        state
                    );

                    toast.success("service details Added");

                    setState(initialState);

                } catch (error) {
                    toast.error("Error adding details");
                }
            } else {

                try {
                    await axios.put(
                        `http://localhost:5000/api/update_ser/${id}`,
                        state
                    );

                    toast.success("Service details updated");

                    setState(initialState);

                } catch (error) {
                    toast.error("Error updating details");
                }
            }
        }

    };


    return (
        <div className="page-wrapper">
            <form
                className="form-container"
                onSubmit={handleSubmit}
            >
                <h2 className="form-title">
                    {id ? "Update Service Details" : "Add Service Details"}
                </h2>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Servicer Name</label>
                        <input
                            type="text"
                            name="servicer_name"
                            value={state?.servicer_name|| ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Center Name</label>
                        <input
                            type="text"
                            name="center_name"
                            value={state?.center_name || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={state?.address || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone No1</label>
                        <input
                            type="text"
                            name="phone_no"
                            value={state?.phone_no || ""}
                            maxLength={10}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // allow digits only

                                if (value.length <= 10) {
                                    setState({
                                        ...state,
                                        phone_no: value
                                    });
                                }
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone No2</label>
                        <input
                            type="text"
                            name="mobile"
                            value={state?.mobile || ""}
                            maxLength={10}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // allow digits only

                                if (value.length <= 10) {
                                    setState({
                                        ...state,
                                        mobile: value
                                    });
                                }
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={state?.location || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={state?.email || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="button-group">
                    <input
                        type="submit"
                        className="submit-btn"
                        value={id ? "Update" : "Save"}
                    />

                    <Link to="/home/services" style={{ flex: 1 }}>
                        <button
                            type="button"
                            className="back-btn"
                        >
                            Go Back
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}


export default AddService;