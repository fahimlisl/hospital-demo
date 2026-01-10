export const Option = ({ label, active, onClick, danger, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-xl border transition
      ${disabled && "opacity-40 cursor-not-allowed"}
      ${
        active
          ? danger
            ? "bg-red-600/20 border-red-500 text-red-400"
            : "bg-emerald-600/20 border-emerald-500 text-emerald-400"
          : "border-white/10 text-gray-400 hover:bg-white/10"
      }`}
  >
    {label}
  </button>
);

export const StatusButtons = () => (
  <div className="flex gap-3 mt-4">
    <span className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 text-sm">
      ✔ Submitted
    </span>
    <button
      disabled
      className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-sm cursor-not-allowed"
    >
      Edit (coming soon)
    </button>
  </div>
);
