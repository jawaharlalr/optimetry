import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

export default function ManageBill() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Bills
  const loadBills = async () => {
    const snap = await getDocs(collection(db, "bills"));
    const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setBills(fetched);
    setFilteredBills(fetched);
  };

  useEffect(() => {
    loadBills();
  }, []);

  // Apply filters
  useEffect(() => {
    let data = [...bills];

    // Filter by MR No or name
    if (searchText.trim() !== "") {
      data = data.filter((bill) => {
        const patient = bill.patient || {};
        return (
          patient.mrNo?.toLowerCase().includes(searchText.toLowerCase()) ||
          patient.name?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    // Filter by date
    if (searchDate) {
      data = data.filter((bill) => {
        if (!bill.createdAt) return false;

        const billDate = bill.createdAt.toDate
          ? bill.createdAt.toDate().toISOString().split("T")[0]
          : "";

        return billDate === searchDate;
      });
    }

    setFilteredBills(data);
  }, [searchText, searchDate, bills]);

  const deleteBill = async (id) => {
    await deleteDoc(doc(db, "bills", id));
    loadBills();
  };

  const openViewModal = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  return (
    <div className="p-10">

      <h1 className="mb-6 text-2xl font-bold">Manage Bills</h1>

      {/* -------------------- SEARCH & FILTER -------------------- */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Text Search */}
        <input
          type="text"
          placeholder="Search by MR No or Patient Name"
          className="w-64 p-2 border rounded"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Date Filter */}
        <input
          type="date"
          className="p-2 border rounded"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />

        {/* Clear */}
        <button
          onClick={() => {
            setSearchText("");
            setSearchDate("");
          }}
          className="px-4 py-2 text-white bg-gray-600 rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* -------------------- BILLS TABLE -------------------- */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="w-16 p-3 border-b">S.No</th>
              <th className="p-3 border-b">MR No</th>
              <th className="p-3 border-b">Patient Name</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Chief Complaint</th>
              <th className="p-3 border-b">Bill Date</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((b, index) => {
              const p = b.patient || {};
              const firstItem = (b.items && b.items[0]) || {};

              const createdDate = b.createdAt?.toDate
                ? b.createdAt.toDate().toLocaleDateString()
                : "-";

              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{p.mrNo || "-"}</td>
                  <td className="p-3 border-b">{p.name || "-"}</td>
                  <td className="p-3 border-b">{p.phone || "-"}</td>
                  <td className="p-3 border-b">{firstItem.cc || "—"}</td>
                  <td className="p-3 border-b">{createdDate}</td>

                  <td className="p-3 space-x-3 border-b">
                    <button
                      onClick={() => openViewModal(b)}
                      className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteBill(b.id)}
                      className="px-4 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredBills.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No bills found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* -------------------- VIEW MODAL -------------------- */}
      {isModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-4xl p-6 bg-white rounded shadow-xl">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Bill Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>

            {/* Patient Info */}
            <div className="p-4 mb-4 border rounded bg-gray-50">
              <h3 className="mb-2 text-lg font-semibold">Patient Details</h3>

              <p><strong>MR No:</strong> {selectedBill.patient?.mrNo}</p>
              <p><strong>Name:</strong> {selectedBill.patient?.name}</p>
              <p><strong>Phone:</strong> {selectedBill.patient?.phone}</p>
              <p><strong>Gender:</strong> {selectedBill.patient?.gender}</p>
              <p><strong>Age:</strong> {selectedBill.patient?.age}</p>
              <p><strong>Address:</strong> {selectedBill.patient?.address}</p>

              {selectedBill.createdAt?.toDate && (
                <p className="mt-1 text-sm text-gray-600">
                  <strong>Created At:</strong>{" "}
                  {selectedBill.createdAt.toDate().toLocaleString()}
                </p>
              )}
            </div>

            {/* Items Table */}
            <h3 className="mb-2 text-lg font-semibold">Bill Items</h3>

            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-sm">
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
                  </tr>
                </thead>

                <tbody>
                  {selectedBill.items?.map((item, i) => (
                    <tr key={i} className="text-center">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{item.eye}</td>
                      <td className="p-2 border">{item.cc}</td>
                      <td className="p-2 border">{item.glass}</td>
                      <td className="p-2 border">{item.duration}</td>
                      <td className="p-2 border">{item.distance}</td>
                      <td className="p-2 border">{item.progression}</td>
                      <td className="p-2 border">{item.association}</td>
                      <td className="p-2 border">{item.others}</td>
                    </tr>
                  ))}

                  {(!selectedBill.items || selectedBill.items.length === 0) && (
                    <tr>
                      <td colSpan="9" className="p-3 text-center text-gray-500 border">
                        No items in this bill
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
