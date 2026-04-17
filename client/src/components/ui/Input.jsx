export const Input = ({ label, ...props }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-court-500"
      {...props}
    />
  </label>
);
