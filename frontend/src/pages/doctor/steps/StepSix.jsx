import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { Option, StatusButtons } from "../../../components/StepUI";

const StepSix = ({ patientId, visit }) => {
  const step = visit?.stepSix?.[0];

  const [fogging, setFogging] = useState(false);
  const [jcc, setJcc] = useState(false);
  const [duochrome, setDuochrome] = useState("balanced");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!step) return;

    setFogging(step.fogging ?? false);
    setJcc(step.jcc ?? false);
    setDuochrome(step.duochrome || "balanced");
  }, [step]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.patch(`/doctor/sixthStep/${patientId}`, {
        fog: fogging,
        jcc: jcc,
        duochrome,
      });

      toast.success("Step 6 saved");
    } catch {
      toast.error("Failed to save step 6");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
      <h2 className="font-semibold text-lg mb-6">
        Step 6 · Subjective Assessment
      </h2>

      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">
          Fogging
        </p>

        <div className="flex gap-4">
          <Option
            label="Refined"
            active={fogging === true}
            onClick={() => setFogging(true)}
          />
          <Option
            label="Not Refined"
            danger
            active={fogging === false}
            onClick={() => setFogging(false)}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">
          JCC
        </p>

        <div className="flex gap-4">
          <Option
            label="Refined"
            active={jcc === true}
            onClick={() => setJcc(true)}
          />
          <Option
            label="Not Refined"
            danger
            active={jcc === false}
            onClick={() => setJcc(false)}
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">
          Duochrome
        </p>

        <select
          value={duochrome}
          onChange={(e) => setDuochrome(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10
          focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
        >
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="balanced">Balanced</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-600 px-6 py-2 rounded-xl text-white
          hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Step 6"}
        </button>
      </div>

      {step?.isSubmitted && <StatusButtons />}
    </div>
  );
};

export default StepSix;
