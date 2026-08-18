import { Link } from "react-router-dom";
import ContactSection from "../components/home/ContactSection";
import ProductGrid from "../components/products/ProductGrid";
import { ErrorState, ProductGridSkeleton } from "../components/ui/CatalogStates";
import useI18n from "../hooks/useI18n";
import { useAllProducts, useFeaturedProducts } from "../hooks/useProducts";

const CATEGORIES = [
  { id: "PP", path: "/pp" },
  { id: "ABS", path: "/abs" },
  { id: "PC", path: "/pc" },
];

export default function Home() {
  const { isArabic, t } = useI18n();
  const productsState = useAllProducts();
  const featuredState = useFeaturedProducts();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{t("home.eyebrow")}</span>
            <h1>{t("home.title")}</h1>
            <p>{t("home.description")}</p>
            <Link className="btn btn-primary" to="/products">
              {t("home.explore")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="hero-visual" aria-label={t("home.visualLabel")}>
            <div className="hero-orbit" />
            <div className="case case-back"><span>MB</span></div>
            <div className="case case-front"><span>MILANO</span></div>
            <span className="hero-caption">{t("home.visualCaption")}</span>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t("home.categoriesEyebrow")}</span>
            <h2>{t("home.categoriesTitle")}</h2>
          </div>
          <Link className="text-link" to="/products">
            {t("common.viewAll")} <span>{isArabic ? "←" : "→"}</span>
          </Link>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((category, index) => {
            const count = productsState.data?.filter(
              (product) => product.category === category.id,
            ).length;
            return (
              <Link className="category-card" to={category.path} key={category.id}>
                <div className={`category-visual visual-${index + 1}`}>
                  <span className="category-monogram">{category.id}</span>
                  <span className="mini-case" aria-hidden="true" />
                </div>
                <div className="category-content">
                  <span>
                    {productsState.loading
                      ? "—"
                      : t("common.products", { count: count || 0 })}
                  </span>
                  <h3>{category.id}</h3>
                  <p>{t(`home.category.${category.id}`)}</p>
                  <strong>
                    {t("common.viewCollection")} <span aria-hidden="true">↗</span>
                  </strong>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t("home.featuredEyebrow")}</span>
              <h2>{t("home.featuredTitle")}</h2>
            </div>
          </div>
          {featuredState.loading && <ProductGridSkeleton count={4} />}
          {featuredState.error && <ErrorState />}
          {featuredState.data && (
            <ProductGrid
              products={featuredState.data.slice(0, 4)}
              emptyTitle={t("home.featuredEmpty")}
            />
          )}
        </div>
      </section>
      <ContactSection />
    </>
  );
}
