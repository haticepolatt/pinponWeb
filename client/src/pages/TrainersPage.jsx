import { apiFetch } from "../api/http";
import { PageShell } from "../components/layout/PageShell";
import { LoadingBlock } from "../components/ui/LoadingBlock";
import { useAsync } from "../hooks/useAsync";
import { TrainerGrid } from "../features/trainers/TrainerGrid";
import { fallbackHome } from "../lib/fallbackContent";

export const TrainersPage = () => {
  const { data, loading } = useAsync(() => apiFetch("/public/trainers"), []);
  const trainers = data || fallbackHome.trainers;

  return (
    <PageShell>
      <section className="container-shell py-12 md:py-20">
        <div className="mb-8">
          <h1 className="section-title">Antrenörlerimiz</h1>
          <p className="section-copy mt-3">Her antrenör farklı oyuncu profilleri için uzmanlaşmış programlar sunar.</p>
        </div>
        {loading && !data && <LoadingBlock />}
        <TrainerGrid trainers={trainers} />
      </section>
    </PageShell>
  );
};
