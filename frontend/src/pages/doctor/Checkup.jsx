import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import StepFive from "./steps/StepFive";
import StepSix from "./steps/StepSix";
import StepSeven from "./steps/StepSeven";
import FinalSubmit from "./steps/FinalSubmit";

const Checkup = () => {
  const { patientId } = useParams();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveVisit = async () => {
    try {
      const res = await api.get(`/doctor/fetchAllVisit/${patientId}`);
      const data = res?.data?.data;

      let visits = [];

      if (Array.isArray(data)) visits = data;
      else if (Array.isArray(data?.steps?.visits))
        visits = data.steps.visits;
      else throw new Error("Invalid visits response");

      const activeVisit = visits.find((v) => !v.isCompleted);

      if (!activeVisit) {
        toast.error("No active visit found");
        return;
      }

      setVisit(activeVisit);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load active visit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveVisit();
  }, [patientId]);

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center text-gray-400">
        Loading checkup...
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="h-60 flex items-center justify-center text-gray-400">
        No active visit available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Patient Checkup</h1>

      <StepOne patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
      <StepTwo patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
      <StepThree patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
      <StepFour patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
      <StepFive patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
      <StepSix patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
      <StepSeven patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
      <FinalSubmit patientId={patientId} visit={visit} onDone={fetchActiveVisit} />
    </div>
  );
};

export default Checkup;
