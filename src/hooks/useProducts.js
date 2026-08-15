import { useEffect, useState } from "react";
import {
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "../services/productService";

function useRequest(request, dependencies) {
  const requestKey = JSON.stringify(dependencies);
  const [state, setState] = useState({
    key: "",
    data: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    request()
      .then((data) => {
        if (active) setState({ key: requestKey, data, error: null });
      })
      .catch((error) => {
        if (active) setState({ key: requestKey, data: null, error });
      });

    return () => {
      active = false;
    };
    // The caller provides the values that define this request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return state.key === requestKey
    ? { data: state.data, loading: false, error: state.error }
    : { data: null, loading: true, error: null };
}

export function useAllProducts() {
  return useRequest(getProducts, []);
}

export function useFeaturedProducts() {
  return useRequest(getFeaturedProducts, []);
}

export function useCategoryProducts(category) {
  return useRequest(() => getProductsByCategory(category), [category]);
}

export function useProduct(slug) {
  return useRequest(() => getProductBySlug(slug), [slug]);
}

export function useProductSearch(query) {
  return useRequest(() => searchProducts(query), [query]);
}
