import { Link } from "react-router-dom";
import useI18n from "../../hooks/useI18n";
export default function BrandLogo({ light = false }) {
  const { t } = useI18n();
  const logoSrc = light
    ? "/milano_bag_logo-white.png"
    : "/milano_bag_logo.png";

  return (
    <Link
      className={`brand-logo ${light ? "brand-logo-footer" : "brand-logo-header"}`}
      to="/"
      aria-label={`Milano Bag - ${t("nav.home")}`}
    >
      <img src={logoSrc} alt="Milano Bag" />
    </Link>
  );
}
