export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white/80">
    <div className="container-shell grid gap-8 py-12 md:grid-cols-3">
      <div>
        <div className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-court-600">Nil Spın</div>
        <p className="text-sm leading-7 text-slate-600">
          Profesyonel antrenman, net programlama ve veri odaklı saha yönetimi ile sporcuların gelişimini hızlandırır.
        </p>
      </div>
      <div>
        <div className="mb-3 text-base font-semibold text-slate-900">İletişim</div>
        <div className="space-y-2 text-sm text-slate-600">
          <div>Yüzüncüyıl Mah. Tutku Cad. 1 Nilüfer / Bursa</div>
          <div>+90 216 555 10 10</div>
          <div>iletisim@nilspinakademi.com</div>
        </div>
      </div>
      <div>
        <div className="mb-3 text-base font-semibold text-slate-900">Çalışma Saatleri</div>
        <div className="space-y-2 text-sm text-slate-600">
          <div>Hafta içi: 09:00 - 22:00</div>
          <div>Hafta sonu: 10:00 - 20:00</div>
        </div>
      </div>
    </div>
  </footer>
);
