import useI18n from "../../hooks/useI18n";

function displayValue(value, localize) {
  if (Array.isArray(value)) return value.map(localize).join(", ");
  return localize(value);
}

export default function ProductSpecifications({ product }) {
  const { localize, t } = useI18n();
  const details = [
    ["material", product.material],
    ["sizes", product.sizes?.length ? `${product.sizes.join('", ')}"` : null],
    ["dimensions", product.dimensions],
    ["weight", product.weight],
    ["pieces", product.pieces],
    ...Object.entries(product.specifications || {}),
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  if (!details.length) return null;

  return (
    <section className="product-specs" aria-labelledby="specifications-title">
      <h2 id="specifications-title">{t("specifications.title")}</h2>
      <dl>
        {details.map(([key, value]) => (
          <div key={key}>
            <dt>
              {t(`specifications.${key}`) === `specifications.${key}`
                ? key.replace(/([A-Z])/g, " $1")
                : t(`specifications.${key}`)}
            </dt>
            <dd>{displayValue(value, localize)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
