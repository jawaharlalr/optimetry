import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content Area */}
      <div 
        className={`flex-1 p-6 transition-all duration-300 
        ${open ? "ml-0" : ""}`}
      >
        <Outlet />
      </div>
    </div>
  );
}
