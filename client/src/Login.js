import React, {
    useState
} from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
    useNavigate
} from "react-router-dom";

import logo from "./image/logo.png";
import "./Login.css";

function Login() {

    const [
        username,
        setUsername
    ] = useState("");

    const [
        password,
        setPassword
    ] = useState("");

    const navigate =
        useNavigate();

    function handleSubmit(
        event
    ) {

        event.preventDefault();

        axios
            .post(
                "http://localhost:5000/login",
                {
                    username,
                    password
                }
            )
            .then((res) => {

                if (
                    res.data
                        .message ===
                    "Login Successfully"
                ) {

                    localStorage.setItem(
                        "role",
                        res.data.role
                    );
                    localStorage.setItem("username", res.data.username);

                    localStorage.setItem(
                        "id",
                        res.data.id
                    );

                    navigate(
                        "/Dashboard"
                    );

                } else {

                    alert(
                        "Invalid Username or Password"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="login-page">

            <div className="login-card">

                <img
                    src={logo}
                    alt="logo"
                    className="logo"
                />

                <h2>
                    MK Electronic
                </h2>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="input-group-custom">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter Username"
                            className="form-control"
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="input-group-custom">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <button
                        className="login-btn"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;