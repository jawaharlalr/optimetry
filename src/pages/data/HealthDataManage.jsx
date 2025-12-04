import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function HealthDataManage() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  // Load all saved health condition sets
  const loadHealthData = async () => {
    try {
      const snap = await getDocs(collection(db, "healthData"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecords(list);
    } catch (error) {
      toast.error("Failed to load health condition data");
    }
  };

  useEffect(() => {
    loadHealthData();
  }, []);

  // Delete a record
  const deleteRecord = async (id) => {
    try {
      await deleteDoc(doc(db, "healthData", id));
      toast.success("Record deleted");
      setRecords(records.filter((r) => r.id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // Filter search
  const filtered = records.filter((r) =>
    JSON.stringify(r)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-10">

      <h1 className="mb-6 text-2xl font-bold">Manage Patient Health Conditions</h1>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <input
          type="text"
          className="w-full p-2 pl-10 border rounded"
          placeholder="Search conditions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute w-5 h-5 text-gray-500 left-3 top-2.5" />
      </div>

      {/* Table */}
      <div className="bg-white border rounded shadow">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Diabetes</th>
              <th className="p-2 border">BP</th>
              <th className="p-2 border">Heart</th>
              <th className="p-2 border">Allergies</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2 text-center border">{index + 1}</td>

                  <td className="p-2 border">
                    {item.diabetes?.join(", ") || "-"}
                  </td>

                  <td className="p-2 border">{item.bp?.join(", ") || "-"}</td>

                  <td className="p-2 border">{item.heart?.join(", ") || "-"}</td>

                  <td className="p-2 border">
                    {item.allergies?.join(", ") || "-"}
                  </td>

                  <td className="p-2 border">{item.notes?.join(", ") || "-"}</td>

                  <td className="p-2 text-center border">
                    <button
                      onClick={() => deleteRecord(item.id)}
                      className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
