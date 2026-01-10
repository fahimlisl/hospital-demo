import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const VisitDetails = () => {
  const { visitId } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await api.get(
          `/doctor/fetchParticularVisit/${visitId}`
        );
        setVisit(res.data.data);
      } catch {
        toast.error("Failed to load visit details");
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [visitId]);

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        Loading visit...
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        Visit not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-3xl font-semibold tracking-tight">
          Visit Summary
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Purpose: {visit.purpose?.value || "—"}
        </p>
      </div>

      <div className="space-y-6">
        <StepCard title="Step 1 · History">
          <InfoRow
            label="Age"
            value={visit.stepFirst?.[0]?.age}
            submitted={visit.stepFirst?.[0]?.isSubmitted}
          />
        </StepCard>

        <StepCard title="Step 2 · Vision Test">
          <BooleanRow
            label="Distance Vision"
            value={visit.stepSecond?.[0]?.distanceVision}
          />
          <BooleanRow
            label="Near Vision"
            value={visit.stepSecond?.[0]?.nearVision}
          />
        </StepCard>

        <StepCard title="Step 3 · Torchlight Test">
          <BooleanRow
            label="Response"
            value={visit.stepThird?.[0]?.normality}
          />
        </StepCard>

        <StepCard title="Step 4 · Cover–Uncover Test">
          <BooleanRow
            label="Alignment"
            value={visit.stepFourth?.[0]?.normality}
          />
        </StepCard>

        <StepCard title="Step 5 · Convergence Test">
          <BooleanRow
            label="Convergence"
            value={visit.stepFive?.[0]?.normality}
          />
        </StepCard>
      </div>
    </div>
  );
};

export default VisitDetails;


const StepCard = ({ title, children }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, submitted }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400">{label}</span>
    <span>{submitted ? value : "—"}</span>
  </div>
);

const BooleanRow = ({ label, value }) => {
  if (value === undefined) {
    return (
      <div className="flex justify-between text-sm text-gray-500">
        <span>{label}</span>
        <span>Not submitted</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>
      <span
        className={`px-3 py-1 rounded-full text-xs ${
          value
            ? "bg-emerald-600/20 text-emerald-400"
            : "bg-red-600/20 text-red-400"
        }`}
      >
        {value ? "Normal" : "Not Normal"}
      </span>
    </div>
  );
};
