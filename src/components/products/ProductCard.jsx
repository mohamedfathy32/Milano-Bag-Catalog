import { useState } from "react";
import { Link } from "react-router-dom";
import useI18n from "../../hooks/useI18n";

const FALLBACK_IMAGE = "/product-placeholder.svg";

function ProductImage({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState(src || FALLBACK_IMAGE);

  return (
    <div className={`image-shell ${className}`}>
      {!loaded && <span className="image-loader" aria-hidden="true" />}
      <img
        src={source}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (source !== FALLBACK_IMAGE) setSource(FALLBACK_IMAGE);
          setLoaded(true);
        }}
      />
    </div>
  );
}

export default function ProductCard({ product }) {
  const { localize, t } = useI18n();
  const productName = localize(product.localizedName) || product.name;
  const sizes =
    product.sizes?.join('", ') || t("product.availableOnRequest");

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.slug}`}
        aria-label={t("product.view", { name: productName })}
      >
        <ProductImage src={product.image} alt={productName} className="aspect-[4/5]" />
        <div className="product-card-content">
          <div className="flex items-center justify-between gap-3">
            <span className="category-badge">{product.category}</span>
            <span className="text-xs tracking-wider text-slate-400">
              {product.productCode}
            </span>
          </div>
          <h3>{productName}</h3>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 text-xs text-slate-500">
              <p className="truncate">{t("product.sizes", { sizes })}</p>
              {!!product.colors?.length && (
                <p>{t("product.colorsCount", { count: product.colors.length })}</p>
              )}
            </div>
            <span className="card-arrow" aria-hidden="true">↗</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export { ProductImage };
