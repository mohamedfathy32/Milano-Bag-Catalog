import { useParams } from "react-router-dom";
import ProductGrid from "../components/products/ProductGrid";
import { ErrorState, ProductGridSkeleton } from "../components/ui/CatalogStates";
import useI18n from "../hooks/useI18n";
import { useCategoryProducts } from "../hooks/useProducts";

export default function Category({ category: categoryProp }) {
  const { t } = useI18n();
  const params = useParams();
  const category = (categoryProp || params.category || "").toUpperCase();
  const { data: products, loading, error } = useCategoryProducts(category);

  return (
    <main className="page">
      <header className="category-header">
        <div className="container category-header-inner">
          <div>
            <span className="eyebrow eyebrow-light">{t("category.eyebrow")}</span>
            <h1>{t("common.collection", { category })}</h1>
          </div>
          <div>
            <p>{t(`category.${category}`)}</p>
            <strong>
              {loading
                ? t("common.loading")
                : t("common.products", { count: products?.length || 0 })}
            </strong>
          </div>
        </div>
      </header>
      <section className="section container">
        {loading && <ProductGridSkeleton />}
        {error && <ErrorState title={t("category.error", { category })} />}
        {products && (
          <ProductGrid
            products={products}
            emptyTitle={t("category.empty", { category })}
          />
        )}
      </section>
    </main>
  );
}
