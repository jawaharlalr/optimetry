import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import Dashboard from "./components/Dashboard";

// Patient Pages
import AddPatient from "./pages/patient/AddPatient";
import ManagePatients from "./pages/patient/ManagePatients";

// Bill Pages
import AddBill from "./pages/bill/AddBill";
import ManageBill from "./pages/bill/ManageBill";

// Data Pages
import AddData from "./pages/data/AddData";
import ManageData from "./pages/data/ManageData";

function App() {
  return (
    <>
      {/* Toast Notification System */}
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>
          
          {/* Dashboard Layout with Nested Routes */}
          <Route path="/" element={<Dashboard />}>

            {/* Patient Routes */}
            <Route path="patient/manage" element={<ManagePatients />} />
            <Route path="patient/add" element={<AddPatient />} />

            {/* Bill Routes */}
            <Route path="bill/manage" element={<ManageBill />} />
            <Route path="bill/add" element={<AddBill />} />

            {/* Data Routes */}
            <Route path="data/manage" element={<ManageData />} />
            <Route path="data/add" element={<AddData />} />

            {/* Default Page Inside Dashboard */}
            <Route path="" element={<ManagePatients />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
