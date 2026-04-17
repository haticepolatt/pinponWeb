import { formatDateTime } from "../../lib/utils";
import { Button } from "../../components/ui/Button";

export const BookingCalendar = ({ slots = [], selected, onSelect }) => {
  const grouped = slots.reduce((acc, slot) => {
    const key = new Date(slot.startAt).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
    acc[key] = acc[key] || [];
    acc[key].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([label, daySlots]) => (
        <div key={label} className="glass-card p-5">
          <div className="mb-4 text-base font-bold text-slate-900">{label}</div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {daySlots.map((slot) => (
              <Button
                key={slot.startAt}
                variant={selected === slot.startAt ? "secondary" : "outline"}
                className="justify-start rounded-2xl"
                onClick={() => onSelect(slot.startAt)}
              >
                {formatDateTime(slot.startAt)}
              </Button>
            ))}
          </div>
        </div>
      ))}
      {!slots.length && <div className="glass-card p-8 text-sm text-slate-500">Seçilen aralıkta uygun seans bulunamadı.</div>}
    </div>
  );
};
