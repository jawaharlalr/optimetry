import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

/* -------- TABLE COMPONENTS -------- */
import GeneralDataTable from "./components/GeneralDataTable";
import HealthHistoryTable from "./components/HealthHistoryTable";
import OcularHistoryTable from "./components/OcularHistoryTable";
import CurrentMedicationTable from "./components/CurrentMedicationTable";
import BirthHistoryAllergiesTable from "./components/BirthHistoryAllergiesTable";

export default function AddBill() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  /* ------------------- DROPDOWN OPTIONS ------------------- */
  const [options, setOptions] = useState({
    eyeType: [],
    chiefComplaint: [],
    glass: [],
    duration: [],
    distance: [],
    progression: [],
    association: [],
  });

  const [ocularConditionList, setOcularConditionList] = useState([]);
  const [healthConditionList, setHealthConditionList] = useState([]);

  /* ------------------- TABLE STATES ------------------- */

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

  const [healthRows, setHealthRows] = useState([
    { condition: "", duration: "", investigation: "" },
  ]);

  const [ocularRows, setOcularRows] = useState([
    { eye: "", condition: "", duration: "", recentInvestigation: "" },
  ]);

  const [medicationRows, setMedicationRows] = useState([{ medication: "" }]);

  const [birthAllergyRows, setBirthAllergyRows] = useState([
    { birthHistory: "", allergies: "" },
  ]);

  /* ------------------- FIRESTORE LOAD ------------------- */
  useEffect(() => {
    (async () => {
      // LOAD PATIENTS
      const patientSnap = await getDocs(collection(db, "patients"));
      setPatients(patientSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // LOAD GENERAL OPTIONS
      const dataSnap = await getDocs(collection(db, "data"));
      const data = dataSnap.docs.map((d) => d.data());

      const unique = (field) =>
        [...new Set(data.flatMap((d) => d[field] || []).filter(Boolean))];

      setOptions({
        eyeType: unique("eye"),
        chiefComplaint: unique("chiefComplaint"),
        glass: unique("glass"),
        duration: unique("duration"),
        distance: unique("distance"),
        progression: unique("progression"),
        association: unique("association"),
      });

      // LOAD OCULAR CONDITIONS
      const ocularSnap = await getDocs(collection(db, "ocularConditions"));
      setOcularConditionList(
        ocularSnap.docs.map((doc) => doc.data().name)
      );

      // LOAD HEALTH CONDITIONS
      const healthSnap = await getDocs(collection(db, "healthData"));
      const extracted = healthSnap.docs
        .flatMap((d) => d.data().condition)
        .filter(Boolean);

      setHealthConditionList([...new Set(extracted)]);
    })();
  }, []);

  /* ------------------- HANDLERS ------------------- */

  // GENERAL TABLE
  const updateRow = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    setRows(updated);
  };

  const addRow = () =>
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

  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  // HEALTH HISTORY
  const updateHealthRow = (i, field, value) => {
    const updated = [...healthRows];
    updated[i][field] = value;
    setHealthRows(updated);
  };

  const addHealthRow = () =>
    setHealthRows([
      ...healthRows,
      { condition: "", duration: "", investigation: "" },
    ]);

  const removeHealthRow = (i) =>
    setHealthRows(healthRows.filter((_, idx) => idx !== i));

  // OCULAR HISTORY
  const updateOcularRow = (i, field, value) => {
    const updated = [...ocularRows];
    updated[i][field] = value;
    setOcularRows(updated);
  };

  const addOcularRow = () =>
    setOcularRows([
      ...ocularRows,
      { eye: "", condition: "", duration: "", recentInvestigation: "" },
    ]);

  const removeOcularRow = (i) =>
    setOcularRows(ocularRows.filter((_, idx) => idx !== i));

  // MEDICATION
  const updateMedicationRow = (i, field, value) => {
    const updated = [...medicationRows];
    updated[i][field] = value;
    setMedicationRows(updated);
  };

  const addMedicationRow = () =>
    setMedicationRows([...medicationRows, { medication: "" }]);

  const removeMedicationRow = (i) =>
    setMedicationRows(medicationRows.filter((_, idx) => idx !== i));

  // BIRTH + ALLERGY
  const updateBirthAllergyRow = (i, field, value) => {
    const updated = [...birthAllergyRows];
    updated[i][field] = value;
    setBirthAllergyRows(updated);
  };

  const addBirthAllergyRow = () =>
    setBirthAllergyRows([
      ...birthAllergyRows,
      { birthHistory: "", allergies: "" },
    ]);

  const removeBirthAllergyRow = (i) =>
    setBirthAllergyRows(birthAllergyRows.filter((_, idx) => idx !== i));

  /* ------------------- SAVE BILL ------------------- */
  const saveBill = async () => {
    if (!selectedPatient) {
      return toast.error("Please select a patient");
    }

    await addDoc(collection(db, "bills"), {
      patient: selectedPatient,
      generalData: rows,
      healthHistory: healthRows,
      ocularHistory: ocularRows,
      medications: medicationRows,
      birthAndAllergies: birthAllergyRows,
      createdAt: new Date(),
    });

    toast.success("Bill saved successfully!");
  };

  /* ------------------- FILTER PATIENT ------------------- */
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrNo.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------- UI ------------------- */
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
          <div className="absolute bg-white border rounded shadow max-h-60 overflow-y-auto left-0 right-0 z-[9999]">
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

      {/* TABLES */}
      <GeneralDataTable
        rows={rows}
        options={options}
        updateRow={updateRow}
        addRow={addRow}
        removeRow={removeRow}
      />

      <HealthHistoryTable
        healthRows={healthRows}
        updateHealthRow={updateHealthRow}
        addHealthRow={addHealthRow}
        removeHealthRow={removeHealthRow}
        conditionList={healthConditionList} // 🔥 Correct source
      />

      <OcularHistoryTable
        ocularRows={ocularRows}
        updateOcularRow={updateOcularRow}
        addOcularRow={addOcularRow}
        removeOcularRow={removeOcularRow}
        ocularConditionList={ocularConditionList}
        eyeList={options.eyeType}
      />

      <CurrentMedicationTable
        medicationRows={medicationRows}
        updateMedicationRow={updateMedicationRow}
        addMedicationRow={addMedicationRow}
        removeMedicationRow={removeMedicationRow}
      />

      <BirthHistoryAllergiesTable
        rows={birthAllergyRows}
        updateRow={updateBirthAllergyRow}
        addRow={addBirthAllergyRow}
        removeRow={removeBirthAllergyRow}
      />

      {/* SAVE */}
      <button
        onClick={saveBill}
        className="flex items-center gap-2 px-6 py-2 mt-6 text-white bg-blue-600 rounded"
      >
        <Save size={18} /> Save Bill
      </button>
    </div>
  );
}
