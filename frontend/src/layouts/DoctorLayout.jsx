import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/doctor/logout");
      toast.success("Session terminated");
    } finally {
      navigate("/doctor/login");
    }
  };

  return (
    <div className="relative min-h-screen flex bg-[#020617] text-white overflow-hidden">

      <div className="pointer-events-none absolute inset-0 opacity-[0.03]
        bg-[linear-gradient(to_right,white_1px,transparent_1px),
        linear-gradient(to_bottom,white_1px,transparent_1px)]
        bg-[size:60px_60px]" />

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
      <aside
        className={`
          fixed z-50 inset-y-0 left-0 w-[300px]
          bg-gradient-to-b from-[#020617]/95 to-black/95
          backdrop-blur-2xl border-r border-white/10
          px-7 py-8 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="relative mb-14">
          <div className="absolute -inset-2 bg-emerald-600/20 blur-2xl rounded-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-60 rounded-xl" />
              <div className="relative w-12 h-12 rounded-xl bg-emerald-600/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-lg">H</span>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest text-gray-400 uppercase">
                Hospital OS
              </p>
              <h2 className="text-xl font-semibold tracking-tight">
                Doctor Console
              </h2>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="absolute top-1 right-1 lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <SideLink to="/doctor/dashboard" icon={<LayoutDashboard size={18} />}>
            Dashboard
          </SideLink>

          <SideLink to="/doctor/patients" icon={<Users size={18} />}>
            Patients
          </SideLink>

          <SideLink to="/doctor/add-patient" icon={<UserPlus size={18} />}>
            Add Patient
          </SideLink>
        </nav>
        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-xs text-gray-400">
              Secure medical session active
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
            text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <header className="lg:hidden h-16 flex items-center justify-between px-5
          border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
          <button onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>

          <span className="text-xs tracking-[0.3em] text-gray-400 uppercase">
            Doctor Console
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
const SideLink = ({ to, icon, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all
        ${
          isActive
            ? "bg-emerald-600/15 text-emerald-400"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }
      `
      }
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full
        ${
          "bg-emerald-500 opacity-0 group-[.active]:opacity-100"
        }`}
      />

      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 font-medium">{children}</span>
    </NavLink>
  );
};
