import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const StepThree = ({ patientId }) => {
  const [normality, setNormality] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (normality === null) {
      toast.error("Please select an option");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/doctor/thirdStep/${patientId}`, {
        normality,
        isSubmitted: true,
      });

      toast.success("Torchlight test submitted");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit torchlight test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
      <h2 className="font-semibold mb-6 text-lg">
        Step 3: Torchlight Test
      </h2>

      <div className="flex gap-4 mb-6">
        <Option
          label="Normal"
          active={normality === true}
          disabled={submitted}
          onClick={() => setNormality(true)}
        />
        <Option
          label="Not Normal"
          danger
          active={normality === false}
          disabled={submitted}
          onClick={() => setNormality(false)}
        />
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded-xl disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      ) : (
        <StatusButtons submitted />
      )}
    </div>
  );
};


const Option = ({ label, active, onClick, danger, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-xl border transition
      ${disabled && "opacity-40 cursor-not-allowed"}
      ${
        active
          ? danger
            ? "bg-red-600/20 border-red-500 text-red-400"
            : "bg-emerald-600/20 border-emerald-500 text-emerald-400"
          : "border-white/10 text-gray-400 hover:bg-white/10"
      }`}
  >
    {label}
  </button>
);

const StatusButtons = () => (
  <div className="flex gap-3 mt-4">
    <span className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 text-sm">
      ✔ Submitted
    </span>

    <button
      disabled
      className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-sm cursor-not-allowed"
    >
      Edit (coming soon)
    </button>
  </div>
);

export default StepThree;
