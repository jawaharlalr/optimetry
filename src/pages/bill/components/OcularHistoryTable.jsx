import { Trash2, Plus } from "lucide-react";
import { useRef, useEffect } from "react";

/* ---------- Expandable Textarea Component ---------- */
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

/* ---------- Ocular History Table ---------- */
export default function OcularHistoryTable({
  ocularRows,
  addOcularRow,
  updateOcularRow,
  removeOcularRow,
  eyeList = [], // RE/LE from general table
}) {
  return (
    <div className="p-4 mt-8 bg-white border rounded shadow">
      <h2 className="mb-4 text-lg font-bold">Ocular History</h2>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">S.No</th>
            <th className="p-2 border">Eye</th>
            <th className="p-2 border">Condition</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Recent Investigation</th>
            <th className="p-2 border">Remove</th>
          </tr>
        </thead>

        <tbody>
          {ocularRows.map((row, index) => (
            <tr key={index}>

              {/* Serial Number */}
              <td className="p-2 text-center border">{index + 1}</td>

              {/* Eye Dropdown */}
              <td className="w-40 p-2 border">
                <select
                  className="w-full p-1 border rounded"
                  value={row.eye || ""}
                  onChange={(e) => updateOcularRow(index, "eye", e.target.value)}
                >
                  <option value="">Select Eye</option>
                  {eyeList.map((eye, idx) => (
                    <option key={idx} value={eye}>
                      {eye}
                    </option>
                  ))}
                </select>
              </td>

              {/* Condition as Expandable Textbox */}
              <td className="w-64 p-2 border">
                <AutoResizeTextarea
                  value={row.condition || ""}
                  placeholder="Condition"
                  onChange={(e) =>
                    updateOcularRow(index, "condition", e.target.value)
                  }
                />
              </td>

              {/* Duration (Expandable) */}
              <td className="w-56 p-2 border">
                <AutoResizeTextarea
                  value={row.duration || ""}
                  placeholder="Duration"
                  onChange={(e) =>
                    updateOcularRow(index, "duration", e.target.value)
                  }
                />
              </td>

              {/* Recent Investigation (Expandable) */}
              <td className="w-64 p-2 border">
                <AutoResizeTextarea
                  value={row.recentInvestigation || ""}
                  placeholder="Recent investigation"
                  onChange={(e) =>
                    updateOcularRow(index, "recentInvestigation", e.target.value)
                  }
                />
              </td>

              {/* Remove Row */}
              <td className="p-2 text-center border">
                <button
                  onClick={() => removeOcularRow(index)}
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
        onClick={addOcularRow}
        className="flex items-center gap-1 px-4 py-1 mt-4 text-white bg-green-600 rounded"
      >
        <Plus size={18} /> Add Row
      </button>
    </div>
  );
}
