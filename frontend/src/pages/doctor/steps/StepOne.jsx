import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { StatusButtons } from "../../../components/StepUI";

const StepOne = ({ patientId, visit }) => {
  const age = visit?.stepFirst?.[0]?.age;
  const purpose = visit?.purpose?.value;
  const alreadySubmitted = visit?.stepFirst?.[0]?.isSubmitted;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(alreadySubmitted);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.patch(`/doctor/check/${patientId}`);
      toast.success("History submitted");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6">
      <h2 className="text-lg font-semibold mb-4">
        Step 1 · Patient History
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Info label="Purpose of Visit" value={purpose} />
        <Info label="Age" value={`${age} years`} />
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Confirm History"}
        </button>
      ) : (
        <StatusButtons />
      )}
    </div>
  );
};

export default StepOne;

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-medium mt-1">
      {value || "—"}
    </p>
  </div>
);
