import React, {
    useEffect,
    useState
} from "react";
import "./Password.css";
import axios from "axios";

import {
    toast
} from "react-toastify";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

const Password = () => {

    const navigate =useNavigate();

    const { id } =useParams();

    const [state,
        setState] =
        useState({
            username: "",
            password: "",
            confirmPassword: ""
        });

    // Get username by id
    
useEffect(() => {
    const token = localStorage.getItem("token");

    if (!id) {
        toast.error("User ID is missing");
        return;
    }

    axios.get(
        `https://rma-management.onrender.com/api/password/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then((resp) => {
        console.log("Username:", resp.data);

        setState(prev => ({
            ...prev,
            username: resp.data.username
        }));
    })
    .catch((err) => {
        console.error(
            "Username fetch error:",
            err.response?.status,
            err.response?.data
        );

        toast.error("Unable to load username");
    });

}, [id]);

    // Input change
    const handleInputChange =
        (e) => {

        const {
            name,
            value
        } = e.target;

        setState({
            ...state,
            [name]: value
        });
    };

    // Submit
    const handleSubmit =
        async (e) => {

        e.preventDefault();

        if (
            !state.password
        ) {
            toast.error(
                "Enter Password"
            );

            return;
        }

        if (
            state.password !==
            state.confirmPassword
        ) {
            toast.error(
                "Password does not match"
            );

            return;
        }

        try {

            const token = localStorage.getItem("token");

await axios.put(
    `https://rma-management.onrender.com/api/password/${id}`,
    {
        password: state.password
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

            toast.success(
                "Password Updated Successfully"
            );

            setTimeout(() => {

                navigate(
                    "/home/staff"
                );

            }, 1500);

        } catch (
            error
        ) {

            console.log(
                error
            );

            toast.error(
                "Update Failed"
            );
        }
    };

    return (
    <div className="password-wrapper">
        <div className="password-container">

            <h1 className="password-title">
                Reset Password
            </h1>

            <form
                onSubmit={
                    handleSubmit
                }
                className="password-form"
            >

                {/* Username */}
                <div className="form-group">
                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        name="username"
                        value={
                            state.username
                        }
                        readOnly
                    />
                </div>

                {/* Password */}
                <div className="form-group">
                    <label>
                        New Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter New Password"
                        value={
                            state.password
                        }
                        onChange={
                            handleInputChange
                        }
                    />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <label>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={
                            state.confirmPassword
                        }
                        onChange={
                            handleInputChange
                        }
                    />
                </div>

                <div className="button-group">

                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        Update Password
                    </button>

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
    </div>
);
};

export default Password;