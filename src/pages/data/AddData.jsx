import { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function AddData() {
  const [eyeType, setEyeType] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [glass, setGlass] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [progression, setProgression] = useState("");
  const [association, setAssociation] = useState("");

  const saveData = async () => {
    await addDoc(collection(db, "data"), {
      eyeType,
      chiefComplaint,
      glass,
      duration,
      distance,
      progression,
      association,
      createdAt: new Date(),
    });

    alert("Data Added!");

    // Reset all fields
    setEyeType("");
    setChiefComplaint("");
    setGlass("");
    setDuration("");
    setDistance("");
    setProgression("");
    setAssociation("");
  };

  return (
    <div className="max-w-xl p-10">
      <h1 className="mb-6 text-2xl font-bold">Add Data</h1>

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Eye Type"
        value={eyeType}
        onChange={(e) => setEyeType(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Chief Complaint"
        value={chiefComplaint}
        onChange={(e) => setChiefComplaint(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Glass"
        value={glass}
        onChange={(e) => setGlass(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Distance"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Progression"
        value={progression}
        onChange={(e) => setProgression(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Association"
        value={association}
        onChange={(e) => setAssociation(e.target.value)}
      />

      <button
        onClick={saveData}
        className="px-6 py-2 text-white bg-blue-600 rounded"
      >
        Save
      </button>
    </div>
  );
}
