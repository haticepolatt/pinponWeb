import { cn } from "../../lib/utils";

export const Button = ({ className, variant = "primary", ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200",
      variant === "primary" && "bg-court-500 text-white hover:bg-court-600",
      variant === "secondary" && "bg-slate-900 text-white hover:bg-slate-800",
      variant === "outline" && "border border-slate-300 bg-white text-slate-900 hover:border-court-500 hover:text-court-700",
      variant === "ghost" && "text-slate-700 hover:bg-slate-100",
      className
    )}
    {...props}
  />
);
