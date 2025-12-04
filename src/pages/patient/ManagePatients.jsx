import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Pencil,
  Trash2,
  XCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  Save,
  ChevronDown,
} from "lucide-react";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState(null);

  const loadData = async () => {
    try {
      const snap = await getDocs(collection(db, "patients"));
      setPatients(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      toast.error("Failed to load patients");
    }
  };

  const deletePatient = async (id) => {
    try {
      await deleteDoc(doc(db, "patients", id));
      toast.success("Patient deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete patient");
    }
  };

  const openEditModal = (patient) => {
    setEditPatient({ ...patient });
    setIsModalOpen(true);
  };

  const updatePatient = async () => {
    if (!editPatient.name || !editPatient.phone || !editPatient.address) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await updateDoc(doc(db, "patients", editPatient.id), {
        ...editPatient,
      });

      toast.success("Patient updated successfully");
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error("Failed to update patient");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.mrNo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER + SEARCH */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Manage Patients</h1>

        <div className="relative w-64">
          <Search className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
          <input
            type="text"
            placeholder="Search by MR No..."
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <motion.div
        className="overflow-x-auto bg-white rounded shadow-xl"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <table className="min-w-full table-auto">
          <thead className="text-left bg-blue-100">
            <tr>
              <th className="p-3 border-b">S.No</th>
              <th className="p-3 border-b">MR No</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">DOB</th>
              <th className="p-3 border-b">Gender</th>
              <th className="p-3 border-b">Age</th>
              <th className="p-3 border-b">Address</th>
              <th className="p-3 text-center border-b">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((p, index) => (
              <tr key={p.id} className="transition hover:bg-blue-50">
                <td className="p-3 border-b">{index + 1}</td>
                <td className="p-3 border-b">{p.mrNo}</td>
                <td className="p-3 border-b">{p.name}</td>
                <td className="p-3 border-b">{p.phone}</td>
                <td className="p-3 border-b">{p.dob}</td>
                <td className="p-3 border-b">{p.gender}</td>
                <td className="p-3 border-b">{p.age}</td>
                <td className="p-3 border-b">{p.address}</td>

                <td className="flex items-center justify-center gap-3 p-3 border-b">
                  <button
                    className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    onClick={() => openEditModal(p)}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deletePatient(p.id)}
                    className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* ===================== EDIT MODAL ===================== */}
      <AnimatePresence>
        {isModalOpen && editPatient && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 rounded-xl shadow-xl w-[450px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-700">Edit Patient</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <XCircle className="text-gray-500 hover:text-red-500" size={28} />
                </button>
              </div>

              {/* Inputs with icons */}
              <div className="relative mb-3">
                <IdCard className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
                <input
                  className="w-full p-2 pl-10 border rounded"
                  placeholder="MR No"
                  value={editPatient.mrNo}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, mrNo: e.target.value })
                  }
                />
              </div>

              <div className="relative mb-3">
                <User className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
                <input
                  className="w-full p-2 pl-10 border rounded"
                  placeholder="Full Name"
                  value={editPatient.name}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, name: e.target.value })
                  }
                />
              </div>

              <div className="relative mb-3">
                <Phone className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
                <input
                  className="w-full p-2 pl-10 border rounded"
                  placeholder="Phone Number"
                  value={editPatient.phone}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, phone: e.target.value })
                  }
                />
              </div>

              <label className="block font-medium text-gray-700">Date of Birth</label>
              <div className="relative mb-3">
                <Calendar className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
                <input
                  type="date"
                  className="w-full p-2 pl-10 border rounded"
                  value={editPatient.dob}
                  onChange={(e) => {
                    const dob = e.target.value;
                    const birthDate = new Date(dob);
                    const today = new Date();

                    let newAge = today.getFullYear() - birthDate.getFullYear();
                    if (
                      today.getMonth() < birthDate.getMonth() ||
                      (today.getMonth() === birthDate.getMonth() &&
                        today.getDate() < birthDate.getDate())
                    )
                      newAge--;

                    setEditPatient({ ...editPatient, dob: dob, age: newAge });
                  }}
                />
              </div>

              <div className="relative mb-3">
                <ChevronDown className="absolute w-5 h-5 text-gray-500 pointer-events-none right-3 top-3" />
                <select
                  className="w-full p-2 border rounded appearance-none"
                  value={editPatient.gender}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative mb-3">
                <Calendar className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
                <input
                  className="w-full p-2 pl-10 bg-gray-100 border rounded"
                  placeholder="Age"
                  value={editPatient.age}
                  readOnly
                />
              </div>

              <div className="relative mb-3">
                <MapPin className="absolute w-5 h-5 text-gray-500 left-3 top-3" />
                <textarea
                  className="w-full p-2 pl-10 border rounded"
                  rows={3}
                  placeholder="Address"
                  value={editPatient.address}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, address: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <motion.button
                  onClick={updatePatient}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded"
                >
                  <Save size={18} /> Update
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
