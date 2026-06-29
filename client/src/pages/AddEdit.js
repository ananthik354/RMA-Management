import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddEdit.css";
import { Link, useParams } from "react-router-dom";


const AddEdit = () => {

    const initialState = {
        customer_name: "",
        company_name: "",
        address: "",
        phone_no: "",
        gst_no: "",
        location: "",
        email: ""
    };

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    //     const handleSubmit = () => {
    //         if (!validatePhone(phoneNo)) {
    //             alert("Phone number must contain exactly 10 digits");
    //             return;
    //         }
    // // 
    //         // API call
    //     };

    const [state, setState] = useState(initialState);
    const { id } = useParams();
    useEffect(() => {
        axios.get(`https://rma-management.onrender.com/api/get/${id}`)
            .then((resp) => setState({ ...resp.data }))
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
            customer_name,
            address,
            phone_no,
            location
        } = state;

        // Required validation
        if (
            !customer_name ||
            !address ||
            !phone_no ||
            !location
        ) {
            toast.error(
                "Customer Name, Address, Phone No and Location are required"
            );
            
        }

        if (!validatePhone(phone_no)) {
            toast.error("Phone number must contain exactly 10 digits");
            return;
        }
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (state.email && !emailRegex.test(state.email)) {
    alert("Invalid Email");
    return;
}
        else {
            if (!id) {

                try {
                    await axios.post(
                        "https://rma-management.onrender.com/api/post",
                        state
                    );

                    toast.success("Customer Added");

                    setState(initialState);

                } catch (error) {
                    toast.error("Error adding customer");
                }
            } else {

                try {
                    await axios.put(
                        `https://rma-management.onrender.com/api/update/${id}`,
                        state
                    );

                    toast.success("Customer updated");

                    setState(initialState);

                } catch (error) {
                    toast.error("Error updating customer");
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
                    {id ? "Update Customer" : "Add Customer"}
                </h2>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Customer Name <span className="required">*</span></label>
                        <input
                            type="text"
                            name="customer_name"
                            value={state.customer_name || ""}
                            onChange={handleInputChange}
                           
                        />
                    </div>

                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={state.company_name || ""}
                            onChange={handleInputChange}
                           
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Address<span className="required">*</span></label>
                        <textarea
                            name="address"
                            value={state.address || ""}
                            onChange={handleInputChange}
                            
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone No<span className="required">*</span></label>
                        <input
                            type="text"
                            name="phone_no"
                            value={state.phone_no || ""}
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
                        <label>GST No</label>
                        <input
                            type="text"
                            name="gst_no"
                            value={state.gst_no || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Location<span className="required">*</span></label>
                        <input
                            type="text"
                            name="location"
                            value={state.location || ""}
                            onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={state.email || ""}
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

                    <Link to="/home" style={{ flex: 1 }}>
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


export default AddEdit;