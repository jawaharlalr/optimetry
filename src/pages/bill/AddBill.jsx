import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { db } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { Plus, Trash2, Save } from "lucide-react";

export default function AddBill() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [options, setOptions] = useState({
    eyeType: [],
    chiefComplaint: [],
    glass: [],
    duration: [],
    distance: [],
    progression: [],
    association: [],
  });

  const [rows, setRows] = useState([
    {
      eye: "",
      cc: "",
      glass: "",
      duration: "",
      distance: "",
      progression: "",
      association: "",
      others: "",
    },
  ]);

  // Load Patients
  const loadPatients = async () => {
    const snap = await getDocs(collection(db, "patients"));
    setPatients(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // Load dropdown options
  const loadOptions = async () => {
    const snap = await getDocs(collection(db, "data"));
    const data = snap.docs.map((d) => d.data());

    const getUnique = (field) =>
      [...new Set(data.flatMap((d) => d[field] || []).filter(Boolean))];

    setOptions({
      eyeType: getUnique("eye"),
      chiefComplaint: getUnique("chiefComplaint"),
      glass: getUnique("glass"),
      duration: getUnique("duration"),
      distance: getUnique("distance"),
      progression: getUnique("progression"),
      association: getUnique("association"),
    });
  };

  useEffect(() => {
    loadPatients();
    loadOptions();
  }, []);

  // ---------------------------------------------------------
  // SEARCHABLE DROPDOWN (with outside click + empty hide)
  // ---------------------------------------------------------
  const SearchableDropdown = ({ value, list, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(value || "");
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    // Sync input with parent value
    useEffect(() => {
      setInput(value || "");
    }, [value]);

    // Filter items
    const filtered = list.filter((i) =>
      i.toLowerCase().includes(input.toLowerCase())
    );

    // Position dropdown
    const updatePos = () => {
      const rect = inputRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    useEffect(() => {
      if (open) updatePos();
      window.addEventListener("scroll", updatePos);
      window.addEventListener("resize", updatePos);
      return () => {
        window.removeEventListener("scroll", updatePos);
        window.removeEventListener("resize", updatePos);
      };
    }, [open]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(e.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <>
        <input
          ref={inputRef}
          className="w-full p-1 border rounded"
          value={input}
          placeholder={placeholder}
          onFocus={() => input !== "" && setOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            setInput(val);

            if (val === "") {
              setOpen(false); // hide when empty
            } else {
              setOpen(true);
            }
          }}
        />

        {open &&
          createPortal(
            <div
              ref={dropdownRef}
              className="absolute bg-white border rounded shadow max-h-40 overflow-y-auto z-[99999]"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }}
            >
              {filtered.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">No results</div>
              ) : (
                filtered.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 text-sm cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => {
                      onChange(item);
                      setInput(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </div>
                ))
              )}
            </div>,
            document.body
          )}
      </>
    );
  };

  // Update Row
  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // Add Row
  const addRow = () => {
    setRows([
      ...rows,
      {
        eye: "",
        cc: "",
        glass: "",
        duration: "",
        distance: "",
        progression: "",
        association: "",
        others: "",
      },
    ]);
  };

  // Remove Row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Save
  const saveBill = async () => {
    if (!selectedPatient) return toast.error("Please select a patient");

    await addDoc(collection(db, "bills"), {
      patient: selectedPatient,
      items: rows,
      createdAt: new Date(),
    });

    toast.success("Bill saved!");

    setSelectedPatient(null);
    setRows([
      {
        eye: "",
        cc: "",
        glass: "",
        duration: "",
        distance: "",
        progression: "",
        association: "",
        others: "",
      },
    ]);
  };

  // Filter Patients
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-10">
      <h1 className="mb-6 text-2xl font-bold">Add Medical Bill</h1>

      {/* SEARCH PATIENT */}
      <div className="relative w-full mb-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Search Patient (MR No / Name)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <div className="absolute left-0 right-0 bg-white border rounded shadow max-h-60 overflow-y-auto z-[9999]">
            {filteredPatients.length === 0 ? (
              <div className="p-2 text-gray-500">No patients found</div>
            ) : (
              filteredPatients.map((p) => (
                <div
                  key={p.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedPatient(p);
                    setSearch(`${p.mrNo} - ${p.name}`);
                  }}
                >
                  {p.mrNo} — {p.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* PATIENT DETAILS */}
      {selectedPatient && (
        <div className="p-4 mb-6 bg-white border rounded shadow">
          <h2 className="mb-2 text-lg font-bold">Patient Details</h2>
          <p><strong>MR No:</strong> {selectedPatient.mrNo}</p>
          <p><strong>Name:</strong> {selectedPatient.name}</p>
          <p><strong>Phone:</strong> {selectedPatient.phone}</p>
          <p><strong>Gender:</strong> {selectedPatient.gender}</p>
          <p><strong>Age:</strong> {selectedPatient.age}</p>
          <p><strong>Address:</strong> {selectedPatient.address}</p>
        </div>
      )}

      {/* BILL TABLE */}
      <div className="p-4 bg-white border rounded shadow">
        <h2 className="mb-4 text-lg font-bold">Bill Details</h2>

        <div className="relative">
          <div className="overflow-visible">
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

                    <td className="p-2 border">
                      <input
                        className="w-full p-1 border rounded"
                        value={row.others}
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
          </div>
        </div>

        <button
          onClick={addRow}
          className="flex items-center gap-1 px-4 py-1 mt-4 text-white bg-green-600 rounded"
        >
          <Plus size={18} /> Add Row
        </button>
      </div>

      <button
        onClick={saveBill}
        className="flex items-center gap-2 px-6 py-2 mt-6 text-white bg-blue-600 rounded"
      >
        <Save size={18} /> Save Bill
      </button>
    </div>
  );
}
