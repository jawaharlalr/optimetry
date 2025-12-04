import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function PatientHistory() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientHistory();
  }, []);

  const loadPatientHistory = async () => {
    try {
      const snapshot = await getDocs(collection(db, "patients"));
      const patientList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientList);
    } catch (error) {
      console.error("Error loading patient history:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Patient History</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-500">No patient history found.</p>
      ) : (
        <table className="w-full bg-white border border-gray-300 shadow-md rounded-xl">
          <thead className="text-white bg-blue-600">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Age</th>
              <th className="p-3 border">Gender</th>
              <th className="p-3 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="text-center border hover:bg-gray-100">
                <td className="p-3 border">{p.name}</td>
                <td className="p-3 border">{p.age}</td>
                <td className="p-3 border">{p.gender}</td>
                <td className="p-3 border">
                  {p.createdAt?.toDate?.().toLocaleString() || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
