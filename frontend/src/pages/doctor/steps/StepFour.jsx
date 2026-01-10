import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { Option, StatusButtons } from "../../../components/StepUI";

const StepFour = ({ patientId }) => {
  const [normality, setNormality] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (normality === null) {
      toast.error("Select an option");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/doctor/foruthStep/${patientId}`, {
        normality,
        isSubmitted: true,
      });
      toast.success("Cover–Uncover test submitted");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
      <h2 className="font-semibold text-lg mb-6">Step 4: Cover–Uncover Test</h2>

      <div className="flex gap-4 mb-6">
        <Option label="Normal" active={normality === true} disabled={submitted} onClick={() => setNormality(true)} />
        <Option label="Not Normal" danger active={normality === false} disabled={submitted} onClick={() => setNormality(false)} />
      </div>

      {!submitted ? (
        <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 px-6 py-2 rounded-xl">
          {loading ? "Submitting..." : "Submit Test"}
        </button>
      ) : (
        <StatusButtons />
      )}
    </div>
  );
};

export default StepFour;
