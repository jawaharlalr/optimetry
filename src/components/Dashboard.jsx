import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [todayBills, setTodayBills] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const p = await getDocs(collection(db, "patients"));
    setPatientCount(p.size);

    const b = await getDocs(collection(db, "bills"));
    setBillCount(b.size);

    const d = await getDocs(collection(db, "data"));
    setDataCount(d.size);

    const today = new Date().toISOString().split("T")[0];
    const todayCount = b.docs.filter((bill) => {
      const created = bill.data().createdAt?.toDate();
      return created?.toISOString().startsWith(today);
    }).length;

    setTodayBills(todayCount);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="p-6 text-white bg-blue-600 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Total Patients</h2>
          <p className="mt-2 text-3xl font-bold">{patientCount}</p>
        </div>

        <div className="p-6 text-white bg-green-600 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Total Bills</h2>
          <p className="mt-2 text-3xl font-bold">{billCount}</p>
        </div>

        <div className="p-6 text-white bg-purple-600 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Total Data Records</h2>
          <p className="mt-2 text-3xl font-bold">{dataCount}</p>
        </div>

        <div className="p-6 text-white bg-orange-500 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Bills Today</h2>
          <p className="mt-2 text-3xl font-bold">{todayBills}</p>
        </div>

      </div>
    </div>
  );
}
