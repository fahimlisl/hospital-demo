import { useEffect, useState } from "react";
import {
  Users,
  Activity,
  ClipboardCheck,
  Plus,
  ArrowUpRight,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: null,
    completedCheckups: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, completedRes] = await Promise.all([
          api.get("/doctor/countPatient"),
          api.get("/doctor/countSuccess"),
        ]);

        setStats({
          totalPatients: patientsRes.data.data,
          completedCheckups: completedRes.data.data,
        });
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(16,185,129,0.15),transparent_40%),radial-gradient(800px_500px_at_90%_10%,rgba(59,130,246,0.15),transparent_40%),linear-gradient(180deg,#020617,#000)] p-10 shadow-[0_80px_180px_rgba(0,0,0,0.75)]">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative flex flex-col xl:flex-row justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 flex items-center justify-center ring-1 ring-emerald-500/30">
                <Stethoscope className="text-emerald-400" />
              </div>

              <span className="text-xs tracking-[0.2em] text-emerald-400 uppercase">
                Doctor Workspace
              </span>
            </div>

            <h1 className="text-[2.6rem] leading-tight font-semibold tracking-tight">
              Clinical Command Center
            </h1>

            <p className="text-gray-400 mt-4 leading-relaxed">
              A focused environment to manage patients, initiate visits,
              and complete clinical examinations with confidence.
            </p>
          </div>

          <div className="flex items-end">
            <Link
              to="/doctor/add-patient"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-medium shadow-[0_20px_60px_rgba(16,185,129,0.45)] hover:shadow-[0_30px_80px_rgba(16,185,129,0.6)] hover:bg-emerald-700 transition-all"
            >
              <Plus size={20} />
              New Patient
              <ArrowUpRight
                size={16}
                className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Signal
          label="Total Patients"
          value={loading ? "—" : stats.totalPatients}
          icon={<Users size={26} />}
          accent="emerald"
        />

        <Signal
          label="Active Visits"
          value="—"
          icon={<Activity size={26} />}
          accent="blue"
        />

        <Signal
          label="Completed Checkups"
          value={loading ? "—" : stats.completedCheckups}
          icon={<ClipboardCheck size={26} />}
          accent="violet"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="rounded-[28px] bg-white/[0.04] backdrop-blur-xl border border-white/10 p-9">
          <h2 className="text-xl font-semibold mb-7">
            System Health
          </h2>

          <div className="space-y-4">
            <StatusRow label="Patient Records" status="Operational" />
            <StatusRow label="Visit Workflow" status="Operational" />
            <StatusRow label="Clinical Steps Engine" status="Operational" />
            <StatusRow label="Reporting Module" status="Pending" />
          </div>
        </div>

        <div className="rounded-[28px] bg-white/[0.04] backdrop-blur-xl border border-white/10 p-9">
          <h2 className="text-xl font-semibold mb-7">
            Navigation
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <NavTile to="/doctor/patients" label="Patients" />
            <NavTile to="/doctor/add-patient" label="Add Patient" />
            <NavTile to="/doctor/patients" label="Start Visit" />
            <NavTile disabled label="Analytics" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;

const Signal = ({ label, value, icon, accent }) => {
  const colors = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    violet: "text-violet-400",
  };

  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-7 transition hover:bg-white/[0.07]">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/10 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-3xl font-semibold mt-1">{value}</p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center ${colors[accent]}`}
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
    <div className="flex items-center justify-between px-5 py-4 rounded-xl bg-black/40 border border-white/5">
      <span className="text-gray-300">{label}</span>
      <span
        className={`text-xs px-3 py-1 rounded-full ${
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

const NavTile = ({ to, label, disabled }) => {
  if (disabled) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-500 py-6 cursor-not-allowed">
        {label}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl bg-white/10 border border-white/10 py-6 flex items-center justify-center hover:bg-white/20 transition"
    >
      <span className="font-medium">{label}</span>
      <ArrowUpRight
        size={16}
        className="absolute right-6 opacity-0 group-hover:opacity-100 transition"
      />
    </Link>
  );
};
