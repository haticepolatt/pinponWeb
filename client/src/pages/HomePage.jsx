import { apiFetch } from "../api/http";
import { PageShell } from "../components/layout/PageShell";
import { LoadingBlock } from "../components/ui/LoadingBlock";
import { useAsync } from "../hooks/useAsync";
import { Hero, PackageHighlight, TrainerHighlight } from "../features/home/HomeSections";
import { fallbackHome } from "../lib/fallbackContent";

export const HomePage = () => {
  const { data, loading, error } = useAsync(() => apiFetch("/public/home"), []);
  const content = data
    ? {
        ...fallbackHome,
        ...data,
        hero: {
          ...fallbackHome.hero,
          ...(data.hero || {})
        },
        stats: data.stats || fallbackHome.stats,
        trainers: data.trainers || fallbackHome.trainers,
        packages: data.packages || fallbackHome.packages
      }
    : fallbackHome;

  return (
    <PageShell>
      {loading && !data && <div className="container-shell py-10"><LoadingBlock /></div>}
      <Hero hero={content.hero} stats={content.stats} highlights={content.highlights} />
      <TrainerHighlight trainers={content.trainers} />
      <PackageHighlight packages={content.packages} />
    </PageShell>
  );
};
