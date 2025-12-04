import React, { useState } from "react";
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

// ---- General Data Pages ----
import GeneralDataAdd from "./pages/data/GeneralDataAdd";
import GeneralDataManage from "./pages/data/GeneralDataManage";

// ---- Health Data Pages ----
import HealthDataAdd from "./pages/data/HealthDataAdd";
import HealthDataManage from "./pages/data/HealthDataManage";

// History Pages
import PatientHistory from "./pages/history/PatientHistory";
import BillHistory from "./pages/history/BillHistory";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <div className="flex">
          {/* -------- Sidebar -------- */}
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          {/* -------- Page Content -------- */}
          <div
            className={`
              flex-1 min-h-screen p-6 overflow-y-auto bg-gray-100
              transition-all duration-300
              ${sidebarCollapsed ? "ml-20" : "ml-64"}
            `}
          >
            <Routes>

              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Patient Routes */}
              <Route path="/patient/manage" element={<ManagePatients />} />
              <Route path="/patient/add" element={<AddPatient />} />

              {/* Bill Routes */}
              <Route path="/bill/manage" element={<ManageBill />} />
              <Route path="/bill/add" element={<AddBill />} />

              {/* ------- Data Routes (Updated) ------- */}

              {/* General Data */}
              <Route path="/data/general/manage" element={<GeneralDataManage />} />
              <Route path="/data/general/add" element={<GeneralDataAdd />} />

              {/* Patient Health Data */}
              <Route path="/data/health/manage" element={<HealthDataManage />} />
              <Route path="/data/health/add" element={<HealthDataAdd />} />

              {/* History Routes */}
              <Route path="/history/patients" element={<PatientHistory />} />
              <Route path="/history/bills" element={<BillHistory />} />

            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
