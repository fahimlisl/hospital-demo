import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Trash2, FileText } from "lucide-react";

const PatientList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [activePatient, setActivePatient] = useState(null);
  const [addingVisit, setAddingVisit] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/doctor/fetchAllPatient");
        setPatients(res.data.data);
        setFiltered(res.data.data);
      } catch {
        toast.error("Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      patients.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.phoneNumber.toString().includes(q)
      )
    );
  }, [search, patients]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this patient permanently?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/doctor/removePatient/${id}`);
      setPatients((prev) => prev.filter((p) => p._id !== id));
      toast.success("Patient removed");
    } catch {
      toast.error("Failed to remove patient");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddVisit = async () => {
    if (!purpose.trim()) {
      toast.error("Purpose is required");
      return;
    }

    setAddingVisit(true);
    try {
      await api.post(`/doctor/addVisit/${activePatient._id}`, { purpose });

      toast.success("New visit started");
      setShowModal(false);
      setPurpose("");

      navigate(`/doctor/checkup/${activePatient._id}`);
    } catch {
      toast.error("Failed to add visit");
    } finally {
      setAddingVisit(false);
    }
  };

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        Loading patients…
      </div>
    );
  }

  return (
    <div className="space-y-10">

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Patients
          </h1>
          <p className="text-gray-400 mt-2">
            Search, manage, visits & prescriptions
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04]
            border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="h-60 flex flex-col items-center justify-center text-gray-400">
          <p className="text-lg font-medium">No patients found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="relative rounded-[26px] bg-white/[0.04]
              backdrop-blur-xl border border-white/10 p-6
              hover:bg-white/[0.07] transition"
            >
              <div>
                <p className="text-lg font-semibold">{p.fullName}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Phone · {p.phoneNumber}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">

                <ActionButton
                  icon={<Eye size={16} />}
                  label="Visits"
                  onClick={() =>
                    navigate(`/doctor/patient/${p._id}/visits`)
                  }
                  color="blue"
                />

                <ActionButton
                  icon={<FileText size={16} />}
                  label="Prescription"
                  onClick={() =>
                    navigate(`/doctor/prescriptions/${p._id}`)
                  }
                  color="purple"
                />

                <ActionButton
                  icon={<Plus size={16} />}
                  label="Add Visit"
                  onClick={() => {
                    setActivePatient(p);
                    setShowModal(true);
                  }}
                  color="emerald"
                />

                <ActionButton
                  icon={<Trash2 size={15} />}
                  label={deletingId === p._id ? "Removing…" : "Remove"}
                  onClick={() => handleDelete(p._id)}
                  color="red"
                  disabled={deletingId === p._id}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[28px] bg-[#020617]
          border border-white/10 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">

            <h2 className="text-xl font-semibold mb-2">
              Start New Visit
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Patient · {activePatient?.fullName}
            </p>

            <input
              placeholder="Purpose of visit"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04]
              border border-white/10 focus:ring-2 focus:ring-emerald-600/40"
            />

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleAddVisit}
                disabled={addingVisit}
                className="px-6 py-3 rounded-xl bg-emerald-600
                text-white text-sm font-medium hover:bg-emerald-700
                disabled:opacity-50"
              >
                {addingVisit ? "Starting…" : "Start Visit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;

const ActionButton = ({ icon, label, onClick, color, disabled }) => {
  const colors = {
    blue: "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30",
    emerald: "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30",
    red: "border border-red-500/30 text-red-400 hover:bg-red-500/10",
    purple: "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2
      rounded-full text-sm transition disabled:opacity-50 ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
};
