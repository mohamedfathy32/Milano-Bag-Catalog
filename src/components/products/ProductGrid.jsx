import ProductCard from "./ProductCard";
import { EmptyState } from "../ui/CatalogStates";

export default function ProductGrid({ products, emptyTitle }) {
  if (!products?.length) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
