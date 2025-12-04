import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function BillHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillHistory();
  }, []);

  const loadBillHistory = async () => {
    try {
      const snapshot = await getDocs(collection(db, "bills"));
      const billList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBills(billList);
    } catch (error) {
      console.error("Error loading bill history:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Bill History</h1>

      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : bills.length === 0 ? (
        <p className="text-gray-300">No bill history found.</p>
      ) : (
        <table className="w-full bg-white border border-gray-300 shadow-md rounded-xl">
          <thead className="text-white bg-blue-600">
            <tr>
              <th className="p-3 border">Bill No</th>
              <th className="p-3 border">Patient Name</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Created At</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((b) => (
              <tr key={b.id} className="text-center hover:bg-gray-100">
                <td className="p-3 border">{b.billNumber || "N/A"}</td>
                <td className="p-3 border">{b.patientName || "N/A"}</td>
                <td className="p-3 border">₹ {b.amount || 0}</td>
                <td className="p-3 border">
                  {b.createdAt?.toDate?.().toLocaleString() || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
