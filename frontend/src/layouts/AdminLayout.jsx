import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
      toast.success("Logged out");
    } finally {
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white flex">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-[260px] bg-[#070b18] border-r border-white/10 px-6 py-8 flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold shadow-lg">
              ADM
            </div>
            <div>
              <p className="font-semibold">Admin Panel</p>
              <p className="text-xs text-gray-400">
                System Authority
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          <AdminNav to="/admin/dashboard" icon={<LayoutDashboard size={18} />}>
            Dashboard
          </AdminNav>

          <AdminNav to="/admin/doctors" icon={<Stethoscope size={18} />}>
            Doctors
          </AdminNav>

          <AdminNav disabled icon={<Users size={18} />}>
            Patients
          </AdminNav>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 text-sm text-red-400 hover:text-red-500 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-white/10 bg-[#050814]">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-300 hover:text-white"
          >
            <Menu size={22} />
          </button>

          <span className="text-sm text-gray-400">
            Admin Console
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


const AdminNav = ({ to, icon, children, disabled }) => {
  if (disabled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 cursor-not-allowed">
        {icon}
        {children}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
          isActive
            ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30"
            : "text-gray-300 hover:bg-white/5"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
};
