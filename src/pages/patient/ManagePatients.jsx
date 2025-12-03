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

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  // For Modal
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
    <div className="p-10">
      {/* HEADER + SEARCH */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Patients</h1>

        <input
          type="text"
          placeholder="Search by MR No..."
          className="w-64 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="w-16 p-3 border-b">S.No</th>
              <th className="p-3 border-b">MR No</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">DOB</th>
              <th className="p-3 border-b">Gender</th>
              <th className="p-3 border-b">Age</th>
              <th className="p-3 border-b">Address</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((p, index) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{index + 1}</td>
                <td className="p-3 border-b">{p.mrNo}</td>
                <td className="p-3 border-b">{p.name}</td>
                <td className="p-3 border-b">{p.phone}</td>
                <td className="p-3 border-b">{p.dob}</td>
                <td className="p-3 border-b">{p.gender}</td>
                <td className="p-3 border-b">{p.age}</td>
                <td className="p-3 border-b">{p.address}</td>

                <td className="p-3 space-x-3 border-b">
                  {/* Edit Button */}
                  <button
                    className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => openEditModal(p)}
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deletePatient(p.id)}
                    className="px-4 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
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
      </div>

      {/* ===================== EDIT MODAL ===================== */}
      {isModalOpen && editPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-xl w-[450px]">
            <h2 className="mb-4 text-xl font-bold">Edit Patient</h2>

            {/* MR No */}
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="MR No"
              value={editPatient.mrNo}
              onChange={(e) =>
                setEditPatient({ ...editPatient, mrNo: e.target.value })
              }
            />

            {/* Name */}
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Full Name"
              value={editPatient.name}
              onChange={(e) =>
                setEditPatient({ ...editPatient, name: e.target.value })
              }
            />

            {/* Phone */}
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Phone Number"
              value={editPatient.phone}
              onChange={(e) =>
                setEditPatient({ ...editPatient, phone: e.target.value })
              }
            />

            {/* DOB */}
            <label className="block mb-1 font-medium">Date of Birth</label>
            <input
              type="date"
              className="w-full p-2 mb-3 border rounded"
              value={editPatient.dob}
              onChange={(e) => {
                const dob = e.target.value;
                const birthDate = new Date(dob);
                const today = new Date();

                let newAge = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();

                if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                  newAge--;
                }

                setEditPatient({
                  ...editPatient,
                  dob: dob,
                  age: newAge,
                });
              }}
            />

            {/* Gender */}
            <select
              className="w-full p-2 mb-3 border rounded"
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

            {/* Age */}
            <input
              className="w-full p-2 mb-3 bg-gray-100 border rounded"
              placeholder="Age"
              value={editPatient.age}
              readOnly
            />

            {/* Address */}
            <textarea
              className="w-full p-2 mb-3 border rounded"
              placeholder="Address"
              value={editPatient.address}
              onChange={(e) =>
                setEditPatient({ ...editPatient, address: e.target.value })
              }
              rows={3}
            ></textarea>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updatePatient}
                className="px-4 py-2 text-white bg-blue-600 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
