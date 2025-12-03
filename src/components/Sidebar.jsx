import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  Menu,
  ChevronDown,
  User,
  Database,
  Receipt,
  Home,    // <<---- Added
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const [patientOpen, setPatientOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  const location = useLocation();

  // Auto-open dropdown based on route
  useEffect(() => {
    if (location.pathname.startsWith("/patient")) setPatientOpen(true);
    if (location.pathname.startsWith("/bill")) setBillOpen(true);
    if (location.pathname.startsWith("/data")) setDataOpen(true);
  }, [location.pathname]);

  // Collapse dropdowns when sidebar shrinks
  useEffect(() => {
    if (!open) {
      setPatientOpen(false);
      setBillOpen(false);
      setDataOpen(false);
    }
  }, [open]);

  const dropdownStyle = (isOpen) => ({
    height: isOpen && open ? "80px" : "0px",
    opacity: isOpen && open ? 1 : 0,
    transition: "all 0.3s ease",
    overflow: "hidden",
  });

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-white shadow-xl transition-all duration-300 p-4 flex flex-col border-r`}
    >

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 mb-6 rounded-lg hover:bg-gray-200"
      >
        <Menu className="w-6 h-6" />
      </button>

      <nav className="space-y-4">

        {/* ---------------------- Dashboard Button ---------------------- */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center w-full gap-3 p-3 rounded-xl transition 
              ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`
          }
        >
          <Home className="w-6 h-6" />
          {open && <span className="text-lg font-medium">Dashboard</span>}
        </NavLink>

        {/* ---------------- Patient Details ---------------- */}
        <div>
          <button
            onClick={() => setPatientOpen(!patientOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-xl transition
              hover:bg-gray-100
              ${location.pathname.startsWith("/patient") && open ? "bg-blue-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              {open && <span className="text-lg font-medium">Patient Details</span>}
            </div>

            {open && (
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  patientOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          <div className="ml-10" style={dropdownStyle(patientOpen)}>
            <NavLink
              to="/patient/manage"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 mt-2 rounded-lg transition
                 ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:text-black"}`
              }
            >
              <FileText className="w-4 h-4" /> Manage
            </NavLink>

            <NavLink
              to="/patient/add"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg transition
                 ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:text-black"}`
              }
            >
              <PlusCircle className="w-4 h-4" /> Add
            </NavLink>
          </div>
        </div>

        {/* ---------------- Medical Bill ---------------- */}
        <div>
          <button
            onClick={() => setBillOpen(!billOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-xl transition 
              hover:bg-gray-100
              ${location.pathname.startsWith("/bill") && open ? "bg-blue-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6" />
              {open && <span className="text-lg font-medium">Medical Bill</span>}
            </div>

            {open && (
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  billOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          <div className="ml-10" style={dropdownStyle(billOpen)}>
            <NavLink
              to="/bill/manage"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 mt-2 rounded-lg transition
                   ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:text-black"}`
              }
            >
              <FileText className="w-4 h-4" /> Manage
            </NavLink>

            <NavLink
              to="/bill/add"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg transition
                   ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:text-black"}`
              }
            >
              <PlusCircle className="w-4 h-4" /> Add
            </NavLink>
          </div>
        </div>

        {/* ---------------- Data ---------------- */}
        <div>
          <button
            onClick={() => setDataOpen(!dataOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-xl transition 
              hover:bg-gray-100
              ${location.pathname.startsWith("/data") && open ? "bg-blue-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6" />
              {open && <span className="text-lg font-medium">Data</span>}
            </div>

            {open && (
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  dataOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          <div className="ml-10" style={dropdownStyle(dataOpen)}>
            <NavLink
              to="/data/manage"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 mt-2 rounded-lg transition
                   ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:text-black"}`
              }
            >
              <FileText className="w-4 h-4" /> Manage
            </NavLink>

            <NavLink
              to="/data/add"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg transition
                   ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:text-black"}`
              }
            >
              <PlusCircle className="w-4 h-4" /> Add
            </NavLink>
          </div>
        </div>

      </nav>
    </div>
  );
}
