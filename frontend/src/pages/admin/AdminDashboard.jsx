import { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  ClipboardCheck,
  Activity,
  ShieldCheck,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    patients: "—",
    doctors: "—",
    completed: "—",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, completedRes, doctorsRes] =
          await Promise.all([
            api.get("/doctor/countPatient"),     
            api.get("/doctor/countSuccess"),     
            api.get("/admin/countOfDoc"),        
          ]);

        setStats({
          patients: patientsRes.data.data,
          completed: completedRes.data.data,
          doctors: doctorsRes.data.data,
        });
      } catch (err) {
        toast.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-12 px-2 sm:px-0">
      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-white/10 bg-gradient-to-b from-[#020617] to-black p-6 sm:p-10 shadow-[0_80px_180px_rgba(0,0,0,0.8)]">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center ring-1 ring-blue-500/30">
              <ShieldCheck className="text-blue-400" />
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-blue-400">
              Admin Control
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight">
            System Overview
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl text-sm sm:text-base">
            Centralized visibility into doctors, patients, and
            completed clinical workflows.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        <Metric
          label="Total Patients"
          value={loading ? "—" : stats.patients}
          icon={<Users size={26} />}
          accent="blue"
        />

        <Metric
          label="Total Doctors"
          value={loading ? "—" : stats.doctors}
          icon={<Stethoscope size={26} />}
          accent="violet"
        />

        <Metric
          label="Completed Checkups"
          value={loading ? "—" : stats.completed}
          icon={<ClipboardCheck size={26} />}
          accent="emerald"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-10">
        <div className="rounded-[24px] sm:rounded-[28px] bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 sm:p-9">
          <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
            Platform Status
          </h2>

          <StatusRow label="Patient Database" status="Operational" />
          <StatusRow label="Doctor Services" status="Operational" />
          <StatusRow label="Visit Engine" status="Operational" />
          <StatusRow label="Audit Logs" status="Pending" />
        </div>

        <div className="rounded-[24px] sm:rounded-[28px] bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 sm:p-9">
          <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
            Administrative Scope
          </h2>

          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
            All administrative actions are authenticated,
            audited, and enforced system-wide. Doctor and
            patient data remain immutable and traceable.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

const Metric = ({ label, value, icon, accent }) => {
  const accents = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
  };

  return (
    <div className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] border border-white/10 bg-white/[0.04] p-6 sm:p-8 hover:bg-white/[0.07] transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-400">
            {label}
          </p>
          <p className="text-2xl sm:text-4xl font-semibold mt-1 sm:mt-2">
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-black/40 flex items-center justify-center ${accents[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatusRow = ({ label, status }) => {
  const good = status === "Operational";

  return (
    <div className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-black/40 border border-white/5 mb-3">
      <span className="text-gray-300 text-sm sm:text-base">
        {label}
      </span>
      <span
        className={`text-[10px] sm:text-xs px-3 py-1 rounded-full ${
          good
            ? "bg-emerald-600/20 text-emerald-400"
            : "bg-yellow-600/20 text-yellow-400"
        }`}
      >
        {status}
      </span>
    </div>
  );
};
