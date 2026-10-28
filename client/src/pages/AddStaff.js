import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddStaff.css";
import { Link, useParams } from "react-router-dom";


const AddStaff = () => {

    const initialState = {
        username: "",
        password: "",
        role: ""
    };

    const [state, setState] = useState(initialState);
    const { id } = useParams();
    useEffect(() => {
        axios.get(`https://rma-management.onrender.com/api/get_staff/${id}`)
            .then((resp) => setState({ ...resp.data[0] }))
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

    const { username, password, role } = state;

    if (!username.trim() || !role) {
        toast.error("Username and role are required");
        return;
    }

    if (!id && !password) {
        toast.error("Password is required");
        return;
    }

    try {
        if (!id) {
            // Add new staff
            await axios.post(
                "https://rma-management.onrender.com/api/addstaff",
                { username, password, role }
            );

            toast.success("Staff added");
            setState(initialState);
        } else {
            // Edit staff: update ONLY username and role
            await axios.put(
                `https://rma-management.onrender.com/api/editstaff/${id}`,
                { username, role }
            );

            toast.success("Staff updated");

            window.location.href = "/home/staff";
        }
    } catch (error) {
        console.error("Staff save error:", error);

        toast.error(
            error.response?.data?.message ||
            (id ? "Error updating staff" : "Error adding staff")
        );
    }
};


    return (
        <div className="page-wrapper">
            <form
                className="form-container"
                onSubmit={handleSubmit}
            >
                <h2 className="form-title">
                    {id
                        ? "Update Staff"
                        : "Add Staff"}
                </h2>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={state.username || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    
{!id && (
    <div className="form-group">
        <label>Password</label>
        <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleInputChange}
            required
            autoComplete="new-password"
        />
    </div>
)}


                    <div className="form-group role-center">
                        <label>Role</label>

                        <select
                            name="role"
                            value={state.role || ""}
                            onChange={handleInputChange}
                            className="role-select"
                        >
                            <option value="">
                                Select Role
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                            <option value="user">
                                User
                            </option>
                        </select>
                    </div>

                </div>

                <div className="button-group">
                    <input
                        type="submit"
                        className="submit-btn"
                        value={
                            id
                                ? "Update"
                                : "Save"
                        }
                    />

                    <Link
                        to="/home/staff"
                        style={{
                            flex: 1
                        }}
                    >
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


export default AddStaff;