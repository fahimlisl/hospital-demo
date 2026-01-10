import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { Option } from "../../../components/StepUI";

const StepSeven = ({ patientId, visit, onDone }) => {
  const step = visit.stepSeven?.[0];
  const [ans, setAns] = useState(step?.ans ?? null);
  const [loading, setLoading] = useState(false);

  if (step?.isSubmitted) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-gray-400">
        Step 7 completed
      </div>
    );
  }

  const submit = async () => {
    if (ans === null) {
      toast.error("Select an option");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/doctor/sevenStep/${patientId}`, { ans });
      toast.success("Step 7 saved");
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
        Step 7: Near Vision
      </h2>

      <div className="flex gap-4 mb-6">
        <Option label="Yes" active={ans === true} onClick={() => setAns(true)} />
        <Option label="No" danger active={ans === false} onClick={() => setAns(false)} />
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

export default StepSeven;
