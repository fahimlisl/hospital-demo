import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { Option, StatusButtons } from "../../../components/StepUI";

const StepTwo = ({ patientId }) => {
  const [distanceVision, setDistanceVision] = useState(null);
  const [nearVision, setNearVision] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (distanceVision === null || nearVision === null) {
      toast.error("Select all options");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/doctor/secondStep/${patientId}`, {
        distanceVision,
        nearVision,
      });
      toast.success("Vision test submitted");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit vision test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
      <h2 className="font-semibold text-lg mb-6">Step 2: Vision Test</h2>

      <p className="text-sm text-gray-400 mb-2">Distance Vision</p>
      <div className="flex gap-4 mb-6">
        <Option label="Normal" active={distanceVision === true} disabled={submitted} onClick={() => setDistanceVision(true)} />
        <Option label="Not Normal" danger active={distanceVision === false} disabled={submitted} onClick={() => setDistanceVision(false)} />
      </div>

      <p className="text-sm text-gray-400 mb-2">Near Vision</p>
      <div className="flex gap-4 mb-6">
        <Option label="Normal" active={nearVision === true} disabled={submitted} onClick={() => setNearVision(true)} />
        <Option label="Not Normal" danger active={nearVision === false} disabled={submitted} onClick={() => setNearVision(false)} />
      </div>

      {!submitted ? (
        <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 px-6 py-2 rounded-xl">
          {loading ? "Submitting..." : "Submit Vision Test"}
        </button>
      ) : (
        <StatusButtons />
      )}
    </div>
  );
};

export default StepTwo;
