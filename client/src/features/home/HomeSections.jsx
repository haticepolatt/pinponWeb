import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { currency } from "../../lib/utils";

export const Hero = ({ hero, stats, highlights = [] }) => (
  <section className="container-shell py-4 md:py-6">
    <div className="overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,_rgba(25,176,111,0.22),_transparent_28rem),linear-gradient(135deg,_#07111f_0%,_#0d1b2a_52%,_#102c25_100%)] text-white shadow-card">
      <div className="grid gap-8 px-6 py-7 md:px-10 md:py-10 xl:grid-cols-[1.05fr_0.95fr] xl:px-14 xl:py-12">
        <div className="flex h-full flex-col">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-court-100">
              {hero?.eyebrow || "Sezon 2026 hazirlik programi"}
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] md:text-5xl xl:text-[4.3rem]">{hero?.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">{hero?.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/rezervasyon">
                <Button>Seans Rezervasyonu Yap</Button>
              </Link>
              <Link to="/paketler">
                <Button variant="outline" className="border-white/30 bg-white/5 text-white hover:border-white hover:bg-white/10 hover:text-white">
                  Paketleri İncele
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-1 items-center">
            <div className="grid w-full gap-4 md:grid-cols-3">
              {stats?.map((item) => (
                <div key={item.label} className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="text-3xl font-black md:text-4xl">{item.value}</div>
                  <div className="mt-2 text-sm text-slate-200">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[300px] md:min-h-[340px] xl:min-h-[360px] overflow-hidden rounded-[2rem]">
            <img src={hero?.primaryImage} alt="Masa tenisi antrenmani" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="max-w-sm rounded-[1.5rem] bg-white/14 p-5 backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-court-100">Merkez vizyonu</div>
                <div className="mt-3 text-lg font-semibold leading-7 text-white">
                  Her seansı performans ritmine bağlayan, profesyonel ama temiz bir antrenman atmosferi.
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3">
              <img src={hero?.secondaryImage} alt="Profesyonel masa tenisi salonu" className="h-40 md:h-44 w-full rounded-[1.4rem] object-cover" />
            </div>
            <div className="grid gap-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const TrainerHighlight = ({ trainers = [] }) => (
  <section className="container-shell py-12 md:py-20">
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">Uzman antrenor kadrosu</h2>
        <p className="section-copy mt-3">
          Turnuva sporcularından yeni başlayanlara kadar farklı hedefler için uzmanlaşmış eğitmenler.
        </p>
      </div>
      <Link to="/antrenorler" className="text-sm font-semibold text-court-700">
        Tüm antrenörler
      </Link>
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      {trainers.map((trainer) => (
        <article key={trainer.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1">
          <div className="overflow-hidden">
            <img src={trainer.imageUrl} alt={trainer.user.firstName} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="p-7">
            <h3 className="text-2xl font-bold text-slate-900">
              {trainer.user.firstName} {trainer.user.lastName}
            </h3>
            <p className="mt-2 text-sm font-medium text-court-700">{trainer.headline}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{trainer.bio}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {trainer.specialties.split(",").map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export const PackageHighlight = ({ packages = [] }) => (
  <section className="container-shell py-12 md:py-20">
    <div className="mb-10">
      <h2 className="section-title">Esnek paket yapıları</h2>
      <p className="section-copy mt-3">Kalan seanslarınız panelinizden takip edilir, satın alma ve rezervasyon akışları birbirine bağlıdır.</p>
    </div>
    <div className="grid gap-6 xl:grid-cols-3">
      {packages.map((item) => (
        <article key={item.id} className={`rounded-[2rem] border p-7 shadow-card ${item.featured ? "border-court-200 bg-court-50" : "border-slate-200 bg-white"}`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-court-700">{item.sessionCount} seans</div>
            {item.featured && <div className="rounded-full bg-court-500 px-3 py-1 text-xs font-semibold text-white">Popüler</div>}
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
          <p className="mt-3 min-h-20 text-sm leading-7 text-slate-600">{item.description}</p>
          <div className="mt-6 text-4xl font-black text-slate-900">{currency(item.price)}</div>
          <div className="mt-2 text-sm text-slate-500">Seans süresi: {item.durationMinutes} dakika</div>
        </article>
      ))}
    </div>
    <div className="mt-10 overflow-hidden rounded-[2.25rem] bg-slate-900 text-white">
      <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-court-200">Kurumsal ve bireysel programlar</div>
          <h3 className="mt-3 text-3xl font-black md:text-4xl">Takım çalışması, özel ders ve turnuva hazırlığını aynı merkezde yönetin.</h3>
        </div>
        <div className="text-sm leading-8 text-slate-300">
          Kulüp altyapıları, okul grupları ve şirket içi spor etkinlikleri için özel paket yapıları oluşturuyoruz. Programlarınız salon kapasitesine ve hedefe göre planlanır.
        </div>
      </div>
    </div>
  </section>
);
