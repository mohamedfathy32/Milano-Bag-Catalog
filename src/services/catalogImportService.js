import {
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { products as catalogProducts } from "../data/catalog";
import { db } from "../firebase/config";
import { clearProductsCache } from "./productService";

const CATEGORY_MAP = {
  PP: "PP",
  ABS: "ABS",
  PC: "PC",
};

function removeUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([key, child]) => [key, removeUndefined(child)]),
    );
  }
  return value;
}

export function getImportableProducts() {
  return catalogProducts.filter(
    (product) =>
      product.mainCategoryId === "luggage" &&
      CATEGORY_MAP[String(product.material || "").toUpperCase()],
  );
}

export async function uploadCatalogProducts(onProgress) {
  const products = getImportableProducts();
  const batchSize = 450;
  let uploaded = 0;

  for (let index = 0; index < products.length; index += batchSize) {
    const currentProducts = products.slice(index, index + batchSize);
    const batch = writeBatch(db);

    currentProducts.forEach((rawProduct) => {
      const category =
        CATEGORY_MAP[String(rawProduct.material || "").toUpperCase()];
      const product = removeUndefined({
        ...rawProduct,
        category,
        name: {
          en: rawProduct.sku,
          ar: rawProduct.sku.startsWith("Model ")
            ? `موديل ${rawProduct.sku.replace("Model ", "")}`
            : `موديل ${rawProduct.sku}`,
        },
        productCode: rawProduct.productCode || rawProduct.sku || rawProduct.id,
        gallery: Array.isArray(rawProduct.gallery)
          ? rawProduct.gallery.filter(Boolean)
          : [],
        enabled: true,
        source: "catalog.js",
      });

      batch.set(
        doc(db, "products", rawProduct.id),
        { ...product, updatedAt: serverTimestamp() },
        { merge: true },
      );
    });

    await batch.commit();
    uploaded += currentProducts.length;
    onProgress?.(uploaded, products.length);
  }

  clearProductsCache();
  return { uploaded, total: products.length };
}
