import { Trash2, Plus } from "lucide-react";
import SearchableDropdown from "./SearchableDropdown";
import { useRef, useEffect } from "react";

// Auto-resizing textarea component
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

export default function GeneralDataTable({
  rows,
  options,
  addRow,
  updateRow,
  removeRow,
}) {
  return (
    <div className="p-4 bg-white border rounded shadow">
      <h2 className="mb-4 text-lg font-bold">General Data</h2>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">S.No</th>
            <th className="p-2 border">Eye</th>
            <th className="p-2 border">Chief Complaint</th>
            <th className="p-2 border">Glass</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Distance</th>
            <th className="p-2 border">Progression</th>
            <th className="p-2 border">Association</th>
            <th className="p-2 border">Others</th>
            <th className="p-2 border">Remove</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="p-2 text-center border">{index + 1}</td>

              <td className="p-2 border">
                <SearchableDropdown
                  value={row.eye}
                  list={options.eyeType}
                  onChange={(val) => updateRow(index, "eye", val)}
                  placeholder="Select"
                />
              </td>

              <td className="p-2 border">
                <SearchableDropdown
                  value={row.cc}
                  list={options.chiefComplaint}
                  onChange={(val) => updateRow(index, "cc", val)}
                  placeholder="Select"
                />
              </td>

              <td className="p-2 border">
                <SearchableDropdown
                  value={row.glass}
                  list={options.glass}
                  onChange={(val) => updateRow(index, "glass", val)}
                  placeholder="Select"
                />
              </td>

              <td className="p-2 border">
                <SearchableDropdown
                  value={row.duration}
                  list={options.duration}
                  onChange={(val) => updateRow(index, "duration", val)}
                  placeholder="Select"
                />
              </td>

              <td className="p-2 border">
                <SearchableDropdown
                  value={row.distance}
                  list={options.distance}
                  onChange={(val) => updateRow(index, "distance", val)}
                  placeholder="Select"
                />
              </td>

              <td className="p-2 border">
                <SearchableDropdown
                  value={row.progression}
                  list={options.progression}
                  onChange={(val) => updateRow(index, "progression", val)}
                  placeholder="Select"
                />
              </td>

              <td className="p-2 border">
                <SearchableDropdown
                  value={row.association}
                  list={options.association}
                  onChange={(val) => updateRow(index, "association", val)}
                  placeholder="Select"
                />
              </td>

              {/* Auto-Expanding Textarea for "Others" */}
              <td className="p-2 border">
                <AutoResizeTextarea
                  value={row.others}
                  placeholder="Enter details"
                  onChange={(e) =>
                    updateRow(index, "others", e.target.value)
                  }
                />
              </td>

              <td className="p-2 text-center border">
                <button
                  onClick={() => removeRow(index)}
                  className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="flex items-center gap-1 px-4 py-1 mt-4 text-white bg-green-600 rounded"
      >
        <Plus size={18} /> Add Row
      </button>
    </div>
  );
}
