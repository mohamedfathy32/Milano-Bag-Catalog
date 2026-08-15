import { Link } from "react-router-dom";
import useI18n from "../../hooks/useI18n";

export function ProductGridSkeleton({ count = 8 }) {
  const { t } = useI18n();
  return (
    <div className="product-grid" aria-label={t("common.loading")} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white" key={index}>
          <div className="skeleton aspect-[4/5]" />
          <div className="space-y-3 p-5">
            <div className="skeleton h-3 w-16 rounded-full" />
            <div className="skeleton h-5 w-3/4 rounded-full" />
            <div className="skeleton h-3 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ title }) {
  const { t } = useI18n();
  return (
    <div className="state-panel" role="alert">
      <span className="state-icon">!</span>
      <h2>{title || t("state.errorTitle")}</h2>
      <p>{t("state.errorMessage")}</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>
        {t("common.tryAgain")}
      </button>
    </div>
  );
}

export function EmptyState({
  title,
  message,
}) {
  const { t } = useI18n();
  return (
    <div className="state-panel">
      <span className="state-icon">—</span>
      <h2>{title || t("state.emptyTitle")}</h2>
      <p>{message || t("state.emptyMessage")}</p>
      <Link className="btn btn-secondary" to="/products">
        {t("common.viewAll")}
      </Link>
    </div>
  );
}
