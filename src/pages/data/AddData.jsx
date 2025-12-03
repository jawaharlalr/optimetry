import { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, FileText } from "lucide-react";


export default function AddData() {
  const [eye, setEye] = useState([""]);
  const [chiefComplaint, setChiefComplaint] = useState([""]);
  const [glass, setGlass] = useState([""]);
  const [duration, setDuration] = useState([""]);
  const [distance, setDistance] = useState([""]);
  const [progression, setProgression] = useState([""]);
  const [association, setAssociation] = useState([""]);

  // Add a row
  const addRow = (setter, list) => setter([...list, ""]);

  // Update row
  const updateRow = (setter, list, index, value) => {
    const clone = [...list];
    clone[index] = value;
    setter(clone);
  };

  // Remove row
  const removeRow = (setter, list, index) => {
    if (list.length === 1) return;
    setter(list.filter((_, i) => i !== index));
  };

  // Save Data
  const saveData = async () => {
    try {
      await addDoc(collection(db, "data"), {
        eye,
        chiefComplaint,
        glass,
        duration,
        distance,
        progression,
        association,
        createdAt: new Date(),
      });

      toast.success("Data Added Successfully!");

      setEye([""]);
      setChiefComplaint([""]);
      setGlass([""]);
      setDuration([""]);
      setDistance([""]);
      setProgression([""]);
      setAssociation([""]);
    } catch (error) {
      toast.error("Failed to save data");
    }
  };

  // Render multi-input component
  const renderMultiInput = (label, list, setter, icon) => (
    <div className="p-4 mb-6 bg-white rounded-lg shadow">
      <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold">
        {icon}
        {label}
      </h3>

      {list.map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            className="flex-1 p-2 border rounded"
            placeholder={label}
            value={item}
            onChange={(e) => updateRow(setter, list, index, e.target.value)}
          />

          <button
            onClick={() => removeRow(setter, list, index)}
            className="p-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button
        onClick={() => addRow(setter, list)}
        className="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-green-600 rounded hover:bg-green-700"
      >
        <Plus size={18} />
        Add More
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl p-10">
      <h1 className="flex items-center gap-2 mb-6 text-3xl font-bold">
        <Plus size={28} className="text-blue-600" />
        Add Data
      </h1>

      {renderMultiInput("Eye", eye, setEye, <EyeIcon />)}
      {renderMultiInput("Chief Complaint", chiefComplaint, setChiefComplaint, <ComplaintIcon />)}
      {renderMultiInput("Glass", glass, setGlass, <GlassIcon />)}
      {renderMultiInput("Duration", duration, setDuration, <DurationIcon />)}
      {renderMultiInput("Distance", distance, setDistance, <DistanceIcon />)}
      {renderMultiInput("Progression", progression, setProgression, <ProgressIcon />)}
      {renderMultiInput("Association", association, setAssociation, <AssociationIcon />)}

      <button
        onClick={saveData}
        className="flex items-center gap-3 px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <Save size={20} />
        Save Data
      </button>
    </div>
  );
}

/* ---- CUSTOM ICONS USING LUCIDE ---- */
function EyeIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
}

function ComplaintIcon() {
  return <FileText size={20} className="text-purple-600" />;
}

function GlassIcon() {
  return <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 3h16l-1.5 9h-13zM9 21l1-5h4l1 5z"/>
  </svg>;
}

function DurationIcon() {
  return <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>;
}

function DistanceIcon() {
  return <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 12h18M12 3l3 3-3 3M12 21l3-3-3-3" />
  </svg>;
}

function ProgressIcon() {
  return <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12l5 5L20 7" />
  </svg>;
}

function AssociationIcon() {
  return <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="12" r="3" />
    <circle cx="15" cy="12" r="3" />
  </svg>;
}
