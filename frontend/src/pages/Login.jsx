import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden">

      <div
        className="absolute inset-0 opacity-[0.04]
        bg-[linear-gradient(to_right,white_1px,transparent_1px),
        linear-gradient(to_bottom,white_1px,transparent_1px)]
        bg-[size:48px_48px]"
      />

      <div className="absolute -top-1/3 -left-1/3 w-[900px] h-[900px] bg-blue-600/25 blur-[200px]" />
      <div className="absolute -bottom-1/3 -right-1/3 w-[900px] h-[900px] bg-indigo-600/25 blur-[200px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/20 blur-[160px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div className="text-center lg:text-left">
            <span className="inline-block mb-6 text-[11px] tracking-[0.45em] uppercase text-blue-400">
              Hospital Management Platform
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-tight text-white leading-tight">
              Clinical Operations
              <br />
              <span className="text-blue-400">
                Simplified & Secured
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-gray-400">
              Founder ·{" "}
              <span className="text-gray-200 font-medium tracking-wide">
                You
              </span>
            </p>

            <p className="mt-8 text-gray-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A centralized system for managing patients, clinical visits,
              and medical workflows with enterprise-grade security and
              strict role-based access.
            </p>

            <div className="hidden lg:flex mt-12 gap-6">
              <PrimaryCTA
                to="/admin/login"
                icon={<ShieldCheck size={18} />}
                label="Admin Console"
                gradient="from-blue-600 to-indigo-600"
              />

              <SecondaryCTA
                to="/doctor/login"
                icon={<Stethoscope size={18} />}
                label="Doctor Workspace"
                gradient="from-emerald-600 to-teal-600"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="w-full max-w-md rounded-[36px]
              border border-white/10 bg-white/[0.035]
              backdrop-blur-2xl p-10
              shadow-[0_80px_180px_rgba(0,0,0,0.85)]"
            >

              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-blue-600/40 rounded-2xl" />
                  <div
                    className="relative w-16 h-16 rounded-2xl
                    bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600
                    flex items-center justify-center
                    text-white font-bold text-xl
                    shadow-[0_25px_80px_rgba(59,130,246,0.6)]"
                  >
                    HMS
                  </div>
                </div>
              </div>

              <h2 className="text-center text-xl font-semibold text-white">
                Choose Access
              </h2>

              <p className="text-center text-sm text-gray-400 mt-2">
                Select your role to continue
              </p>

              <div className="mt-10 space-y-5">
                <PrimaryCTA
                  to="/admin/login"
                  icon={<ShieldCheck size={18} />}
                  label="Continue as Admin"
                  gradient="from-blue-600 to-indigo-600"
                  full
                />

                <SecondaryCTA
                  to="/doctor/login"
                  icon={<Stethoscope size={18} />}
                  label="Continue as Doctor"
                  gradient="from-emerald-600 to-teal-600"
                  full
                />
              </div>

              <p className="mt-12 text-center text-[11px] tracking-wide text-gray-500">
                Developed & maintained by{" "}
                <span className="text-gray-300 font-medium">
                  <a href="https://fahim.in">Fahim Abdullah</a>
                </span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

const PrimaryCTA = ({ to, icon, label, gradient, full }) => (
  <Link
    to={to}
    className={`group relative inline-flex items-center justify-center gap-3
    ${full ? "w-full" : ""}
    px-6 py-4 rounded-2xl
    bg-gradient-to-r ${gradient}
    text-white font-medium
    shadow-[0_30px_100px_rgba(59,130,246,0.55)]
    hover:shadow-[0_40px_140px_rgba(59,130,246,0.8)]
    transition`}
  >
    {icon}
    {label}
    <ArrowRight
      size={16}
      className="opacity-70 group-hover:translate-x-1 transition"
    />
  </Link>
);

const SecondaryCTA = ({ to, icon, label, gradient, full }) => (
  <Link
    to={to}
    className={`group relative inline-flex items-center justify-center gap-3
    ${full ? "w-full" : ""}
    px-6 py-4 rounded-2xl
    bg-white/[0.04] border border-white/10
    text-white font-medium
    hover:bg-white/[0.08]
    transition`}
  >
    <span
      className={`flex items-center gap-3
      bg-gradient-to-r ${gradient}
      bg-clip-text text-transparent`}
    >
      {icon}
      {label}
    </span>
    <ArrowRight
      size={16}
      className="opacity-60 group-hover:translate-x-1 transition"
    />
  </Link>
);
