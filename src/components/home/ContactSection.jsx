import { handleContactProduct } from "../../services/contactService";
import useI18n from "../../hooks/useI18n";

export default function ContactSection() {
  const { language, t } = useI18n();
  return (
    <section className="contact-section">
      <div className="container contact-inner">
        <div>
          <span className="eyebrow eyebrow-light">{t("contact.eyebrow")}</span>
          <h2>{t("contact.title")}</h2>
        </div>
        <button
          className="btn btn-light"
          type="button"
          onClick={() => handleContactProduct(null, language)}
        >
          {t("contact.whatsapp")}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}
