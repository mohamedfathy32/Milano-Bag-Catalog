import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductGallery from "../components/products/ProductGallery";
import ProductSpecifications from "../components/products/ProductSpecifications";
import { ErrorState } from "../components/ui/CatalogStates";
import useI18n from "../hooks/useI18n";
import { useProduct } from "../hooks/useProducts";
import { handleContactProduct } from "../services/contactService";

function ProductDetailsSkeleton() {
  return (
    <div className="container product-details-grid" aria-busy="true">
      <div className="skeleton aspect-square rounded-[2rem]" />
      <div className="space-y-5 py-8">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-12 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-1/3 rounded-full" />
        <div className="skeleton h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { language, localize, t } = useI18n();
  const { slug } = useParams();
  const { data: product, loading, error } = useProduct(slug);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor =
    product?.colors?.[selectedColorIndex] || product?.colors?.[0] || null;
  const productName = localize(product?.localizedName) || product?.name || "";
  const shortDescription =
    localize(product?.localizedShortDescription) || product?.shortDescription;
  const longDescription =
    localize(product?.localizedLongDescription) || product?.longDescription;

  useEffect(() => {
    if (product) {
      document.title = `${productName} | Milano Bag`;
      const description = document.querySelector('meta[name="description"]');
      description?.setAttribute(
        "content",
        shortDescription || t("product.exploreMeta", { name: productName }),
      );
    }
    return () => {
      document.title = t("seo.defaultTitle");
    };
  }, [product, productName, shortDescription, t]);

  const gallery = useMemo(() => {
    if (product?.gallery?.length) return product.gallery;
    return [product?.image].filter(Boolean);
  }, [product]);

  const preferredImage =
    selectedColor?.images?.[0] || selectedColor?.image || product?.image || "";

  if (loading) return <main className="page product-page"><ProductDetailsSkeleton /></main>;
  if (error) return <main className="page container"><ErrorState /></main>;
  if (!product) {
    return (
      <main className="page container state-panel">
        <span className="state-icon">404</span>
        <h1>{t("product.notFound")}</h1>
        <p>{t("product.notFoundMessage")}</p>
        <Link className="btn btn-primary" to="/products">{t("product.browse")}</Link>
      </main>
    );
  }

  return (
    <main className="page product-page">
      <div className="container product-breadcrumbs">
        <Link to="/products">{t("nav.products")}</Link><span>/</span>
        <Link to={`/${product.category.toLowerCase()}`}>{product.category}</Link><span>/</span>
        <span>{productName}</span>
      </div>
      <div className="container product-details-grid">
        <ProductGallery
          images={gallery}
          productName={productName}
          preferredImage={preferredImage}
        />
        <div className="product-info">
          <span className="category-badge">{product.category}</span>
          <h1>{productName}</h1>
          <p className="product-code">
            {t("product.code")} <strong>{product.productCode}</strong>
          </p>
          {shortDescription && (
            <p className="product-lead">{shortDescription}</p>
          )}
          {longDescription && (
            <div className="product-description">
              <h2>{t("product.about")}</h2>
              <p>{longDescription}</p>
            </div>
          )}
          <ProductSpecifications product={product} />
          {!!product.colors?.length && (
            <section className="color-picker" aria-labelledby="colors-title">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="colors-title">{t("product.colors")}</h2>
                <span>{localize(selectedColor?.name)}</span>
              </div>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <button
                    type="button"
                    key={`${localize(color.name)}-${index}`}
                    className={selectedColor === color ? "active" : ""}
                    onClick={() => setSelectedColorIndex(index)}
                    title={localize(color.name)}
                    aria-label={t("product.selectColor", {
                      name: localize(color.name),
                    })}
                    aria-pressed={selectedColor === color}
                  >
                    <span style={{ backgroundColor: color.value || "#cbd5e1" }} />
                  </button>
                ))}
              </div>
            </section>
          )}
          <button
            className="btn btn-primary product-contact"
            type="button"
            onClick={() => handleContactProduct(product, language)}
          >
            {t("product.ask")} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </main>
  );
}
