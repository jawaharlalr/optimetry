import { NavLink, useLocation } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  ChevronDown,
  User,
  Database,
  Receipt,
  Home,
  History,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const location = useLocation();

  const [patientOpen, setPatientOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setPatientOpen(location.pathname.startsWith("/patient"));
    setBillOpen(location.pathname.startsWith("/bill"));
    setDataOpen(location.pathname.startsWith("/data"));
    setHistoryOpen(location.pathname.startsWith("/history"));
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 w-64 h-screen p-4 text-white bg-blue-900 shadow-xl">

      {/* -------- Dashboard -------- */}
      <SidebarItem to="/" icon={<Home />} label="Dashboard" />

      {/* -------- Patient Section -------- */}
      <Dropdown
        isOpen={patientOpen}
        toggle={() => setPatientOpen(!patientOpen)}
        icon={<User />}
        label="Patient Details"
        links={[
          { to: "/patient/manage", label: "Manage", icon: <FileText size={16} /> },
          { to: "/patient/add", label: "Add", icon: <PlusCircle size={16} /> },
        ]}
      />

      {/* -------- Bill Section -------- */}
      <Dropdown
        isOpen={billOpen}
        toggle={() => setBillOpen(!billOpen)}
        icon={<Receipt />}
        label="Medical Bill"
        links={[
          { to: "/bill/manage", label: "Manage", icon: <FileText size={16} /> },
          { to: "/bill/add", label: "Add", icon: <PlusCircle size={16} /> },
        ]}
      />

      {/* -------- Data Section -------- */}
      <Dropdown
        isOpen={dataOpen}
        toggle={() => setDataOpen(!dataOpen)}
        icon={<Database />}
        label="Data"
        links={[
          // ⭐ General Data
          { to: "/data/general/manage", label: "Manage General Data", icon: <FileText size={16} /> },
          { to: "/data/general/add", label: "Add General Data", icon: <PlusCircle size={16} /> },

          // ⭐ Patient Health Data
          { to: "/data/health/manage", label: "Manage Health Data", icon: <FileText size={16} /> },
          { to: "/data/health/add", label: "Add Health Data", icon: <PlusCircle size={16} /> },
        ]}
      />

      {/* -------- History Section -------- */}
      <Dropdown
        isOpen={historyOpen}
        toggle={() => setHistoryOpen(!historyOpen)}
        icon={<History />}
        label="History"
        links={[
          { to: "/history/patients", label: "Patient History", icon: <User size={16} /> },
          { to: "/history/bills", label: "Bill History", icon: <Receipt size={16} /> },
          { to: "/history/data", label: "Data History", icon: <Database size={16} /> },
        ]}
      />

    </div>
  );
}

/* ---------------- Sidebar Item Component ---------------- */

function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition
        ${isActive ? "bg-blue-700 text-white font-semibold" : "hover:bg-blue-800"}`
      }
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-lg">{label}</span>
    </NavLink>
  );
}

/* ---------------- Dropdown Component ---------------- */

function Dropdown({ isOpen, toggle, icon, label, links }) {
  return (
    <div className="mt-4">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full p-3 text-white transition rounded-lg hover:bg-blue-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6">{icon}</div>
          <span className="text-lg">{label}</span>
        </div>

        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-3 mt-2 ml-10 space-y-2 border-l border-blue-700">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md transition
                ${
                  isActive
                    ? "bg-blue-700 text-white font-medium"
                    : "hover:bg-blue-800 text-white"
                }`
              }
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
