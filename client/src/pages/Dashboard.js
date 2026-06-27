import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaHome, FaUserTie, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const[pencount,setPencount]=useState(0);
  const[comcount,setComcount]=useState(0);
const[outpencount,setOutpencount]=useState(0);
const[outcomcount,setOutcomcount]=useState(0);

const[irmapencount,setIrmapencount]=useState(0);
  const[irmacomcount,setIrmacomcount]=useState(0);
const[rmaoutpencount,setRmaoutpencount]=useState(0);
const[rmaoutcomcount,setRmaoutcomcount]=useState(0);

  const role = localStorage.getItem("role");
  const nav = useNavigate();

  const [rmaReminders, setRmaReminders] = useState([]);
const [outReminders, setOutReminders] = useState([]);

const [reminders, setReminders] =
    useState([]);
    const [inreminders, setInreminders] =
    useState([]);

const loadReminders = async () => {

    const res = await axios.get(
        "https://rma-management.onrender.com/reminders_ls"
    );

    setReminders(res.data);

};

useEffect(() => {
    loadReminders_l();
}, []);



const loadReminders_l = async () => {

    const res = await axios.get(
        "https://rma-management.onrender.com/reminders_lsr"
    );

    setInreminders(res.data);

};

const openStatus = (item) => {
    console.log(item);
};

const [selectedItem, setSelectedItem] =
    useState(null);

const [statusText, setStatusText] =
    useState("");

useEffect(() => {
    loadReminders();
}, []);

  // ✅ LOAD REMINDERS
  useEffect(() => {
  axios.get("https://rma-management.onrender.com/reminders")
    .then((res) => {
      console.log("RMA:", res.data);
      setRmaReminders(res.data);
    })
    .catch((err) => console.log(err));
}, []);
 console.log("OUT:", rmaReminders);
useEffect(() => {
  axios.get("https://rma-management.onrender.com/reminders_l")
    .then((res) => {
      console.log("OUT:", res.data);
      setOutReminders(res.data);
    })
    .catch((err) => console.log(err));
}, []);

