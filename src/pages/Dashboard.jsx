import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardProductForm from "../components/admin/DashboardProductForm";
import useAuth from "../hooks/useAuth";
import useI18n from "../hooks/useI18n";
import {
  deleteProduct,
  getAllProductsForAdmin,
  setProductEnabled,
} from "../services/adminProductService";
import {
  getImportableProducts,
  uploadCatalogProducts,
} from "../services/catalogImportService";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const { localize, t } = useI18n();
  const navigate = useNavigate();
  const importableProducts = useMemo(() => getImportableProducts(), []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState({ open: false, product: null });
  const [busyProductId, setBusyProductId] = useState("");
  const [uploadState, setUploadState] = useState({
    uploading: false,
    current: 0,
    message: "",
    error: "",
  });

  useEffect(() => {
    let active = true;
    getAllProductsForAdmin()
      .then((data) => {
        if (!active) return;
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError(t("dashboard.loadError"));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  async function refreshProducts() {
    setLoading(true);
    setLoadError("");
    try {
      setProducts(await getAllProductsForAdmin());
    } catch {
      setLoadError(t("dashboard.loadError"));
    } finally {
      setLoading(false);
    }
  }

  const categoryCounts = useMemo(
    () =>
      products.reduce(
        (counts, product) => {
          if (counts[product.category] !== undefined) {
            counts[product.category] += 1;
          }
          return counts;
        },
        { PP: 0, ABC: 0, PC: 0 },
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      [
        localize(product.localizedName),
        product.name,
        product.productCode,
        product.category,
      ].some((value) => String(value || "").toLowerCase().includes(term)),
    );
  }, [localize, products, search]);

  async function handleUpload() {
    if (!window.confirm(t("dashboard.confirm"))) return;

    setUploadState({
      uploading: true,
      current: 0,
      message: "",
      error: "",
    });

    try {
      const result = await uploadCatalogProducts((current) => {
        setUploadState((state) => ({ ...state, current }));
      });
      setUploadState({
        uploading: false,
        current: result.uploaded,
        message: t("dashboard.success", { count: result.uploaded }),
        error: "",
      });
      await refreshProducts();
    } catch (error) {
      setUploadState({
        uploading: false,
        current: 0,
        message: "",
        error: t(
          error.code === "permission-denied"
            ? "dashboard.permissionError"
            : "dashboard.uploadError",
        ),
      });
    }
  }

  async function handleToggle(product) {
    setBusyProductId(product.id);
    try {
      await setProductEnabled(product.id, !product.enabled);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, enabled: !product.enabled }
            : item,
        ),
      );
    } catch {
      setUploadState((state) => ({
        ...state,
        error: t("dashboard.actionError"),
        message: "",
      }));
    } finally {
      setBusyProductId("");
    }
  }

  async function handleDelete(product) {
    const productName = localize(product.localizedName) || product.name;
    if (!window.confirm(t("dashboard.deleteConfirm", { name: productName }))) {
      return;
    }

    setBusyProductId(product.id);
    try {
      await deleteProduct(product.id);
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
    } catch {
      setUploadState((state) => ({
        ...state,
        error: t("dashboard.actionError"),
        message: "",
      }));
    } finally {
      setBusyProductId("");
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <div>
            <span className="eyebrow eyebrow-light">{t("dashboard.eyebrow")}</span>
            <h1>{t("dashboard.title")}</h1>
            <p>{t("dashboard.description")}</p>
          </div>
          <div className="dashboard-account">
            <span>{t("dashboard.signedInAs")}</span>
            <strong>{user?.email}</strong>
            <button type="button" onClick={handleLogout}>{t("auth.logout")}</button>
          </div>
        </div>
      </header>

      <section className="container dashboard-content">
        <div className="dashboard-stats">
          <article>
            <span>{t("dashboard.firebaseProducts")}</span>
            <strong>{products.length}</strong>
            <small>
              {t("dashboard.activeCount", {
                count: products.filter((product) => product.enabled).length,
              })}
            </small>
          </article>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <article key={category}>
              <span>{t("common.collection", { category })}</span>
              <strong>{count}</strong>
              <small>{t("common.products", { count })}</small>
            </article>
          ))}
        </div>

        <section className="dashboard-actions-panel">
          <div>
            <h2>{t("dashboard.productsManagement")}</h2>
            <p>{t("dashboard.manageDescription")}</p>
          </div>
          <div>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleUpload}
              disabled={
                uploadState.uploading || importableProducts.length === 0
              }
            >
              {uploadState.uploading
                ? t("dashboard.uploading", {
                    current: uploadState.current,
                    total: importableProducts.length,
                  })
                : t("dashboard.importCatalog")}
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setEditor({ open: true, product: null })}
            >
              + {t("dashboard.addProduct")}
            </button>
          </div>
        </section>

        {uploadState.message && (
          <p className="dashboard-notice success" role="status">
            {uploadState.message}
          </p>
        )}
        {uploadState.error && (
          <p className="dashboard-notice error" role="alert">
            {uploadState.error}
          </p>
        )}

        <section className="dashboard-products-panel">
          <header>
            <div>
              <h2>{t("dashboard.firebaseProducts")}</h2>
              <span>{t("common.products", { count: products.length })}</span>
            </div>
            <label className="dashboard-search">
              <span className="sr-only">{t("common.searchCatalog")}</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("common.searchPlaceholder")}
              />
              <span aria-hidden="true">⌕</span>
            </label>
          </header>

          {loading && <div className="dashboard-loading">{t("common.loading")}</div>}
          {loadError && (
            <div className="dashboard-load-error">
              <p>{loadError}</p>
              <button className="btn btn-secondary" type="button" onClick={refreshProducts}>
                {t("common.tryAgain")}
              </button>
            </div>
          )}
          {!loading && !loadError && !filteredProducts.length && (
            <div className="dashboard-loading">{t("dashboard.noProducts")}</div>
          )}
          {!loading && !loadError && !!filteredProducts.length && (
            <div className="dashboard-product-list">
              {filteredProducts.map((product) => {
                const productName =
                  localize(product.localizedName) || product.name;
                const busy = busyProductId === product.id;
                return (
                  <article
                    className={`dashboard-product-row ${!product.enabled ? "disabled" : ""}`}
                    key={product.id}
                  >
                    <div className="dashboard-product-image">
                      <img
                        src={product.image || "/product-placeholder.svg"}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div className="dashboard-product-main">
                      <div>
                        <span className="category-badge">{product.category}</span>
                        <span className={`status-badge ${product.enabled ? "active" : "inactive"}`}>
                          {t(
                            product.enabled
                              ? "dashboard.statusActive"
                              : "dashboard.statusInactive",
                          )}
                        </span>
                      </div>
                      <h3>{productName}</h3>
                      <p>{product.productCode}</p>
                    </div>
                    <div className="dashboard-product-actions">
                      <button
                        type="button"
                        onClick={() => setEditor({ open: true, product })}
                        disabled={busy}
                      >
                        {t("dashboard.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(product)}
                        disabled={busy}
                      >
                        {t(
                          product.enabled
                            ? "dashboard.disable"
                            : "dashboard.enable",
                        )}
                      </button>
                      <button
                        className="danger"
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={busy}
                      >
                        {t("dashboard.delete")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

      {editor.open && (
        <DashboardProductForm
          key={editor.product?.id || "new-product"}
          product={editor.product}
          onCancel={() => setEditor({ open: false, product: null })}
          onSaved={async () => {
            setEditor({ open: false, product: null });
            setUploadState((state) => ({
              ...state,
              message: t("dashboard.saved"),
              error: "",
            }));
            await refreshProducts();
          }}
        />
      )}
    </main>
  );
}
