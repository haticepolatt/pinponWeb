import { useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { PageShell } from "../components/layout/PageShell";
import { LoadingBlock } from "../components/ui/LoadingBlock";
import { useAsync } from "../hooks/useAsync";
import { BookingCalendar } from "../features/booking/BookingCalendar";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { getWeekRange } from "../lib/utils";
import { useAuth } from "../app/AuthContext";
import { useToast } from "../app/ToastContext";
import { useNavigate } from "react-router-dom";

export const BookingPage = () => {
  const range = useMemo(() => getWeekRange(), []);
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [trainerId, setTrainerId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const [notes, setNotes] = useState("");

  const trainersState = useAsync(() => apiFetch("/public/trainers"), []);
  const dashboardState = useAsync(() => (user ? apiFetch("/dashboard") : Promise.resolve(null)), [user?.id]);
  const availabilityState = useAsync(
    () =>
      trainerId
        ? apiFetch(`/public/availability?trainerId=${trainerId}&from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`)
        : Promise.resolve([]),
    [trainerId]
  );

  const handleBooking = async () => {
    if (!user) {
      navigate("/giris");
      return;
    }
    if (!purchaseId || !selectedSlot || !trainerId) {
      push("Lütfen paket, antrenör ve saat seçin.", "error");
      return;
    }
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          trainerId,
          purchaseId,
          startAt: new Date(selectedSlot).toISOString(),
          notes
        })
      });
      push("Rezervasyon oluşturuldu.");
      setSelectedSlot("");
      setNotes("");
    } catch (error) {
      push(error.message, "error");
    }
  };

  const purchases = dashboardState.data?.role === "CUSTOMER" ? dashboardState.data.purchases.filter((item) => item.remainingSessions > 0) : [];

  return (
    <PageShell>
      <section className="container-shell py-12 md:py-20">
        <div className="mb-8">
          <h1 className="section-title">Rezervasyon sistemi</h1>
          <p className="section-copy mt-3">Uygun saatleri seçerek sorunsuz rezervasyon yapın.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-card space-y-4 p-6">
            <Select label="Antrenör seç" value={trainerId} onChange={(e) => setTrainerId(e.target.value)}>
              <option value="">Seçiniz</option>
              {trainersState.data?.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.user.firstName} {trainer.user.lastName}
                </option>
              ))}
            </Select>
            <Select label="Kullanılacak paket" value={purchaseId} onChange={(e) => setPurchaseId(e.target.value)}>
              <option value="">Seçiniz</option>
              {purchases.map((purchase) => (
                <option key={purchase.id} value={purchase.id}>
                  {purchase.trainingPackage.title} - {purchase.remainingSessions} seans kaldı
                </option>
              ))}
            </Select>
            <Input label="Takvim aralığı" value="Sonraki 14 gün" disabled />
            <Textarea label="Not" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Antrenman hedefinizi belirtin" />
            <Button className="w-full" onClick={handleBooking}>
              Rezervasyonu Tamamla
            </Button>
          </div>

          <div>
            {availabilityState.loading ? <LoadingBlock /> : <BookingCalendar slots={availabilityState.data || []} selected={selectedSlot} onSelect={setSelectedSlot} />}
          </div>
        </div>
      </section>
    </PageShell>
  );
};
