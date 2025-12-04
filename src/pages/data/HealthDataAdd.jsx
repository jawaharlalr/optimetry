import { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

import { Plus, Trash2, Save, FileText } from "lucide-react";

export default function AddHealthData() {
  // NEW: Only a single list for all conditions
  const [conditions, setConditions] = useState([""]);

  // Add row
  const addRow = () => setConditions([...conditions, ""]);

  // Update row
  const updateRow = (index, value) => {
    const updated = [...conditions];
    updated[index] = value;
    setConditions(updated);
  };

  // Remove row
  const removeRow = (index) => {
    if (conditions.length === 1) return; // keep one input
    setConditions(conditions.filter((_, i) => i !== index));
  };

  // Save to Firestore
  const saveData = async () => {
    try {
      await addDoc(collection(db, "healthData"), {
        conditions,
        createdAt: new Date(),
      });

      toast.success("Conditions saved successfully!");

      setConditions([""]); // reset

    } catch (error) {
      toast.error("Failed to save condition data");
    }
  };

  return (
    <div className="max-w-3xl p-10">
      <h1 className="flex items-center gap-2 mb-6 text-3xl font-bold">
        <Plus size={28} className="text-blue-600" />
        Add Patient Health Conditions
      </h1>

      {/* INPUT LIST FOR CONDITIONS */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold">
          <FileText size={20} className="text-gray-700" />
          Conditions
        </h3>

        {conditions.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Enter condition (e.g. Diabetes, BP, Allergy)"
              value={item}
              onChange={(e) => updateRow(index, e.target.value)}
            />

            <button
              onClick={() => removeRow(index)}
              className="p-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <button
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          <Plus size={18} />
          Add More
        </button>
      </div>

      <button
        onClick={saveData}
        className="flex items-center gap-3 px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <Save size={20} />
        Save Conditions
      </button>
    </div>
  );
}
