import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import "./Topbar.css";

const Topbar = ({ onLogout }) => {
    const username = localStorage.getItem("username") || "User";

    return (
        <div className="topbar">

            <div className="topbar-left">
                <h3>Dashboard</h3>
            </div>

            <div className="topbar-right">

                <span className="topbar-user">
                    {username}
                </span>

                <button
                    className="topbar-logout"
                    onClick={onLogout}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

            </div>

        </div>
    );
};

export default Topbar;