// ✅ GET pending COUNT
  const getPendingCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/InwardCount"
      );
      setPencount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getPendingCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ✅ GET Inward  complete COUNT
  const getCompleteCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/CompleteCount"
      );
      setComcount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getCompleteCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

    // ✅ GET Outward pending COUNT
  const getOutcompleteCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/CompleteCount_o"
      );
      setOutcomcount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getOutcompleteCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getOutpendingCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/OutwardCount"
      );
      setOutpencount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
   // loadReminders();
    getOutpendingCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);


   // ✅ GET Outward complete RMA COUNT
  const getRmaOutcompleteCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/completeCount_orma"
      );
      setRmaoutcomcount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getRmaOutcompleteCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRmaOutpendingCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/pendingCount_orma"
      );
      setRmaoutpencount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getRmaOutpendingCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ✅ GET Inward complete RMA COUNT
  const getIrmacompleteCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/completeCount_irma"
      );
      setIrmacomcount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getIrmacompleteCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getIrmapendingCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/pendingCount_irma"
      );
      setIrmapencount(resp.data.total);
      
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getIrmapendingCount();
  const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ✅ GET CUSTOMER COUNT
  const getCustomerCount = async () => {
    try {
      const resp = await axios.get(
        "https://rma-management.onrender.com/api/customerCount"
      );
      setCount(resp.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
   // loadReminders();
    getCustomerCount();


    

    // auto refresh dashboard every 10 sec
    const interval = setInterval(() => {
     // loadReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">MK Electronic</h2>

        <ul className="menu">
          <li>
            <Link to="/dashboard">
              <FaHome /> Dashboard
            </Link>
          </li>

          <li>
            <Link to="/home">
              <FaUsers /> Customers
            </Link>
          </li>
          <li>
            <Link to="/home/services">
              <FaUserTie /> Service
            </Link>
          </li>

          <li>
            <Link to="/home/home_l">
              <FaUsers /> RMA-Inward
            </Link>
          </li>

          <li>
            <Link to="/home/home_z">
              <FaUsers /> RMA-Outward
            </Link>
          </li>

          {role === "admin" && (
            <li>
              <Link to="/home/staff">
                <FaUserTie /> Staff
              </Link>
            </li>
          )}

          

          <li>
            <Link to="/">
              <FaSignOutAlt /> Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-row">
          
          {/* Customer Card */}
          <div className="total-card" 
          onClick={() => nav("/home")}
    >
            <h2>{count}</h2>
            <p>Total Customers</p>
          </div>
          </div>
          {/* //pending Inward count */}
          <div className="dashboard-row">
          <div
          className="total-card"
      onClick={() => nav("/pending-serials")}
      style={{ cursor: "pointer" }}>
            <h2>{pencount}</h2>
            <p>Pending Serial Inward</p>
          </div>

          {/* //complete inward  count */}
          <div
          className="total-card"
      onClick={() => nav("/complete-serials")}
      style={{ cursor: "pointer" }}>
            <h2>{comcount}</h2>
            <p>completed Serial Inward</p>
          </div>
          {/* //pending Rma-in count */}
        
          <div className="total-card"
          
      onClick={() => nav("/all-irma-data_pending")}
      style={{ cursor: "pointer" }}>
            <h2>{irmapencount}</h2>
            <p>Pending RMA Inward</p>
          </div>

          {/* //complete Rma-in count */}
          <div className="total-card"
        
      onClick={() => nav("/all-irma-data_complete")}
      style={{ cursor: "pointer" }}>
            <h2>{irmacomcount}</h2>
            <p>completed RMA Inward</p>
          </div>
         
</div>
<div className="dashboard-row">
         {/* //pending outward count */}
          <div
          className="total-card"
      onClick={() => nav("/pending-serials_o")}
      style={{ cursor: "pointer" }}>
            <h2>{outpencount}</h2>
            <p>Pending Serial Outward</p>
          </div>

          {/* //complete outward count */}
          <div 
          className="total-card"
      onClick={() => nav("/complete-serials_o")}
      style={{ cursor: "pointer" }}>
            <h2>{outcomcount}</h2>
            <p>completed Serial Outward</p>
          </div>

          {/* //pending Rma-out count */}
          <div className="total-card"
          
      onClick={() => nav("/all-orma-data_pending")}
      style={{ cursor: "pointer" }}>
            <h2>{rmaoutpencount}</h2>
            <p>Pending RMA Outward</p>
          </div>

          {/* //complete Rma-outcount */}
          <div className="total-card"
          
      onClick={() => nav("/all-orma-data_complete")}
      style={{ cursor: "pointer" }}>
            <h2>{rmaoutcomcount}</h2>
            <p>completed RMA Outward</p>
          </div>
</div>

          {/* Reminder Section */}
          {/* <div className="reminder-section">
            <h2>RMA-OutWard Reminders</h2>

            {reminders.length === 0 ? (
  <p>No active reminders</p>
) : (

<table className="table table-bordered">

  <thead>
    <tr>
      <th>RMA No</th>
      <th>Serial No</th>
      <th>Reminders</th> */}
      {/* <th>Status</th>
      <th>Action</th> */}
    {/* </tr>
  </thead>

  <tbody>

    {reminders.map((item) => (

      <tr key={item.reminder_id}>

        <td>{item.rma_no}</td>

        <td>{item.serial_no}</td>

        <td>
  {item.reminder_day} Day Reminder

  <button
    className="btn btn-warning btn-sm ms-2"
    onClick={() =>
      nav(`/statuspage1/${item.item_id}/${item.reminder_id}`)
    }
  >
    Update Status
  </button>
</td>

        {/* <td>{item.item_status}</td> */}
{/* 
        <td>

          <button
            className="btn btn-warning btn-sm"
            onClick={() =>
              openStatus(item)
            }
          >
            Update
          </button>

        </td> 

      </tr>

    ))}

  </tbody>

</table>

)}

    </div> */}
    <div className="dashboard-row">
{role === "admin" && (
                      <>
    <div className="reminder-section">
            <h2>RMA-InWard Reminders</h2>

            {inreminders.length === 0 ? (
  <p>No active reminders</p>
) : (

<table className="table table-bordered">

  <thead>
    <tr>
      <th>RMA No</th>
      <th>Serial No</th>
      <th>Reminders</th>
      {/* <th>Status</th>
      <th>Action</th> */}
    </tr>
  </thead>

  <tbody>

    {inreminders.map((item) => (

      <tr key={item.reminder_id}>

        <td>{item.rma_no}</td>

        <td>{item.serial_no}</td>

        <td>
  {item.reminder_day} Day Reminder

  <button
    className="btn btn-warning btn-sm ms-2"
    onClick={() =>
      nav(`/statuspage/${item.item_id}/${item.reminder_id}`)
    }
  >
    Update Status
  </button>
</td>

        {/* <td>{item.item_status}</td>

        <td>

          <button
            className="btn btn-warning btn-sm"
            onClick={() =>
              openStatus(item)
            }
          >
            Update
          </button>

        </td> */}

      </tr>

    ))}

  </tbody>

</table>

)}

    </div></>)}
    </div>
    </div>
    </div>

  );
};

export default Dashboard;