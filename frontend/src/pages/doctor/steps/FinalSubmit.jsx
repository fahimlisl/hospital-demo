import api from "../../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FinalSubmit = ({ patientId, visit }) => {
  const navigate = useNavigate();

  if (visit.isCompleted) return null;

  const submit = async () => {
    try {
      await api.patch(`/doctor/finalSubmit/${patientId}`);
      toast.success("Visit completed");

      navigate(`/doctor/prescription/${patientId}/${visit._id}`);
    } catch {
      toast.error("Final submit failed");
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
      <button
        onClick={submit}
        className="w-full py-3 rounded-xl bg-emerald-600 text-white"
      >
        Final Submit Visit
      </button>
    </div>
  );
};

export default FinalSubmit;
