import { Trash2, Plus } from "lucide-react";
import { useRef, useEffect } from "react";

/* ---------- Expandable Textarea ---------- */
function AutoResizeTextarea({ value, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      className="w-full p-1 overflow-hidden border rounded resize-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={1}
    />
  );
}

/* ---------- Current Medication Table ---------- */
export default function CurrentMedicationTable({
  medicationRows,
  addMedicationRow,
  updateMedicationRow,
  removeMedicationRow,
}) {
  return (
    <div className="p-4 mt-8 bg-white border rounded shadow">
      <h2 className="mb-4 text-lg font-bold">Current Medications</h2>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">S.No</th>
            <th className="p-2 border">Medications</th>
            <th className="p-2 border">Remove</th>
          </tr>
        </thead>

        <tbody>
          {medicationRows.map((row, index) => (
            <tr key={index}>
              {/* S.No */} 
              <td className="p-2 text-center border">{index + 1}</td>

              {/* Medications Expandable Input */} 
              <td className="p-2 border w-96">
                <AutoResizeTextarea
                  value={row.medication || ""}
                  placeholder="Enter medication"
                  onChange={(e) =>
                    updateMedicationRow(index, "medication", e.target.value)
                  }
                />
              </td>

              {/* Remove Button */} 
              <td className="p-2 text-center border">
                <button
                  onClick={() => removeMedicationRow(index)}
                  className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Row Button */}
      <button
        onClick={addMedicationRow}
        className="flex items-center gap-1 px-4 py-1 mt-4 text-white bg-green-600 rounded"
      >
        <Plus size={18} /> Add Row
      </button>
    </div>
  );
}
