import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Pencil, Trash2, X } from "lucide-react";

export default function ManageData() {
  const [dataList, setDataList] = useState([]);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Helper → Convert any value to array (Fix `.join` errors)
  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  };

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

  // Open Edit Modal
  const openEdit = (item) => {
    const formattedItem = {
      ...item,
      eye: toArray(item.eye),
      chiefComplaint: toArray(item.chiefComplaint),
      glass: toArray(item.glass),
      duration: toArray(item.duration),
      distance: toArray(item.distance),
      progression: toArray(item.progression),
      association: toArray(item.association),
    };

    setEditItem(formattedItem);
    setIsModalOpen(true);
  };

  // Update individual field in edit modal
  const updateField = (field, index, value) => {
    const clone = { ...editItem };
    clone[field][index] = value;
    setEditItem(clone);
  };

  // Add more inputs in edit modal
  const addField = (field) => {
    setEditItem({ ...editItem, [field]: [...editItem[field], ""] });
  };

  // Remove row
  const removeField = (field, index) => {
    if (editItem[field].length === 1) return;
    const updated = editItem[field].filter((_, i) => i !== index);
    setEditItem({ ...editItem, [field]: updated });
  };

  // Save Updated Data
  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "data", editItem.id), editItem);
      toast.success("Updated successfully");
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reusable multiple-input renderer for modal
  const renderEditInputs = (label, field) => (
    <div className="mb-4">
      <h3 className="mb-2 font-semibold">{label}</h3>

      {editItem[field].map((value, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input
            className="flex-1 p-2 border rounded"
            value={value}
            onChange={(e) => updateField(field, idx, e.target.value)}
          />
          <button
            onClick={() => removeField(field, idx)}
            className="p-2 text-white bg-red-500 rounded"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <button
        onClick={() => addField(field)}
        className="px-3 py-1 text-white bg-green-600 rounded"
      >
        + Add More
      </button>
    </div>
  );

  return (
    <div className="p-10">
      <h1 className="mb-6 text-2xl font-bold">Manage Data</h1>

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
              #{index + 1} — Data Entry
            </h2>

            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Eye:</strong> {toArray(item.eye).join(", ")}</p>
              <p><strong>Chief Complaint:</strong> {toArray(item.chiefComplaint).join(", ")}</p>
              <p><strong>Glass:</strong> {toArray(item.glass).join(", ")}</p>
              <p><strong>Duration:</strong> {toArray(item.duration).join(", ")}</p>
              <p><strong>Distance:</strong> {toArray(item.distance).join(", ")}</p>
              <p><strong>Progression:</strong> {toArray(item.progression).join(", ")}</p>
              <p><strong>Association:</strong> {toArray(item.association).join(", ")}</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => openEdit(item)}
                className="flex items-center justify-center flex-1 gap-1 px-4 py-2 text-white bg-blue-500 rounded"
              >
                <Pencil size={16} /> Edit
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="flex items-center justify-center flex-1 gap-1 px-4 py-2 text-white bg-red-500 rounded"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* -------------------- EDIT MODAL -------------------- */}
      {isModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl overflow-y-auto max-h-[90vh]">

            <h2 className="mb-4 text-xl font-bold">Edit Data</h2>

            {renderEditInputs("Eye", "eye")}
            {renderEditInputs("Chief Complaint", "chiefComplaint")}
            {renderEditInputs("Glass", "glass")}
            {renderEditInputs("Duration", "duration")}
            {renderEditInputs("Distance", "distance")}
            {renderEditInputs("Progression", "progression")}
            {renderEditInputs("Association", "association")}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 text-white bg-blue-600 rounded"
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
