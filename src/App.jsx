import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { ProductGridSkeleton } from "./components/ui/CatalogStates";
import useAuth from "./hooks/useAuth";
import useI18n from "./hooks/useI18n";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Products = lazy(() => import("./pages/Products"));
const Category = lazy(() => import("./pages/Category"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Search = lazy(() => import("./pages/Search"));

function ScrollManager() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/product/")) return;
    document.title = t("seo.defaultTitle");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t("seo.defaultDescription"));
  }, [pathname, t]);

  return null;
}

function NotFound() {
  const { t } = useI18n();
  return (
    <main className="page container state-panel">
      <span className="state-icon">404</span>
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.message")}</p>
      <Link className="btn btn-primary" to="/">{t("notFound.back")}</Link>
    </main>
  );
}

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="page section container">
        <ProductGridSkeleton count={4} />
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

function CatalogRoutes() {
  return (
    <div className="app-shell">
      <ScrollManager />
      <Header />
      <Suspense
        fallback={
          <main className="page section container">
            <ProductGridSkeleton />
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pp" element={<Category category="PP" />} />
          <Route path="/abc" element={<Category category="ABC" />} />
          <Route path="/pc" element={<Category category="PC" />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CatalogRoutes />
    </BrowserRouter>
  );
}
