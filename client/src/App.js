import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./pages/ProtectedRoute";
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
import HomeL from "./pages/HomeL";
import Add from "./pages/Add";
import HomeZ from "./pages/HomeZ";
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

          <Route path="/home" element={<ProtectedRoute><Home /> </ProtectedRoute>} />
          <Route path="/home/home_l" element={<ProtectedRoute><HomeL /></ProtectedRoute>} />
          <Route path="/home/home_z" element={<ProtectedRoute><HomeZ /></ProtectedRoute>} />
          <Route path="/home/addCustomer" element={<ProtectedRoute><AddEdit /></ProtectedRoute>} />
          <Route path="/home/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/home/addstaff" element={<ProtectedRoute><AddStaff /></ProtectedRoute>} />
          {/* <Route path="/home/get/:id" element={<AddStaff />} /> */}
          <Route path="/home/update/:id" element={<ProtectedRoute><AddEdit /></ProtectedRoute>} />
          <Route path="/home/View/:id" element={<ProtectedRoute><View /></ProtectedRoute>} />
          <Route path="/home/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/home/addservice" element={<ProtectedRoute><AddService /></ProtectedRoute>} />
          <Route path="/home/update_ser/:id" element={<ProtectedRoute><AddService /></ProtectedRoute>} />
          <Route path="/home/SView/:id" element={<ProtectedRoute><SView /></ProtectedRoute>} />
          <Route path="/home/Add" element={<ProtectedRoute><Add /></ProtectedRoute>} />
          <Route path="/home/update_P/:id" element={<ProtectedRoute><Add /></ProtectedRoute>} />
          <Route path="/home/pdf/:id" element={<ProtectedRoute><Add /></ProtectedRoute>} />
          <Route path="/home/pdf1/:id" element={<ProtectedRoute><Out /></ProtectedRoute>} />
          <Route path="/home/Out" element={<ProtectedRoute><Out /></ProtectedRoute>} />
          <Route path="/home/update_o/:id" element={<ProtectedRoute><Out /></ProtectedRoute>} />
          
          <Route
            path="/home/status/:id"
            element={<ProtectedRoute><Status /></ProtectedRoute>}
          />
          <Route path="/home/reminder/:id" element={<ProtectedRoute><ReminderPage /></ProtectedRoute>} />

        {/* 📜 History Page */}
         <Route
          path="/status-history_lsr/:item_id"
          element={<ProtectedRoute><History /></ProtectedRoute>}
        />
        <Route
          path="/status-history_ls/:item_id"
          element={<ProtectedRoute><History1 /></ProtectedRoute>}
        />
        <Route
          path="/serial-history/:serial_no"
          element={<ProtectedRoute><History1 /></ProtectedRoute>}
        />
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute> }/>
          <Route path="/staff/password/:id" element={<ProtectedRoute><Password /></ProtectedRoute>} />
          <Route path="/statuspage/:item_id" element={<ProtectedRoute><StatusPage /></ProtectedRoute>} />
          <Route path="/statuspage1/:item_id" element={<ProtectedRoute><StatusPage1 /></ProtectedRoute>} />
           <Route path="/statuspage/:item_id/:reminder_id" element={<ProtectedRoute><StatusPage /></ProtectedRoute>} />
           <Route path="/update-status_ls/:item_id" element={<ProtectedRoute><StatusPage1 /></ProtectedRoute>} />
           <Route
  path="/statuspage1/:item_id/:reminder_id"
  element={<ProtectedRoute><StatusPage1 /></ProtectedRoute>}
/>
           <Route
  path="/history/:rma_id"
  element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}

/>
          <Route
  path="/history_l/:rma_id"
  element={<ProtectedRoute><HistoryPage1 /></ProtectedRoute>}/>
  <Route
  path="/search-model/:model_number"
  element={<ProtectedRoute><SearchModel /></ProtectedRoute>}

/>
<Route path="/rma-summary" element={<ProtectedRoute><RMASummary/></ProtectedRoute>}/>
<Route path="/rma-details/:customer_id/:model_number" element={<ProtectedRoute><RMASummary/></ProtectedRoute>}/>
<Route
  path="/rma-details_r/:rma_no"
  element={<ProtectedRoute><RMADetails /></ProtectedRoute>}
/>
<Route path="/rma-details/:rma_no" element={<ProtectedRoute><RMADetails1/></ProtectedRoute>}/>
<Route path="/update-rma-status_l/:rma_no" element={<ProtectedRoute><RMADetails/></ProtectedRoute>}/>
<Route path="/update-rma/:rma_no" element={<ProtectedRoute><RmaOutUpdate /></ProtectedRoute>}/>
<Route path="/update-rma_in/:rma_no" element={<ProtectedRoute><RmaInUpdate/></ProtectedRoute>}/>
<Route path="/pending-serials" element={<ProtectedRoute><DashPending/></ProtectedRoute>}/>
<Route path="/complete-serials" element={<ProtectedRoute><DashPending/></ProtectedRoute>}/>

<Route path="/pending-serials_o" element={<ProtectedRoute><DashPendingo /></ProtectedRoute>}/>
<Route path="/complete-serials_o" element={<ProtectedRoute><DashPendingo /></ProtectedRoute>}/>
<Route path="/all-irma-data_pending" element={<ProtectedRoute><DashIrma/></ProtectedRoute>}/>
<Route path="/all-irma-data_complete" element={<ProtectedRoute><DashIrma/></ProtectedRoute>}/>
<Route path="/all-orma-data_pending" element={<ProtectedRoute><DashOrma/></ProtectedRoute>}/>
<Route path="/all-orma-data_complete" element={<ProtectedRoute><DashOrma/></ProtectedRoute>}/>
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;