import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/products/ProductGrid";
import { ErrorState, ProductGridSkeleton } from "../components/ui/CatalogStates";
import useI18n from "../hooks/useI18n";
import { useProductSearch } from "../hooks/useProducts";

export default function Search() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [draft, setDraft] = useState({ source: initialQuery, value: initialQuery });
  const query = draft.source === initialQuery ? draft.value : initialQuery;
  const navigate = useNavigate();
  const { data: products, loading, error } = useProductSearch(initialQuery);

  function submit(event) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <main className="page">
      <header className="search-page-header">
        <div className="container">
          <span className="eyebrow eyebrow-light">{t("search.eyebrow")}</span>
          <h1>{t("search.title")}</h1>
          <form className="search-page-form" role="search" onSubmit={submit}>
            <label className="sr-only" htmlFor="catalog-query">
              {t("common.searchCatalog")}
            </label>
            <input
              id="catalog-query"
              type="search"
              value={query}
              onChange={(event) =>
                setDraft({ source: initialQuery, value: event.target.value })
              }
              placeholder={t("common.searchPlaceholder")}
              autoFocus
            />
            <button className="btn btn-accent" type="submit">
              {t("common.search")}
            </button>
          </form>
        </div>
      </header>
      <section className="section container">
        {initialQuery && !loading && !error && (
          <div className="search-summary">
            <p>{t("search.results", { query: initialQuery })}</p>
            <span>{t("search.matches", { count: products?.length || 0 })}</span>
          </div>
        )}
        {!initialQuery && (
          <div className="search-prompt">
            <p>{t("search.hint")}</p>
          </div>
        )}
        {initialQuery && loading && <ProductGridSkeleton />}
        {error && <ErrorState title={t("search.error")} />}
        {initialQuery && products && (
          <ProductGrid
            products={products}
            emptyTitle={t("search.empty", { query: initialQuery })}
          />
        )}
      </section>
    </main>
  );
}
