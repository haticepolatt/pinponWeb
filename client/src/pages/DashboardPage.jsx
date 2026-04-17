import { useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { PageShell } from "../components/layout/PageShell";
import { LoadingBlock } from "../components/ui/LoadingBlock";
import { useAsync } from "../hooks/useAsync";
import { useAuth } from "../app/AuthContext";
import { useToast } from "../app/ToastContext";
import { DashboardHero, AdminView, TrainerView, CustomerView, PasswordChangeCard } from "../features/dashboard/DashboardViews";

export const DashboardPage = () => {
  const { user, logout, setUser } = useAuth();
  const { push } = useToast();
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [changingPassword, setChangingPassword] = useState(false);

  const dashboardState = useAsync(() => apiFetch("/dashboard"), [refreshIndex]);
  const usersState = useAsync(() => (user?.role === "ADMIN" ? apiFetch("/admin/users") : Promise.resolve([])), [user?.role, refreshIndex]);
  const packagesState = useAsync(() => apiFetch("/public/packages"), [refreshIndex]);
  const trainersState = useAsync(() => apiFetch("/public/trainers"), [refreshIndex]);
  const blocksState = useAsync(() => ((user?.role === "ADMIN" || user?.role === "TRAINER") ? apiFetch("/admin/blocks") : Promise.resolve([])), [user?.role, refreshIndex]);
  const bookingsState = useAsync(() => (user?.role === "ADMIN" ? apiFetch("/bookings") : Promise.resolve([])), [user?.role, refreshIndex]);
  const trainerScheduleState = useAsync(
    () =>
      user?.role === "TRAINER"
        ? apiFetch(`/trainer/schedule?from=${encodeURIComponent(new Date().toISOString())}&to=${encodeURIComponent(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}`)
        : Promise.resolve({ slots: [], bookings: [] }),
    [user?.role, refreshIndex]
  );

  const reload = () => setRefreshIndex((value) => value + 1);

  const actions = useMemo(
    () => ({
      async createPackage(payload) {
        await apiFetch("/admin/packages", { method: "POST", body: JSON.stringify(payload) });
        push("Paket oluşturuldu.");
        reload();
      },
      async createTrainer(payload) {
        await apiFetch("/admin/trainers", { method: "POST", body: JSON.stringify(payload) });
        push("Yeni hoca hesabı oluşturuldu.");
        reload();
      },
      async createBlock(payload) {
        await apiFetch("/admin/blocks", { method: "POST", body: JSON.stringify(payload) });
        push("Blok oluşturuldu.");
        reload();
      },
      async assignBlock(payload) {
        await apiFetch(`/admin/trainers/${payload.trainerId}/assign-block`, {
          method: "POST",
          body: JSON.stringify({
            blockId: payload.blockId,
            effectiveFrom: new Date(payload.effectiveFrom).toISOString()
          })
        });
        push("Blok atandı.");
        reload();
      },
      async addCustomAvailability(payload) {
        await apiFetch("/trainer/custom-availability", { method: "POST", body: JSON.stringify(payload) });
        push("Özel müsaitlik eklendi.");
        reload();
      },
      async addUnavailable(payload) {
        await apiFetch("/trainer/unavailable", { method: "POST", body: JSON.stringify(payload) });
        push("Zaman aralığı bloke edildi.");
        reload();
      },
      async cancelBooking(bookingId) {
        await apiFetch(`/bookings/${bookingId}/cancel`, { method: "PATCH" });
        push("Rezervasyon iptal edildi.");
        reload();
      },
      async changePassword(payload) {
        setChangingPassword(true);
        try {
          const result = await apiFetch("/auth/change-password", {
            method: "POST",
            body: JSON.stringify(payload)
          });
          setUser(result.user);
          push("Şifreniz güncellendi.");
        } finally {
          setChangingPassword(false);
        }
      }
    }),
    [push, setUser]
  );

  return (
    <PageShell>
      <DashboardHero user={user} />
      <section className="container-shell pb-4">
        <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="text-sm text-slate-600">Rol: {user.role}</div>
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={async () => {
              await logout();
              push("Çıkış yapıldı.");
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </section>
      {dashboardState.loading ? (
        <div className="container-shell py-8"><LoadingBlock /></div>
      ) : user.role === "ADMIN" ? (
        <AdminView
          data={dashboardState.data}
          users={usersState.data || []}
          packages={packagesState.data || []}
          blocks={blocksState.data || []}
          trainers={trainersState.data || []}
          bookings={bookingsState.data || []}
          onChangePassword={actions.changePassword}
          changingPassword={changingPassword}
          onCreatePackage={actions.createPackage}
          onCreateTrainer={actions.createTrainer}
          onCreateBlock={actions.createBlock}
          onAssignBlock={actions.assignBlock}
        />
      ) : user.role === "TRAINER" ? (
        <>
          <section className="container-shell pb-4">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div />
              <PasswordChangeCard onSubmit={actions.changePassword} submitting={changingPassword} />
            </div>
          </section>
          <TrainerView
            data={dashboardState.data}
            schedule={trainerScheduleState.data}
            onAddCustomAvailability={actions.addCustomAvailability}
            onAddUnavailable={actions.addUnavailable}
          />
        </>
      ) : (
        <>
          <section className="container-shell pb-4">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div />
              <PasswordChangeCard onSubmit={actions.changePassword} submitting={changingPassword} />
            </div>
          </section>
          <CustomerView data={dashboardState.data} onCancelBooking={actions.cancelBooking} />
        </>
      )}
    </PageShell>
  );
};
