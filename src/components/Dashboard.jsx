// src/components/Dashboard.jsx

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaUserInjured, FaFileInvoice, FaDatabase, FaCalendarDay } from "react-icons/fa";

export default function Dashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [todayBills, setTodayBills] = useState(0);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    const p = await getDocs(collection(db, "patients"));
    setPatientCount(p.size);

    const b = await getDocs(collection(db, "bills"));
    setBillCount(b.size);

    const d = await getDocs(collection(db, "data"));
    setDataCount(d.size);

    const today = new Date().toISOString().split("T")[0];
    const todayCount = b.docs.filter(bill => {
      const created = bill.data().createdAt?.toDate();
      return created?.toISOString().startsWith(today);
    }).length;

    setTodayBills(todayCount);
  };

  return (
    <div className="min-h-screen p-6 bg-blue-900">
      <h1 className="mb-6 text-3xl font-bold text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard title="Total Patients" count={patientCount} icon={<FaUserInjured size={40} />} color="bg-blue-700" />
        <DashboardCard title="Total Bills" count={billCount} icon={<FaFileInvoice size={40} />} color="bg-blue-600" />
        <DashboardCard title="Total Data Records" count={dataCount} icon={<FaDatabase size={40} />} color="bg-blue-500" />
        <DashboardCard title="Bills Today" count={todayBills} icon={<FaCalendarDay size={40} />} color="bg-blue-800" />

      </div>
    </div>
  );
}

function DashboardCard({ title, count, icon, color }) {
  return (
    <div className={`flex items-center gap-4 p-6 text-white ${color} shadow-lg rounded-xl`}>
      {icon}
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-3xl font-bold">{count}</p>
      </div>
    </div>
  );
}
