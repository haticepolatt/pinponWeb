import { useState } from "react";
import { apiFetch } from "../api/http";
import { PageShell } from "../components/layout/PageShell";
import { LoadingBlock } from "../components/ui/LoadingBlock";
import { useAsync } from "../hooks/useAsync";
import { PackageGrid } from "../features/packages/PackageGrid";
import { useAuth } from "../app/AuthContext";
import { useToast } from "../app/ToastContext";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { fallbackHome } from "../lib/fallbackContent";

export const PackagesPage = () => {
  const { data, loading } = useAsync(() => apiFetch("/public/packages"), []);
  const packages = data || fallbackHome.packages;
  const [purchasingId, setPurchasingId] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const handlePurchase = async (packageId) => {
    if (!user) {
      navigate("/giris");
      return;
    }

    setPurchasingId(packageId);
    try {
      await apiFetch(`/packages/purchase/${packageId}`, { method: "POST" });
      push("Paket satın alındı.");
    } catch (error) {
      push(error.message, "error");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <PageShell>
      <section className="container-shell py-12 md:py-20">
        <div className="mb-8">
          <h1 className="section-title">Antrenman paketleri</h1>
          <p className="section-copy mt-3">Tüm satın alımlar demo ödeme akışı ile gerçek veri modeline kaydedilir.</p>
        </div>
        {loading && !data && <LoadingBlock />}
        <PackageGrid packages={packages} onPurchase={setSelectedPackageId} purchasingId={purchasingId} showAction />
      </section>
      <Modal open={Boolean(selectedPackageId)} onClose={() => setSelectedPackageId(null)} title="Satın alma onayı">
        <p className="text-sm leading-7 text-slate-600">
          Demo ödeme akışı ile paket satın alınacak ve kalan seanslarınız panelinize eklenecek.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={async () => {
              await handlePurchase(selectedPackageId);
              setSelectedPackageId(null);
            }}
            disabled={Boolean(purchasingId)}
          >
            Satın Al
          </Button>
          <Button variant="outline" onClick={() => setSelectedPackageId(null)}>
            Vazgeç
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
};
