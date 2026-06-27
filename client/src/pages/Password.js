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

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [state,
        setState] =
        useState({
            username: "",
            password: "",
            confirmPassword: ""
        });

    // Get username by id
    useEffect(() => {

    axios
        .get(
            `http://localhost:5000/api/password/${id}`
        )
        .then((resp) => {

            console.log(
                resp.data
            );

            setState({
                username:
                    resp.data
                        .username,
                password: "",
                confirmPassword:
                    ""
            });

        })
        .catch((err) => {
            console.log(err);
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

            await axios.put(
                `http://localhost:5000/api/password/${id}`,
                {
                    password:
                        state.password
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