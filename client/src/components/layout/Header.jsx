import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "@pinpon/shared";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { useAuth } from "../../app/AuthContext";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="container-shell flex h-24 items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-slate-900 text-2xl font-bold text-white">
              NS
            </div>
            <div>
              <div className="text-base font-semibold uppercase tracking-[0.32em] text-court-600">Nil Spın</div>
              <div className="text-sm text-slate-500">Profesyonel masa tenisi merkezi</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 xl:gap-12 lg:flex">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2.5 text-[1.05rem] font-medium tracking-[0.01em] text-slate-600 transition hover:bg-court-50 hover:text-court-700",
                    isActive && "bg-court-100 text-court-800 shadow-sm"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <Link to="/panel">
                <Button variant="secondary" className="px-7 py-3.5 text-base">Panel</Button>
              </Link>
            ) : (
              <Link to="/giris">
                <Button variant="secondary" className="px-7 py-3.5 text-base">Giriş Yap</Button>
              </Link>
            )}
          </div>

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white lg:hidden" onClick={() => setOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      <div className={cn("fixed inset-0 z-50 bg-slate-950/30 transition", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")} onClick={() => setOpen(false)}>
        <aside
          className={cn(
            "h-full w-72 bg-white p-6 shadow-card transition duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="text-lg font-bold">Menü</div>
            <button onClick={() => setOpen(false)}>Kapat</button>
          </div>
          <div className="space-y-2">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100",
                    isActive && "bg-court-100 font-semibold text-court-800"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to={user ? "/panel" : "/giris"} onClick={() => setOpen(false)} className="mt-4 block rounded-2xl bg-slate-900 px-4 py-3 text-white">
              {user ? "Panel" : "Giriş / Kayıt"}
            </NavLink>
          </div>
        </aside>
      </div>
    </>
  );
};
