import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

export default function AddBill() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // All dropdown options from Firestore
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

  // Load options from "data"
  const loadOptions = async () => {
    const snap = await getDocs(collection(db, "data"));
    const mapped = snap.docs.map((d) => d.data());

    setOptions({
      eyeType: [...new Set(mapped.map((i) => i.eyeType).filter(Boolean))],
      chiefComplaint: [
        ...new Set(mapped.map((i) => i.chiefComplaint).filter(Boolean)),
      ],
      glass: [...new Set(mapped.map((i) => i.glass).filter(Boolean))],
      duration: [...new Set(mapped.map((i) => i.duration).filter(Boolean))],
      distance: [...new Set(mapped.map((i) => i.distance).filter(Boolean))],
      progression: [
        ...new Set(mapped.map((i) => i.progression).filter(Boolean)),
      ],
      association: [
        ...new Set(mapped.map((i) => i.association).filter(Boolean)),
      ],
    });
  };

  useEffect(() => {
    loadPatients();
    loadOptions();
  }, []);

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

  // Update Row
  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // Save Bill
  const saveBill = async () => {
    if (!selectedPatient) return toast.error("Please select a patient");

    await addDoc(collection(db, "bills"), {
      patient: selectedPatient,
      items: rows,
      createdAt: new Date(),
    });

    toast.success("Bill Saved!");

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

  // Filter patients in search
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-10">
      <h1 className="mb-6 text-2xl font-bold">Add Medical Bill</h1>

      {/* SEARCH + SELECT PATIENT */}
      <div className="relative w-full mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search & Select Patient (MR No / Name)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <div className="absolute left-0 right-0 z-20 overflow-y-auto bg-white border rounded shadow max-h-60">
            {filteredPatients.length === 0 ? (
              <div className="p-2 text-gray-500">No patients found</div>
            ) : (
              filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p);
                    setSearch(`${p.mrNo} - ${p.name}`);
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-100"
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
          <p>
            <strong>MR No:</strong> {selectedPatient.mrNo}
          </p>
          <p>
            <strong>Name:</strong> {selectedPatient.name}
          </p>
          <p>
            <strong>Phone:</strong> {selectedPatient.phone}
          </p>
          <p>
            <strong>Gender:</strong> {selectedPatient.gender}
          </p>
          <p>
            <strong>Age:</strong> {selectedPatient.age}
          </p>
          <p>
            <strong>Address:</strong> {selectedPatient.address}
          </p>
        </div>
      )}

      {/* TABLE */}
      <div className="p-4 bg-white border rounded shadow">
        <h2 className="mb-4 text-lg font-bold">Bill Details</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-16 p-2 border">S.No</th>
                <th className="p-2 border">Eye</th>
                <th className="p-2 border">Chief Complaint</th>
                <th className="p-2 border">Glass</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Distance</th>
                <th className="p-2 border">Progression</th>
                <th className="p-2 border">Association</th>
                <th className="p-2 border">Others</th>
                <th className="w-20 p-2 border">Remove</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="text-center">
                  {/* S.NO */}
                  <td className="p-2 font-medium border">{index + 1}</td>

                  {/* Eye */}
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={row.eye}
                      onChange={(e) => updateRow(index, "eye", e.target.value)}
                    >
                      <option value="">Select</option>
                      {options.eyeType.map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Chief Complaint */}
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={row.cc}
                      onChange={(e) => updateRow(index, "cc", e.target.value)}
                    >
                      <option value="">Select</option>
                      {options.chiefComplaint.map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Glass */}
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={row.glass}
                      onChange={(e) =>
                        updateRow(index, "glass", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {options.glass.map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Duration */}
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={row.duration}
                      onChange={(e) =>
                        updateRow(index, "duration", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {options.duration.map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Distance */}
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={row.distance}
                      onChange={(e) =>
                        updateRow(index, "distance", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {options.distance.map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Progression */}
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={row.progression}
                      onChange={(e) =>
                        updateRow(index, "progression", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {options.progression.map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Association */}
                  <td className="p-2 border">
                    <select
                      className="w-full p-1 border rounded"
                      value={row.association}
                      onChange={(e) =>
                        updateRow(index, "association", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {options.association.map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Others */}
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={row.others}
                      onChange={(e) =>
                        updateRow(index, "others", e.target.value)
                      }
                    />
                  </td>

                  {/* Delete Row */}
                  <td className="p-2 border">
                    <button
                      onClick={() => removeRow(index)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addRow}
          className="px-4 py-1 mt-4 text-white bg-green-600 rounded"
        >
          + Add Row
        </button>
      </div>

      <button
        onClick={saveBill}
        className="px-6 py-2 mt-6 text-white bg-blue-600 rounded"
      >
        Save Bill
      </button>
    </div>
  );
}
