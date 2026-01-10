import { Link } from "react-router-dom";
import {
  Eye,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  ScanEye,
  HeartPulse,
  Sparkles,
} from "lucide-react";

const Home = () => {
  return (
    <div className="bg-[#020617] text-white overflow-hidden">

      <header className="fixed top-0 left-0 w-full z-50">
        <div className="backdrop-blur-xl bg-black/40 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Eye className="text-blue-400" />
              <span className="font-semibold tracking-wide">
                ABC HOSPITAL
              </span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-sm text-gray-300">
              <a href="#vision" className="hover:text-white transition">
                Vision
              </a>
              <a href="#services" className="hover:text-white transition">
                Services
              </a>
              <a href="#founder" className="hover:text-white transition">
                Founder
              </a>
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white
                hover:bg-blue-700 transition shadow-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center pt-32">
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-blue-600/20 blur-[220px]" />
          <div className="absolute -bottom-1/2 -right-1/2 w-[1000px] h-[1000px] bg-indigo-600/20 blur-[220px]" />
          <div className="absolute inset-0 opacity-[0.03]
            bg-[linear-gradient(to_right,white_1px,transparent_1px),
            linear-gradient(to_bottom,white_1px,transparent_1px)]
            bg-[size:48px_48px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div>
            <span className="inline-flex items-center gap-2 mb-6
              text-xs tracking-[0.45em] uppercase text-blue-400">
              <Sparkles size={14} />
              Advanced Eye Hospital
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold leading-tight">
              Redefining
              <br />
              <span className="text-blue-400">
                Vision Care
              </span>
            </h1>

            <p className="mt-8 text-gray-400 max-w-xl leading-relaxed text-lg">
              Precision diagnostics, trusted specialists, and
              technology-driven care — designed to protect what
              matters most: <b className="text-gray-200">your vision</b>.
            </p>

            <div className="mt-12 flex flex-wrap gap-5">
              <Link
                to="/login"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                bg-blue-600 hover:bg-blue-700 transition
                shadow-[0_30px_120px_rgba(59,130,246,0.6)]"
              >
                Access Portal
                <ArrowRight size={18} />
              </Link>

              <a
                href="#services"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                bg-white/10 hover:bg-white/20 transition"
              >
                Explore Services
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[36px] bg-white/[0.04]
              border border-white/10 backdrop-blur-xl p-10">

              <div className="grid grid-cols-2 gap-6">
                <Trust
                  icon={<ShieldCheck />}
                  title="Secure Records"
                  desc="Medical-grade data protection"
                />
                <Trust
                  icon={<Stethoscope />}
                  title="Expert Doctors"
                  desc="Certified specialists"
                />
                <Trust
                  icon={<ScanEye />}
                  title="Advanced Imaging"
                  desc="Precision diagnostics"
                />
                <Trust
                  icon={<HeartPulse />}
                  title="Patient First"
                  desc="Compassion-led care"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-20">
            Specialized Eye Care Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <Service title="Comprehensive Eye Exams" />
            <Service title="Cataract & LASIK Surgery" />
            <Service title="Retina & Glaucoma Care" />
            <Service title="Pediatric Ophthalmology" />
            <Service title="Contact Lens Clinic" />
            <Service title="Digital Prescriptions" />
          </div>
        </div>
      </section>

      <section id="founder" className="py-32 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.4em] uppercase text-blue-400">
            Founder
          </span>

          <h3 className="mt-6 text-3xl font-semibold">
            ABC YOU
          </h3>

          <p className="mt-8 text-gray-400 leading-relaxed max-w-3xl mx-auto text-lg">
            This platform was built with a single philosophy —
            <b className="text-gray-200"> healthcare systems should empower doctors, not slow them down.</b>
            Every interaction is designed to reduce friction,
            increase accuracy, and restore focus where it belongs:
            patient care.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 text-center text-sm text-gray-500">
        Developed & maintained by{" "}
        <span className="text-gray-300 font-medium">
          <a href="https://fahim.in">Fahim Abdullah</a>
        </span>
      </footer>
    </div>
  );
};

export default Home;


const Trust = ({ icon, title, desc }) => (
  <div className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition">
    <div className="text-blue-400 mb-3">{icon}</div>
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const Service = ({ title }) => (
  <div className="p-7 rounded-3xl bg-white/[0.04] border border-white/10
    hover:bg-white/[0.07] hover:-translate-y-1 transition-all">
    <h4 className="font-semibold mb-3">{title}</h4>
    <p className="text-sm text-gray-400">
      Delivered with precision, care, and modern technology.
    </p>
  </div>
);
