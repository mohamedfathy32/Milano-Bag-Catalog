import { useMemo, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import { ErrorState, ProductGridSkeleton } from "../components/ui/CatalogStates";
import useI18n from "../hooks/useI18n";
import { useAllProducts } from "../hooks/useProducts";

const FILTERS = ["All", "PP", "ABC", "PC"];

export default function Products() {
  const { localize, t } = useI18n();
  const { data: products, loading, error } = useAllProducts();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (products || []).filter((product) => {
      const categoryMatches = category === "All" || product.category === category;
      const searchMatches =
        !term ||
        [localize(product.localizedName), product.name, product.productCode, product.category].some((value) =>
          String(value || "").toLowerCase().includes(term),
        );
      return categoryMatches && searchMatches;
    });
  }, [category, localize, products, search]);

  return (
    <main className="page">
      <header className="page-header container">
        <span className="eyebrow">{t("products.eyebrow")}</span>
        <h1>{t("products.title")}</h1>
        <p>{t("products.description")}</p>
      </header>

      <section className="container catalog-section">
        <div className="catalog-toolbar">
          <div className="filter-tabs" role="group" aria-label={t("products.filterLabel")}>
            {FILTERS.map((filter) => (
              <button
                type="button"
                className={category === filter ? "active" : ""}
                onClick={() => setCategory(filter)}
                aria-pressed={category === filter}
                key={filter}
              >
                {filter === "All" ? t("common.all") : filter}
              </button>
            ))}
          </div>
          <label className="catalog-search">
            <span className="sr-only">{t("common.searchCatalog")}</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("common.searchPlaceholder")}
            />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>
        {!loading && !error && (
          <p className="result-count">
            {t("common.products", { count: filteredProducts.length })}
          </p>
        )}
        {loading && <ProductGridSkeleton />}
        {error && <ErrorState />}
        {products && (
          <ProductGrid
            products={filteredProducts}
            emptyTitle={t("products.noMatch")}
          />
        )}
      </section>
    </main>
  );
}
