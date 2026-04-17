import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { currency, formatDateTime } from "../../lib/utils";

export const DashboardHero = ({ user }) => (
  <section className="container-shell py-10">
    <div className="glass-card p-8">
      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-court-700">Rol bazli panel</div>
      <h1 className="mt-3 text-4xl font-black text-slate-900">
        Hoş geldiniz, {user.firstName} {user.lastName}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        Rezervasyonları, antrenman bloklarını ve paket durumlarını bu panelden yönetin.
      </p>
    </div>
  </section>
);

export const AdminView = ({
  data,
  users,
  packages,
  blocks,
  trainers,
  bookings,
  onChangePassword,
  changingPassword,
  onCreatePackage,
  onCreateBlock,
  onAssignBlock,
  onCreateTrainer
}) => {
  const [activeSection, setActiveSection] = useState("security");
  const [packageForm, setPackageForm] = useState({
    title: "",
    description: "",
    sessionCount: 5,
    durationMinutes: 60,
    price: 0,
    featured: false
  });
  const [blockForm, setBlockForm] = useState({
    name: "",
    description: "",
    daysOfWeek: "1,2,3,4,5",
    startTime: "18:00",
    endTime: "21:00"
  });
  const [assignmentForm, setAssignmentForm] = useState({
    trainerId: "",
    blockId: "",
    effectiveFrom: new Date().toISOString().slice(0, 16)
  });
  const [trainerForm, setTrainerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    headline: "",
    bio: "",
    specialties: "",
    yearsExperience: 5,
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80"
  });

  useEffect(() => {
    setAssignmentForm((current) => ({
      ...current,
      trainerId: current.trainerId || trainers[0]?.id || "",
      blockId: current.blockId || blocks[0]?.id || ""
    }));
  }, [trainers, blocks]);

  const shortcuts = [
    { id: "security", label: "Güvenlik" },
    { id: "users", label: "Kullanıcılar" },
    { id: "bookings", label: "Son Rezervasyonlar" },
    { id: "trainer", label: "Yeni Eğitmen Oluştur" },
    { id: "packages", label: "Paketler" },
    { id: "blocks", label: "Bloklar" }
  ];

  return (
    <div className="container-shell grid gap-8 py-4 lg:grid-cols-[0.34fr_0.66fr]">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.metrics.map((metric) => (
            <div key={metric.label} className="glass-card p-6">
              <div className="text-sm text-slate-500">{metric.label}</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-court-700">Admin kısayolları</div>
          <div className="mt-5 grid gap-3">
            {shortcuts.map((item) => (
              <button
                key={item.id}
                className={`rounded-2xl px-4 py-4 text-left text-sm font-semibold transition ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-court-600 to-court-500 text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-court-400 hover:bg-court-50 hover:text-court-800"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {activeSection === "security" && <PasswordChangeCard onSubmit={onChangePassword} submitting={changingPassword} />}

        {activeSection === "users" && (
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">Kullanicilar</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-3">Ad Soyad</th>
                    <th className="pb-3">Rol</th>
                    <th className="pb-3">E-posta</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="py-3">{user.firstName} {user.lastName}</td>
                      <td className="py-3">{user.role}</td>
                      <td className="py-3">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "bookings" && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Son rezervasyonlar</h2>
          <div className="mt-5 space-y-3">
            {bookings.slice(0, 8).map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="font-semibold text-slate-900">
                  {booking.customer.firstName} {booking.customer.lastName}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {booking.trainer.user.firstName} {booking.trainer.user.lastName} ile {formatDateTime(booking.startAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {activeSection === "trainer" && (
        <form
          className="glass-card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onCreateTrainer({
              ...trainerForm,
              yearsExperience: Number(trainerForm.yearsExperience)
            });
          }}
        >
          <h2 className="text-xl font-bold text-slate-900">Yeni eğitmen oluştur</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Ad" value={trainerForm.firstName} onChange={(e) => setTrainerForm({ ...trainerForm, firstName: e.target.value })} />
            <Input label="Soyad" value={trainerForm.lastName} onChange={(e) => setTrainerForm({ ...trainerForm, lastName: e.target.value })} />
          </div>
          <Input label="E-posta" type="email" value={trainerForm.email} onChange={(e) => setTrainerForm({ ...trainerForm, email: e.target.value })} />
          <Input label="Telefon" value={trainerForm.phone} onChange={(e) => setTrainerForm({ ...trainerForm, phone: e.target.value })} />
          <Input label="Şifre" type="password" value={trainerForm.password} onChange={(e) => setTrainerForm({ ...trainerForm, password: e.target.value })} />
          <Input label="Başlık" value={trainerForm.headline} onChange={(e) => setTrainerForm({ ...trainerForm, headline: e.target.value })} />
          <Textarea label="Biyografi" value={trainerForm.bio} onChange={(e) => setTrainerForm({ ...trainerForm, bio: e.target.value })} />
          <Input label="Uzmanlıklar" value={trainerForm.specialties} onChange={(e) => setTrainerForm({ ...trainerForm, specialties: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Deneyim yılı" type="number" value={trainerForm.yearsExperience} onChange={(e) => setTrainerForm({ ...trainerForm, yearsExperience: e.target.value })} />
            <Input label="Profil görseli URL" value={trainerForm.imageUrl} onChange={(e) => setTrainerForm({ ...trainerForm, imageUrl: e.target.value })} />
          </div>
          <Button className="w-full">Eğitmeni Oluştur</Button>
        </form>
        )}

        {activeSection === "packages" && (
          <>
        <form
          className="glass-card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onCreatePackage({
              ...packageForm,
              sessionCount: Number(packageForm.sessionCount),
              durationMinutes: Number(packageForm.durationMinutes),
              price: Number(packageForm.price)
            });
          }}
        >
          <h2 className="text-xl font-bold text-slate-900">Yeni paket</h2>
          <Input label="Baslik" value={packageForm.title} onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })} />
          <Textarea label="Aciklama" value={packageForm.description} onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Seans sayisi" type="number" value={packageForm.sessionCount} onChange={(e) => setPackageForm({ ...packageForm, sessionCount: e.target.value })} />
            <Input label="Sure (dk)" type="number" value={packageForm.durationMinutes} onChange={(e) => setPackageForm({ ...packageForm, durationMinutes: e.target.value })} />
          </div>
          <Input label="Fiyat" type="number" value={packageForm.price} onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })} />
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={packageForm.featured} onChange={(e) => setPackageForm({ ...packageForm, featured: e.target.checked })} />
            Öne çıkan paket
          </label>
          <Button className="w-full">Paketi Oluştur</Button>
        </form>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-900">Mevcut paketler</h2>
          <div className="mt-4 space-y-3">
            {packages.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="font-semibold text-slate-900">{item.title}</div>
                <div className="text-sm text-slate-500">{currency(item.price)}</div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}

        {activeSection === "blocks" && (
          <>
        <form
          className="glass-card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onCreateBlock({
              ...blockForm,
              daysOfWeek: blockForm.daysOfWeek.split(",").map((item) => Number(item.trim()))
            });
          }}
        >
          <h2 className="text-xl font-bold text-slate-900">Yeni blok</h2>
          <Input label="Blok adi" value={blockForm.name} onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })} />
          <Textarea label="Aciklama" value={blockForm.description} onChange={(e) => setBlockForm({ ...blockForm, description: e.target.value })} />
          <Input label="Gunler (0-6, virgulle)" value={blockForm.daysOfWeek} onChange={(e) => setBlockForm({ ...blockForm, daysOfWeek: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Baslangic" type="time" value={blockForm.startTime} onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })} />
            <Input label="Bitis" type="time" value={blockForm.endTime} onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })} />
          </div>
          <Button className="w-full">Blok Olustur</Button>
        </form>

        <form
          className="glass-card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onAssignBlock(assignmentForm);
          }}
        >
          <h2 className="text-xl font-bold text-slate-900">Blok ata</h2>
          <Select label="Antrenör" value={assignmentForm.trainerId} onChange={(e) => setAssignmentForm({ ...assignmentForm, trainerId: e.target.value })}>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.user.firstName} {trainer.user.lastName}
              </option>
            ))}
          </Select>
          <Select label="Blok" value={assignmentForm.blockId} onChange={(e) => setAssignmentForm({ ...assignmentForm, blockId: e.target.value })}>
            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.name}
              </option>
            ))}
          </Select>
          <Input label="Baslangic tarihi" type="datetime-local" value={assignmentForm.effectiveFrom} onChange={(e) => setAssignmentForm({ ...assignmentForm, effectiveFrom: e.target.value })} />
          <Button className="w-full">Atamayı Kaydet</Button>
        </form>
          </>
        )}
      </div>
    </div>
  );
};

export const TrainerView = ({ data, schedule, onAddCustomAvailability, onAddUnavailable }) => {
  const [customForm, setCustomForm] = useState({ date: new Date().toISOString().slice(0, 16), startTime: "18:00", endTime: "21:00", label: "" });
  const [unavailableForm, setUnavailableForm] = useState({ startAt: new Date().toISOString().slice(0, 16), endAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16), reason: "" });
  const [viewMode, setViewMode] = useState("week");

  const visibleBookings = (schedule?.bookings || []).filter((booking) => {
    const days = viewMode === "week" ? 7 : 30;
    const end = Date.now() + days * 24 * 60 * 60 * 1000;
    return new Date(booking.startAt).getTime() <= end;
  });

  const visibleSlots = (schedule?.slots || []).filter((slot) => {
    const days = viewMode === "week" ? 7 : 30;
    const end = Date.now() + days * 24 * 60 * 60 * 1000;
    return new Date(slot.startAt).getTime() <= end;
  });

  return (
    <div className="container-shell grid gap-8 py-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-8">
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Takvim gorunumu</h2>
            <div className="flex gap-2">
              <Button variant={viewMode === "week" ? "secondary" : "outline"} onClick={() => setViewMode("week")}>
                Haftalik
              </Button>
              <Button variant={viewMode === "month" ? "secondary" : "outline"} onClick={() => setViewMode("month")}>
                Aylik
              </Button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {visibleSlots.slice(0, viewMode === "week" ? 10 : 18).map((slot) => (
              <div key={slot.startAt} className="rounded-2xl border border-slate-100 p-4">
                <div className="text-sm font-semibold text-court-700">Musait slot</div>
                <div className="mt-2 text-sm text-slate-600">{formatDateTime(slot.startAt)}</div>
              </div>
            ))}
            {!visibleSlots.length && <div className="text-sm text-slate-500">Bu gorunum icin olusan musait slot bulunamadi.</div>}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Yaklasan seanslar</h2>
          <div className="mt-5 space-y-4">
            {visibleBookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="font-semibold text-slate-900">{booking.customer.firstName} {booking.customer.lastName}</div>
                <div className="mt-1 text-sm text-slate-500">{formatDateTime(booking.startAt)}</div>
              </div>
            ))}
            {!visibleBookings.length && <div className="text-sm text-slate-500">Planlanmis aktif seans yok.</div>}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Atanan bloklar</h2>
          <div className="mt-5 space-y-4">
            {data.assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="font-semibold text-slate-900">{assignment.block.name}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {assignment.block.startTime} - {assignment.block.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <form
          className="glass-card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onAddCustomAvailability({ ...customForm, date: new Date(customForm.date).toISOString() });
          }}
        >
          <h2 className="text-xl font-bold text-slate-900">Özel musaitlik ekle</h2>
          <Input label="Tarih" type="datetime-local" value={customForm.date} onChange={(e) => setCustomForm({ ...customForm, date: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Baslangic" type="time" value={customForm.startTime} onChange={(e) => setCustomForm({ ...customForm, startTime: e.target.value })} />
            <Input label="Bitis" type="time" value={customForm.endTime} onChange={(e) => setCustomForm({ ...customForm, endTime: e.target.value })} />
          </div>
          <Input label="Etiket" value={customForm.label} onChange={(e) => setCustomForm({ ...customForm, label: e.target.value })} />
          <Button className="w-full">Müsaitlik Ekle</Button>
        </form>

        <form
          className="glass-card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onAddUnavailable({
              ...unavailableForm,
              startAt: new Date(unavailableForm.startAt).toISOString(),
              endAt: new Date(unavailableForm.endAt).toISOString()
            });
          }}
        >
          <h2 className="text-xl font-bold text-slate-900">Müsait olmayan zaman</h2>
          <Input label="Baslangic" type="datetime-local" value={unavailableForm.startAt} onChange={(e) => setUnavailableForm({ ...unavailableForm, startAt: e.target.value })} />
          <Input label="Bitis" type="datetime-local" value={unavailableForm.endAt} onChange={(e) => setUnavailableForm({ ...unavailableForm, endAt: e.target.value })} />
          <Input label="Neden" value={unavailableForm.reason} onChange={(e) => setUnavailableForm({ ...unavailableForm, reason: e.target.value })} />
          <Button className="w-full">Bloke Et</Button>
        </form>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-900">Müsait olmayan zamanlar</h2>
          <div className="mt-4 space-y-3">
            {data.unavailable.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="font-medium text-slate-900">{item.reason || "Plan dışı kapalılık"}</div>
                <div className="text-sm text-slate-500">{formatDateTime(item.startAt)} - {formatDateTime(item.endAt)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomerView = ({ data, onCancelBooking }) => (
  <div className="container-shell grid gap-8 py-4 lg:grid-cols-[0.9fr_1.1fr]">
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold text-slate-900">Paketlerim</h2>
      <div className="mt-5 space-y-4">
        {data.purchases.map((purchase) => (
          <div key={purchase.id} className="rounded-2xl border border-slate-100 p-4">
            <div className="font-semibold text-slate-900">{purchase.trainingPackage.title}</div>
            <div className="mt-1 text-sm text-slate-500">
              Kalan seans: {purchase.remainingSessions} / {purchase.totalSessions}
            </div>
            <div className="mt-1 text-sm text-slate-500">{currency(purchase.amount)}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold text-slate-900">Rezervasyon geçmişi</h2>
      <div className="mt-5 space-y-4">
        {data.bookings.map((booking) => (
          <div key={booking.id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-slate-900">
                  {booking.trainer.user.firstName} {booking.trainer.user.lastName}
                </div>
                <div className="mt-1 text-sm text-slate-500">{formatDateTime(booking.startAt)}</div>
                <div className="mt-1 text-sm text-slate-500">Durum: {booking.status}</div>
              </div>
              {booking.status === "BOOKED" && (
                <Button variant="outline" onClick={() => onCancelBooking(booking.id)}>
                  İptal Et
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PasswordChangeCard = ({ onSubmit, submitting = false }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  return (
    <div className="glass-card p-6">
      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-court-700">Guvenlik</div>
      <h2 className="mt-3 text-2xl font-black text-slate-900">Sifre degistir</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        İstediğiniz zaman mevcut şifrenizi girerek yeni bir şifre belirleyebilirsiniz.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (form.newPassword !== form.confirmPassword) {
            setError("Yeni şifreler aynı olmalı.");
            return;
          }
          setError("");
          onSubmit({ currentPassword: form.currentPassword, newPassword: form.newPassword });
        }}
      >
        <Input label="Mevcut şifre" type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        <Input label="Yeni şifre" type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
        <Input label="Yeni şifre tekrar" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        <Button className="w-full" disabled={submitting}>
          {submitting ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </Button>
      </form>
    </div>
  );
};
