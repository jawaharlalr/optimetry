import { NavLink, useLocation } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  ChevronDown,
  User,
  Database,
  Receipt,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const location = useLocation();

  const [patientOpen, setPatientOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  // Auto expand dropdowns based on current route
  useEffect(() => {
    setPatientOpen(location.pathname.startsWith("/patient"));
    setBillOpen(location.pathname.startsWith("/bill"));
    setDataOpen(location.pathname.startsWith("/data"));
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 w-64 h-screen p-4 bg-white border-r shadow-lg">

      {/* -------- Dashboard -------- */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-xl transition ${
            isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
          }`
        }
      >
        <Home className="w-6 h-6" />
        <span className="text-lg font-medium">Dashboard</span>
      </NavLink>

      {/* -------- Patient Section -------- */}
      <div className="mt-4">
        <button
          onClick={() => setPatientOpen(!patientOpen)}
          className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <User className="w-6 h-6" />
            <span className="text-lg font-medium">Patient Details</span>
          </div>

          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              patientOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {patientOpen && (
          <div className="mt-2 ml-10 space-y-2">
            <NavLink
              to="/patient/manage"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:text-black"
                }`
              }
            >
              <FileText className="w-4 h-4" /> Manage
            </NavLink>

            <NavLink
              to="/patient/add"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:text-black"
                }`
              }
            >
              <PlusCircle className="w-4 h-4" /> Add
            </NavLink>
          </div>
        )}
      </div>

      {/* -------- Bill Section -------- */}
      <div className="mt-4">
        <button
          onClick={() => setBillOpen(!billOpen)}
          className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6" />
            <span className="text-lg font-medium">Medical Bill</span>
          </div>

          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              billOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {billOpen && (
          <div className="mt-2 ml-10 space-y-2">
            <NavLink
              to="/bill/manage"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:text-black"
                }`
              }
            >
              <FileText className="w-4 h-4" /> Manage
            </NavLink>

            <NavLink
              to="/bill/add"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:text-black"
                }`
              }
            >
              <PlusCircle className="w-4 h-4" /> Add
            </NavLink>
          </div>
        )}
      </div>

      {/* -------- Data Section -------- */}
      <div className="mt-4">
        <button
          onClick={() => setDataOpen(!dataOpen)}
          className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6" />
            <span className="text-lg font-medium">Data</span>
          </div>

          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              dataOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dataOpen && (
          <div className="mt-2 ml-10 space-y-2">
            <NavLink
              to="/data/manage"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:text-black"
                }`
              }
            >
              <FileText className="w-4 h-4" /> Manage
            </NavLink>

            <NavLink
              to="/data/add"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:text-black"
                }`
              }
            >
              <PlusCircle className="w-4 h-4" /> Add
            </NavLink>
          </div>
        )}
      </div>

    </div>
  );
}
