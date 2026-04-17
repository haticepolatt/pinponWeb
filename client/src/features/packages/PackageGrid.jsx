import { Button } from "../../components/ui/Button";
import { currency } from "../../lib/utils";

export const PackageGrid = ({ packages = [], onPurchase, purchasingId, showAction = false }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    {packages.map((item) => (
      <article key={item.id} className={`glass-card flex flex-col p-6 ${item.featured ? "border-court-300 bg-court-50/60" : ""}`}>
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.sessionCount} seans</span>
          {item.featured && <span className="rounded-full bg-court-500 px-3 py-1 text-xs font-semibold text-white">Öne çıkan</span>}
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.description}</p>
        <div className="mt-6 space-y-2">
          <div className="text-3xl font-black text-slate-900">{currency(item.price)}</div>
          <div className="text-sm text-slate-500">Seans süresi: {item.durationMinutes} dakika</div>
        </div>
        {showAction && (
          <Button className="mt-6 w-full" onClick={() => onPurchase(item.id)} disabled={purchasingId === item.id}>
            {purchasingId === item.id ? "İşleniyor..." : "Paketi Satın Al"}
          </Button>
        )}
      </article>
    ))}
  </div>
);
