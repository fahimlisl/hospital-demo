import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { Option } from "../../../components/StepUI";

const StepFive = ({ patientId, visit, onDone }) => {
  const step = visit.stepFive?.[0];
  const [normality, setNormality] = useState(step?.normality ?? null);
  const [loading, setLoading] = useState(false);

  if (step?.isSubmitted) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-gray-400">
        Step 5 completed
      </div>
    );
  }

  const submit = async () => {
    if (normality === null) {
      toast.error("Select an option");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/doctor/fifthStep/${patientId}`, {
        normality,
        isSubmitted: true,
      });
      toast.success("Step 5 saved");
      onDone(); 
    } catch {
      toast.error("Failed to submit step");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
      <h2 className="font-semibold text-lg mb-6">
        Step 5: Convergence Test
      </h2>

      <div className="flex gap-4 mb-6">
        <Option
          label="Normal"
          active={normality === true}
          onClick={() => setNormality(true)}
        />
        <Option
          label="Not Normal"
          danger
          active={normality === false}
          onClick={() => setNormality(false)}
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="px-6 py-2 rounded-xl bg-emerald-600 text-white"
      >
        {loading ? "Saving..." : "Save Step"}
      </button>
    </div>
  );
};

export default StepFive;
