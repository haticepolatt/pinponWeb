import { apiFetch } from "../api/http";
import { PageShell } from "../components/layout/PageShell";
import { LoadingBlock } from "../components/ui/LoadingBlock";
import { useAsync } from "../hooks/useAsync";
import { fallbackHome } from "../lib/fallbackContent";

export const ContactPage = () => {
  const { data, loading } = useAsync(() => apiFetch("/contact"), []);
  const contact = data || fallbackHome.contact;

  return (
    <PageShell>
      <section className="container-shell py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-card p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-court-700">İletişim</div>
            <h1 className="mt-4 text-4xl font-black text-slate-900">Merkezimizi ziyaret edin</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Ders programları, kurumsal etkinlik paketleri ve performans planlaması için ekibimizle görüşebilirsiniz.
            </p>
          </div>
          {loading && !data && <LoadingBlock />}
          <div className="glass-card space-y-4 p-8">
            <div><span className="font-semibold">Adres:</span> {contact.address}</div>
            <div><span className="font-semibold">Telefon:</span> {contact.phone}</div>
            <div><span className="font-semibold">E-posta:</span> {contact.email}</div>
            <div><span className="font-semibold">Saatler:</span> {contact.hours}</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};
