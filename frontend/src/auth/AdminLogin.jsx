import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
} from "lucide-react";

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("admin@test.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  // const [email,setEmail] = useState("admin@test.com");
  // const [password,setPassword] 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { phoneNumber: identifier, password };

      await api.post("/admin/login", payload); // cookie will be set

      toast.success("Administrative access granted");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden px-4">

      {/* Background */}
      <div className="absolute inset-0 opacity-[0.035]
        bg-[linear-gradient(to_right,white_1px,transparent_1px),
        linear-gradient(to_bottom,white_1px,transparent_1px)]
        bg-[size:48px_48px]"
      />

      <div className="absolute -top-1/3 -left-1/3 w-[800px] h-[800px] bg-blue-600/25 blur-[180px]" />
      <div className="absolute -bottom-1/3 -right-1/3 w-[800px] h-[800px] bg-indigo-600/25 blur-[180px]" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-[38px]
        border border-white/10 bg-white/[0.035]
        backdrop-blur-2xl p-12
        shadow-[0_90px_200px_rgba(0,0,0,0.9)]"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-7">
            <div className="absolute inset-0 blur-2xl bg-blue-600/40 rounded-full" />
            <div className="relative w-16 h-16 rounded-2xl
              bg-gradient-to-br from-blue-600 to-indigo-600
              flex items-center justify-center
              shadow-[0_30px_90px_rgba(59,130,246,0.65)]"
            >
              <ShieldCheck className="text-white" size={28} />
            </div>
          </div>

          <span className="text-[11px] tracking-[0.45em] text-blue-400 uppercase mb-3">
            Restricted Access
          </span>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Admin Control Panel
          </h1>

          <p className="text-sm text-gray-400 mt-3 max-w-xs leading-relaxed">
            System-level access for managing doctors, patients,
            and hospital operations.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <Input
            label="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <div className="mt-12">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full inline-flex items-center justify-center gap-3
            px-6 py-4 rounded-2xl
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white font-medium
            shadow-[0_35px_120px_rgba(59,130,246,0.55)]
            hover:shadow-[0_45px_160px_rgba(59,130,246,0.8)]
            transition-all disabled:opacity-60"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Lock size={18} />
              {loading ? "Verifying..." : "Enter Admin Console"}
            </span>

            <ArrowRight
              size={18}
              className="relative z-10 opacity-70
              group-hover:translate-x-1 transition"
            />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-500 tracking-wide">
            Role-based access · Audit-ready · Secure sessions
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;

const Input = ({ label, type = "text", value, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-3 rounded-xl
      bg-black/50 border border-white/10
      text-white placeholder-gray-500
      focus:outline-none focus:ring-2
      focus:ring-blue-500/40
      focus:border-blue-500/40
      transition"
    />
  </div>
);
