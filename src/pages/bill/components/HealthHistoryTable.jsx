import { Trash2, Plus } from "lucide-react";
import SearchableDropdown from "./SearchableDropdown";
import { useRef, useEffect } from "react";

/* ---------- Auto Expanding Textarea ---------- */
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
      value={value || ""}
      onChange={onChange}
      rows={1}
    />
  );
}

/* ---------- Health History Table ---------- */
export default function HealthHistoryTable({
  healthRows,
  updateHealthRow,
  addHealthRow,
  removeHealthRow,
  conditionList = [] // 🔥 Firestore-based condition dropdown list
}) {
  return (
    <div className="p-4 mt-8 bg-white border rounded shadow">
      <h2 className="mb-4 text-lg font-bold">Patient Health Conditions</h2>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">S.No</th>
            <th className="p-2 border">Condition</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Recent Investigation</th>
            <th className="p-2 border">Remove</th>
          </tr>
        </thead>

        <tbody>
          {healthRows.map((row, index) => (
            <tr key={index}>
              {/* Serial Number */}
              <td className="p-2 text-center border">{index + 1}</td>

              {/* Condition (Searchable Dropdown) */}
              <td className="w-64 p-2 border">
                <SearchableDropdown
                  value={row.condition || ""}
                  list={conditionList}
                  onChange={(val) => updateHealthRow(index, "condition", val)}
                  placeholder="Select Condition"
                />
              </td>

              {/* Duration (Expandable Input Box) */}
              <td className="w-40 p-2 border">
                <AutoResizeTextarea
                  value={row.duration || ""}
                  placeholder="Duration"
                  onChange={(e) =>
                    updateHealthRow(index, "duration", e.target.value)
                  }
                />
              </td>

              {/* Recent Investigation (Expandable Input Box) */}
              <td className="w-56 p-2 border">
                <AutoResizeTextarea
                  value={row.investigation || ""}
                  placeholder="Recent investigation"
                  onChange={(e) =>
                    updateHealthRow(index, "investigation", e.target.value)
                  }
                />
              </td>

              {/* Remove Row */}
              <td className="p-2 text-center border">
                <button
                  onClick={() => removeHealthRow(index)}
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
        onClick={addHealthRow}
        className="flex items-center gap-1 px-4 py-1 mt-4 text-white bg-green-600 rounded"
      >
        <Plus size={18} /> Add Row
      </button>
    </div>
  );
}
