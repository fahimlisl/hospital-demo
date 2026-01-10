import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { UserPlus, ArrowRight } from "lucide-react";

const AddPatient = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    DOB: "",          
    age: "",
    purpose: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "DOB") {
      const year = Number(value);
      const currentYear = new Date().getFullYear();

      const age =
        year >= 1900 && year <= currentYear
          ? currentYear - year
          : "";

      setForm((prev) => ({
        ...prev,
        DOB: value,
        age,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.gender) {
      toast.error("Gender is required");
      return;
    }

    if (!form.DOB || isNaN(Number(form.DOB))) {
      toast.error("Valid year of birth required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/doctor/addPatient", {
        fullName: form.fullName,
        phoneNumber: Number(form.phoneNumber),
        email: form.email,
        DOB: Number(form.DOB),       
        purpose: form.purpose,
        gender: form.gender,
      });

      toast.success("Patient registered successfully");
      navigate(`/doctor/checkup/${res.data.data._id}`);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add patient"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center ring-1 ring-emerald-500/30">
            <UserPlus className="text-emerald-400" />
          </div>
          <span className="text-[11px] tracking-[0.3em] text-emerald-400 uppercase">
            Patient Intake
          </span>
        </div>

        <h1 className="text-3xl font-semibold">
          Register New Patient
        </h1>

        <p className="text-gray-400 mt-2">
          Enter year of birth — age is auto-calculated
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <Input label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />

          <Input
            label="Year of Birth"
            name="DOB"
            type="number"
            placeholder="YYYY"
            value={form.DOB}
            onChange={handleChange}
            required
          />

          <Input label="Age" value={form.age} disabled />

          <Input
            label="Purpose of Visit"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
          />

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-400">
              Gender <span className="text-emerald-400">*</span>
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer Not To Say</option>
            </select>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            disabled={loading}
            className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 transition"
          >
            {loading ? "Registering..." : "Register Patient"}
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;

const Input = ({ label, disabled, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-400">{label}</label>
    <input
      {...props}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    />
  </div>
);
