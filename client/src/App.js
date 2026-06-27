import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './pages/Home';
import AddEdit from "./pages/AddEdit";
import View from "./pages/View";
import Login from "./Login";
import Staff from "./pages/Staff";
import Password from "./pages/Password";
import Dashboard from "./pages/Dashboard";
import AddStaff from "./pages/AddStaff";
import Services from "./pages/Services";
import AddService from "./pages/AddService";
import SView from "./pages/SView";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home_l from "./pages/Home_l";
import Add from "./pages/Add";
import Home_z from "./pages/Home_z";
import Out from "./pages/Out";
import Status from "./pages/Status";
import History from "./pages/History";
import History1 from "./pages/History1";
import ReminderPage from "./pages/ReminderPage";
import StatusPage from "./pages/StatusPage";
import StatusPage1 from "./pages/StatusPage1";
import HistoryPage from "./pages/HistoryPage";
import HistoryPage1 from "./pages/HistoryPages1";
import SearchModel from "./pages/SearchModel";
import RMASummary from "./pages/RMADetails1";
import RMADetails1 from "./pages/RMADetails1";
import RMADetails from "./pages/RMADetails";
import RmaOutUpdate from "./pages/RmaOut_Update";
import RmaInUpdate from "./pages/RmaIn_Update";
import DashPending from "./pages/DashPending";
import DashPendingo from "./pages/DashPending_o";
import DashIrma from "./pages/DashIrma";
import DashOrma from "./pages/DashOrma";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="top-center" />

        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/home" element={<Home />} />
          <Route path="/home/home_l" element={<Home_l />} />
          <Route path="/home/home_z" element={<Home_z />} />
          <Route path="/home/addCustomer" element={<AddEdit />} />
          <Route path="/home/staff" element={<Staff />} />
          <Route path="/home/addstaff" element={<AddStaff />} />
          {/* <Route path="/home/get/:id" element={<AddStaff />} /> */}
          <Route path="/home/update/:id" element={<AddEdit />} />
          <Route path="/home/View/:id" element={<View />} />
          <Route path="/home/services" element={<Services />} />
          <Route path="/home/addservice" element={<AddService />} />
          <Route path="/home/update_ser/:id" element={<AddService />} />
          <Route path="/home/SView/:id" element={<SView />} />
          <Route path="/home/Add" element={<Add />} />
          <Route path="/home/update_P/:id" element={<Add />} />
          <Route path="/home/pdf/:id" element={<Add />} />
          <Route path="/home/pdf1/:id" element={<Out />} />
          <Route path="/home/Out" element={<Out />} />
          <Route path="/home/update_o/:id" element={<Out />} />
          
          <Route
            path="/home/status/:id"
            element={<Status />}
          />
          <Route path="/home/reminder/:id" element={<ReminderPage />} />

        {/* 📜 History Page */}
         <Route
          path="/status-history_lsr/:item_id"
          element={<History />}
        />
        <Route
          path="/status-history_ls/:item_id"
          element={<History1 />}
        />
        <Route
          path="/serial-history/:serial_no"
          element={<History1 />}
        />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route path="/staff/password/:id" element={<Password />} />
          <Route path="/statuspage/:item_id" element={<StatusPage />} />
          <Route path="/statuspage1/:item_id" element={<StatusPage1 />} />
           <Route path="/statuspage/:item_id/:reminder_id" element={<StatusPage />} />
           <Route path="/update-status_ls/:item_id" element={<StatusPage1 />} />
           <Route
  path="/statuspage1/:item_id/:reminder_id"
  element={<StatusPage1 />}
/>
           <Route
  path="/history/:rma_id"
  element={<HistoryPage />}

/>
          <Route
  path="/history_l/:rma_id"
  element={<HistoryPage1 />}/>
  <Route
  path="/search-model/:model_number"
  element={<SearchModel />}

/>
<Route path="/rma-summary" element={<RMASummary/>}/>
<Route path="/rma-details/:customer_id/:model_number" element={<RMASummary/>}/>
<Route
  path="/rma-details_r/:rma_no"
  element={<RMADetails />}
/>
<Route path="/rma-details/:rma_no" element={<RMADetails1/>}/>
<Route path="/update-rma-status_l/:rma_no" element={<RMADetails/>}/>
<Route path="/update-rma/:rma_no" element={<RmaOutUpdate />}/>
<Route path="/update-rma_in/:rma_no" element={<RmaInUpdate/>}/>
<Route path="/pending-serials" element={<DashPending/>}/>
<Route path="/complete-serials" element={<DashPending/>}/>

<Route path="/pending-serials_o" element={<DashPendingo />}/>
<Route path="/complete-serials_o" element={<DashPendingo />}/>
<Route path="/all-irma-data_pending" element={<DashIrma/>}/>
<Route path="/all-irma-data_complete" element={<DashIrma/>}/>
<Route path="/all-orma-data_pending" element={<DashOrma/>}/>
<Route path="/all-orma-data_complete" element={<DashOrma/>}/>
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;