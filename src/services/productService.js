import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

const productsCollection = collection(db, "products");
let productsPromise;

function localizedText(value) {
  if (typeof value === "string") return value;
  return value?.en || value?.ar || "";
}

function normalizeCategory(data) {
  const value = String(data.category || data.material || "").toUpperCase();
  return value === "ABS" ? "ABC" : value;
}

function normalizeGallery(data) {
  const galleryItems = Array.isArray(data.gallery) ? data.gallery : [];
  const urls = galleryItems
    .map((item) => (typeof item === "string" ? item : item?.image || item?.url || ""))
    .filter(Boolean);

  if (data.image && !urls.includes(data.image)) {
    urls.unshift(data.image);
  }

  return [...new Set(urls)];
}

export function normalizeProductData(data, id) {
  const localizedName =
    typeof data.name === "object"
      ? data.name
      : { en: data.name || data.sku || id, ar: data.name || data.sku || id };
  const gallery = normalizeGallery(data);

  return {
    id,
    ...data,
    category: normalizeCategory(data),
    material: data.material || data.category,
    name: localizedText(localizedName) || data.sku || id,
    localizedName,
    productCode: data.productCode || data.sku || id,
    shortDescription: localizedText(data.shortDescription),
    localizedShortDescription: data.shortDescription,
    longDescription: localizedText(data.longDescription),
    localizedLongDescription: data.longDescription,
    image: data.image || gallery[0] || "",
    gallery,
    colors: (data.colors || []).map((color) => ({
      ...color,
      name: color.name || color.id || "",
      value: color.value || color.hex || "#cbd5e1",
      images: color.images?.length
        ? color.images
        : color.image
          ? [color.image]
          : [],
    })),
    sizes: Array.isArray(data.sizes)
      ? data.sizes
      : data.size
        ? [data.size]
        : [],
    pieces: data.pieces || data.sizes?.length,
    enabled: data.enabled !== false,
  };
}

export function clearProductsCache() {
  productsPromise = undefined;
}

export async function getProducts() {
  if (!productsPromise) {
    productsPromise = getDocs(productsCollection)
      .then((snapshot) =>
        snapshot.docs
          .map((productDocument) =>
            normalizeProductData(productDocument.data(), productDocument.id),
          )
          .filter((product) => product.enabled),
      )
      .catch((error) => {
        productsPromise = undefined;
        throw error;
      });
  }
  return productsPromise;
}

export async function getAllProductsForAdmin() {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((productDocument) =>
    normalizeProductData(productDocument.data(), productDocument.id),
  );
}

export async function getProductBySlug(slug) {
  const cachedProducts = await getProducts();
  const cachedProduct = cachedProducts.find((product) => product.slug === slug);
  if (cachedProduct) return cachedProduct;

  const result = await getDocs(
    query(productsCollection, where("slug", "==", slug), limit(1)),
  );
  if (result.empty) return null;
  const product = normalizeProductData(result.docs[0].data(), result.docs[0].id);
  return product.enabled ? product : null;
}

export async function getProductsByCategory(category) {
  const products = await getProducts();
  return products.filter((product) => product.category === category.toUpperCase());
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.featured);
}

export async function searchProducts(searchTerm) {
  const term = searchTerm.trim().toLocaleLowerCase();
  if (!term) return [];

  const products = await getProducts();
  return products.filter((product) => {
    const translatedNames =
      typeof product.localizedName === "object"
        ? Object.values(product.localizedName)
        : [];
    return [product.name, ...translatedNames, product.productCode, product.category]
      .filter(Boolean)
      .some((value) => String(value).toLocaleLowerCase().includes(term));
  });
}
