import { PageShell } from "../components/layout/PageShell";

export const AboutPage = () => (
  <PageShell>
    <section className="container-shell py-12 md:py-20">
      <div className="glass-card grid gap-8 p-8 md:p-12 lg:grid-cols-2">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-court-700">Hakkımızda</div>
          <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Sadece ders değil, sistem kuruyoruz.</h1>
        </div>
        <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
          <p>
            Nil Spin Masa Tenisi Akademisi; performans odaklı masa tenisi eğitimi, düzenli programlama ve veriyle desteklenen sporcu takibi için tasarlandı.
          </p>
          <p>
            Kulüp altyapısı, birebir dersler, kurumsal programlar ve turnuva dönemi hazırlık paketleri ile farklı seviye sporculara hizmet veriyoruz.
          </p>
          <p>
            Her sporcu için tekrar kullanılabilir müsaitlik blokları, rezervasyon disiplini ve kalan seans takibi ile operasyonu merkezi olarak yönetiyoruz.
          </p>
        </div>
      </div>
    </section>
  </PageShell>
);
