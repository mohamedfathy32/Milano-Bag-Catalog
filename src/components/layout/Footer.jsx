import { Link } from "react-router-dom";
import useI18n from "../../hooks/useI18n";
import BrandLogo from "./BrandLogo";

const WHATSAPP_URL = "https://wa.me/201094976357";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <BrandLogo light />
          <p className="footer-intro">{t("footer.description")}</p>
        </div>
        <div>
          <h2>{t("footer.collections")}</h2>
          <Link to="/pp">{t("common.collection", { category: "PP" })}</Link>
          <Link to="/abs">{t("common.collection", { category: "ABS" })}</Link>
          <Link to="/pc">{t("common.collection", { category: "PC" })}</Link>
        </div>
        <div>
          <h2>{t("footer.discover")}</h2>
          <Link to="/">{t("nav.home")}</Link>
          <Link to="/products">{t("footer.allProducts")}</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">{t("common.contact")}</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
        <span>{t("footer.tagline")}</span>
      </div>
    </footer>
  );
}
