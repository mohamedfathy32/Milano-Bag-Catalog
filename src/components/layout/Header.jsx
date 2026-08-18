import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useI18n from "../../hooks/useI18n";
import BrandLogo from "./BrandLogo";

const NAV_ITEMS = [
  ["/", "nav.home"],
  ["/products", "nav.products"],
  ["/pp", "PP"],
  ["/abs", "ABS"],
  ["/pc", "PC"],
];

function SearchForm({ compact = false, onSubmit }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useI18n();

  function submit(event) {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onSubmit?.();
  }

  return (
    <form className={`header-search ${compact ? "compact" : ""}`} role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor={compact ? "mobile-search" : "desktop-search"}>
        {t("common.searchCatalog")}
      </label>
      <input
        id={compact ? "mobile-search" : "desktop-search"}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("common.search")}
      />
      <button type="submit" aria-label={t("common.search")}>
        <span aria-hidden="true">⌕</span>
      </button>
    </form>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const { isAdmin } = useAuth();
  const { t, toggleLanguage } = useI18n();
  const navigationItems = isAdmin
    ? [...NAV_ITEMS, ["/dashboard", "nav.dashboard"]]
    : NAV_ITEMS;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandLogo />
        <nav className="desktop-nav" aria-label={t("nav.primary")}>
          {navigationItems.map(([path, labelKey]) => (
            <NavLink key={path} to={path} end={path === "/"}>
              {labelKey.includes(".") ? t(labelKey) : labelKey}
            </NavLink>
          ))}
        </nav>
        <div className="desktop-tools">
          <SearchForm />
          <button
            className="language-toggle"
            type="button"
            onClick={toggleLanguage}
            aria-label={t("language.switchLabel")}
          >
            {t("language.switch")}
          </button>
        </div>
        <div className="mobile-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={toggleLanguage}
            aria-label={t("language.switchLabel")}
          >
            {t("language.switch")}
          </button>
          <NavLink className="mobile-search-link" to="/search" aria-label={t("nav.search")}>
            ⌕
          </NavLink>
          <button
            ref={menuButtonRef}
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("nav.openMenu")}
            aria-expanded={menuOpen}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label={t("nav.closeMenu")}
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        />
        <div className="mobile-menu-panel">
          <div className="flex items-center justify-between">
            <BrandLogo />
            <button
              className="menu-close"
              type="button"
              onClick={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
              aria-label={t("nav.closeMenu")}
            >
              ×
            </button>
          </div>
          <SearchForm compact onSubmit={() => setMenuOpen(false)} />
          <nav aria-label={t("nav.mobile")}>
            {navigationItems.map(([path, labelKey]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={() => setMenuOpen(false)}
              >
                <span>{labelKey.includes(".") ? t(labelKey) : labelKey}</span>
                <span aria-hidden="true">↗</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
