import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [open, setOpen] = useState(true);

  const [patientCount, setPatientCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [todayBills, setTodayBills] = useState(0);

  // Load stats
  const loadStats = async () => {
    const patientsSnap = await getDocs(collection(db, "patients"));
    setPatientCount(patientsSnap.size);

    const billsSnap = await getDocs(collection(db, "bills"));
    setBillCount(billsSnap.size);

    const dataSnap = await getDocs(collection(db, "data"));
    setDataCount(dataSnap.size);

    const today = new Date().toISOString().split("T")[0];

    const todayCount = billsSnap.docs.filter((b) => {
      const created = b.data().createdAt?.toDate();
      if (!created) return false;
      return created.toISOString().startsWith(today);
    }).length;

    setTodayBills(todayCount);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto transition-all duration-300">

        {/* ---------------- Dashboard Stats ---------------- */}
        <h1 className="mb-6 text-3xl font-bold">Dashboard Overview</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Patients */}
          <div className="p-6 text-white bg-blue-600 shadow rounded-xl">
            <h2 className="text-lg font-semibold">Total Patients</h2>
            <p className="mt-2 text-3xl font-bold">{patientCount}</p>
          </div>

          {/* Total Bills */}
          <div className="p-6 text-white bg-green-600 shadow rounded-xl">
            <h2 className="text-lg font-semibold">Total Bills</h2>
            <p className="mt-2 text-3xl font-bold">{billCount}</p>
          </div>

          {/* Total Data */}
          <div className="p-6 text-white bg-purple-600 shadow rounded-xl">
            <h2 className="text-lg font-semibold">Total Data Records</h2>
            <p className="mt-2 text-3xl font-bold">{dataCount}</p>
          </div>

          {/* Bills Today */}
          <div className="p-6 text-white bg-orange-500 shadow rounded-xl">
            <h2 className="text-lg font-semibold">Bills Today</h2>
            <p className="mt-2 text-3xl font-bold">{todayBills}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
