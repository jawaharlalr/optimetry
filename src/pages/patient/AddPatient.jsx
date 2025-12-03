import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function AddPatient() {
  const [mrNo, setMrNo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");

  // Auto-calculate age based on DOB
  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);

    if (!selectedDob) return;

    const birthDate = new Date(selectedDob);
    const today = new Date();

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      calculatedAge--;
    }

    setAge(calculatedAge);
  };

  const submitHandler = async () => {
    if (!mrNo || !name || !phone || !dob || !gender || !address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "patients"), {
        mrNo,
        name,
        phone,
        dob,
        gender,
        age,
        address,
        createdAt: new Date(),
      });

      toast.success("Patient Added Successfully!");

      // Reset fields
      setMrNo("");
      setName("");
      setPhone("");
      setDob("");
      setGender("");
      setAge("");
      setAddress("");
    } catch (error) {
      toast.error("Failed to add patient. Try again.");
    }
  };

  return (
    <div className="max-w-xl p-10">
      <h1 className="mb-6 text-2xl font-bold">Add Patient</h1>

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="MR No"
        value={mrNo}
        onChange={(e) => setMrNo(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="block mb-1 font-medium">Date of Birth</label>
      <input
        type="date"
        className="w-full p-2 mb-4 border rounded"
        value={dob}
        onChange={handleDobChange}
      />

      <select
        className="w-full p-2 mb-4 border rounded"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        className="w-full p-2 mb-4 bg-gray-100 border rounded"
        placeholder="Age"
        value={age}
        readOnly
      />

      <textarea
        className="w-full p-2 mb-4 border rounded"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={3}
      ></textarea>

      <button
        onClick={submitHandler}
        className="px-6 py-2 text-white bg-blue-600 rounded"
      >
        Save
      </button>
    </div>
  );
}
