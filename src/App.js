import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout Components
import Sidebar from "./components/Sidebar";

// Dashboard Page
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
      <Toaster position="top-right" />

      <BrowserRouter>

        {/* Main App Layout */}
        <div className="flex">

          {/* -------- Permanent Sidebar -------- */}
          <Sidebar />

          {/* -------- Page Content -------- */}
          <div className="flex-1 min-h-screen p-6 ml-64 overflow-y-auto bg-gray-100">

            <Routes>

              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Patient Routes */}
              <Route path="/patient/manage" element={<ManagePatients />} />
              <Route path="/patient/add" element={<AddPatient />} />

              {/* Bill Routes */}
              <Route path="/bill/manage" element={<ManageBill />} />
              <Route path="/bill/add" element={<AddBill />} />

              {/* Data Routes */}
              <Route path="/data/manage" element={<ManageData />} />
              <Route path="/data/add" element={<AddData />} />

            </Routes>
          </div>

        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
