import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit3,
  Stethoscope,
  X,
} from "lucide-react";

const emptyForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  qualification: "",
  department: "",
};

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // modal
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // feth docotr
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/admin/fetchAllDoctor");
        setDoctors(res.data.data);
      } catch {
        toast.error("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove doctor permanently?")) return;

    setDeleting(id);
    try {
      await api.delete(`/admin/removeDoc/${id}`);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
      toast.success("Doctor removed");
    } catch {
      toast.error("Failed to remove doctor");
    } finally {
      setDeleting(null);
    }
  };


  const openAdd = () => {
    setMode("add");
    setForm(emptyForm);
    setActiveDoctor(null);
    setOpen(true);
  };

  const openEdit = (doc) => {
    setMode("edit");
    setActiveDoctor(doc);
    setForm({
      fullName: doc.fullName || "",
      email: doc.email || "",
      phoneNumber: doc.phoneNumber || "",
      password: "",
      qualification: doc.qualification || "",
      department: doc.department || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.email || !form.phoneNumber) {
      toast.error("Name, Email & Phone are required");
      return;
    }

    setSaving(true);
    try {
      if (mode === "add") {
        if (!form.password) {
          toast.error("Password is required");
          setSaving(false);
          return;
        }

        const res = await api.post("/admin/registerDoc", form);
        setDoctors((prev) => [res.data.data, ...prev]);
        toast.success("Doctor registered");
      } else {
        const res = await api.patch(
          `/admin/updateDoctor/${activeDoctor._id}`,
          form
        );

        setDoctors((prev) =>
          prev.map((d) =>
            d._id === activeDoctor._id ? res.data.data : d
          )
        );

        toast.success("Doctor updated");
      }

      setOpen(false);
      setForm(emptyForm);
      setActiveDoctor(null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Operation failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center text-gray-400">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Doctors</h1>
          <p className="text-sm text-gray-400">
            Manage hospital doctors
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add Doctor
        </button>
      </div>

      {/* LIST */}
      {doctors.length === 0 ? (
        <div className="text-gray-400 text-center py-20">
          No doctors registered
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                  <Stethoscope className="text-emerald-400" />
                </div>

                <div>
                  <p className="font-semibold">{doc.fullName}</p>
                  <p className="text-sm text-gray-400">
                    {doc.department || "—"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-400">{doc.email}</p>
              <p className="text-sm text-gray-400">
                {doc.phoneNumber}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => openEdit(doc)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-white/10 hover:bg-white/5"
                >
                  <Edit3 size={14} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(doc._id)}
                  disabled={deleting === doc._id}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  {deleting === doc._id
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#070b18] border border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {mode === "add"
                  ? "Add Doctor"
                  : "Edit Doctor"}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              {Object.keys(emptyForm).map((key) => {
                if (mode === "edit" && key === "password")
                  return null;

                return (
                  <input
                    key={key}
                    placeholder={key}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10"
                  />
                );
              })}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
