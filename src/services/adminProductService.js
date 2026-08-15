import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  clearProductsCache,
  getAllProductsForAdmin,
} from "./productService";

export { getAllProductsForAdmin };

export function createSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function prepareProduct(product) {
  const sizes = Array.isArray(product.sizes)
    ? product.sizes.filter(Boolean)
    : String(product.sizes || "")
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

  return {
    slug: createSlug(product.slug || product.productCode || product.name?.en),
    name: {
      ar: product.name?.ar?.trim() || product.name?.en?.trim(),
      en: product.name?.en?.trim() || product.name?.ar?.trim(),
    },
    productCode: product.productCode?.trim(),
    sku: product.productCode?.trim(),
    category: product.category,
    material: product.material?.trim() || product.category,
    sizes,
    pieces: sizes.length,
    image: product.image?.trim() || "",
    gallery: (product.gallery || []).filter(Boolean),
    colors: product.colors || [],
    shortDescription: {
      ar: product.shortDescription?.ar?.trim() || "",
      en: product.shortDescription?.en?.trim() || "",
    },
    longDescription: {
      ar: product.longDescription?.ar?.trim() || "",
      en: product.longDescription?.en?.trim() || "",
    },
    featured: Boolean(product.featured),
    enabled: product.enabled !== false,
  };
}

export async function createProduct(product) {
  const preparedProduct = prepareProduct(product);
  const productReference = doc(db, "products", preparedProduct.slug);
  const existingProduct = await getDoc(productReference);

  if (existingProduct.exists()) {
    const error = new Error("A product with this slug already exists.");
    error.code = "product/already-exists";
    throw error;
  }

  await setDoc(productReference, {
    ...preparedProduct,
    id: preparedProduct.slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  clearProductsCache();
  return preparedProduct.slug;
}

export async function updateProduct(productId, product) {
  const preparedProduct = prepareProduct(product);
  await updateDoc(doc(db, "products", productId), {
    ...preparedProduct,
    updatedAt: serverTimestamp(),
  });
  clearProductsCache();
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, "products", productId));
  clearProductsCache();
}

export async function setProductEnabled(productId, enabled) {
  await updateDoc(doc(db, "products", productId), {
    enabled,
    updatedAt: serverTimestamp(),
  });
  clearProductsCache();
}
