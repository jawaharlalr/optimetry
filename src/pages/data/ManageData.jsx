import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

export default function ManageData() {
  const [dataList, setDataList] = useState([]);

  const loadData = async () => {
    try {
      const snap = await getDocs(collection(db, "data"));
      setDataList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "data", id));
      toast.success("Deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-10">
      <h1 className="mb-6 text-2xl font-bold">Manage Data</h1>

      {/* Show message if empty */}
      {dataList.length === 0 && (
        <p className="text-center text-gray-500">No data found</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataList.map((item, index) => (
          <div
            key={item.id}
            className="p-6 transition-all bg-white border shadow rounded-xl hover:shadow-md"
          >
            <h2 className="mb-3 text-lg font-bold">
              #{index + 1} — {item.eyeType || "No Title"}
            </h2>

            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Eye Type:</strong> {item.eyeType}</p>
              <p><strong>Chief Complaint:</strong> {item.chiefComplaint}</p>
              <p><strong>Glass:</strong> {item.glass}</p>
              <p><strong>Duration:</strong> {item.duration}</p>
              <p><strong>Distance:</strong> {item.distance}</p>
              <p><strong>Progression:</strong> {item.progression}</p>
              <p><strong>Association:</strong> {item.association}</p>
            </div>

            <button
              onClick={() => deleteItem(item.id)}
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
