import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  IdCard,
  User,
  Phone,
  Calendar,
  MapPin,
  Save,
  ChevronDown,
} from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl p-10 mx-auto bg-white shadow-xl rounded-xl"
    >
      <h1 className="mb-6 text-3xl font-bold text-blue-700">Add Patient</h1>

      {/* MR No */}
      <div className="relative mb-4">
        <IdCard className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
        <input
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="MR No"
          value={mrNo}
          onChange={(e) => setMrNo(e.target.value)}
        />
      </div>

      {/* Name */}
      <div className="relative mb-4">
        <User className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
        <input
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="relative mb-4">
        <Phone className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
        <input
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* DOB */}
      <label className="block mb-1 font-medium text-gray-700">Date of Birth</label>
      <div className="relative mb-4">
        <Calendar className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
        <input
          type="date"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dob}
          onChange={handleDobChange}
        />
      </div>

      {/* Gender */}
      <div className="relative mb-4">
        <ChevronDown className="absolute w-5 h-5 text-gray-500 pointer-events-none right-3 top-3" />
        <select
          className="w-full p-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Age (readonly) */}
      <div className="relative mb-4">
        <Calendar className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
        <input
          className="w-full p-3 pl-10 bg-gray-100 border rounded-lg"
          placeholder="Age"
          value={age}
          readOnly
        />
      </div>

      {/* Address */}
      <div className="relative mb-4">
        <MapPin className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
        <textarea
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
        ></textarea>
      </div>

      {/* Save button with animation */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={submitHandler}
        className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <Save className="w-5 h-5" /> Save
      </motion.button>
    </motion.div>
  );
}
