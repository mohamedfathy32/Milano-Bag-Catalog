import { useEffect, useState } from "react";
import useI18n from "../../hooks/useI18n";
import { ProductImage } from "./ProductCard";

export default function ProductGallery({
  images,
  productName,
  preferredImage = "",
}) {
  const { t } = useI18n();
  const safeImages = images?.length ? images : [""];
  const galleryKey = safeImages.join("|");
  const [selection, setSelection] = useState({ key: "", image: "" });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage =
    selection.key === galleryKey && safeImages.includes(selection.image)
      ? selection.image
      : preferredImage && safeImages.includes(preferredImage)
        ? preferredImage
        : safeImages[0];

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [lightboxOpen]);

  return (
    <div className="product-gallery">
      <button
        type="button"
        className="gallery-main"
        onClick={() => setLightboxOpen(true)}
        aria-label={t("gallery.open")}
      >
        <ProductImage src={activeImage} alt={productName} className="aspect-square" />
        <span className="gallery-zoom">{t("gallery.fullscreen")}</span>
      </button>

      {safeImages.length > 1 && (
        <div className="gallery-thumbnails" aria-label={t("gallery.images")}>
          {safeImages.map((image, index) => (
            <button
              type="button"
              className={activeImage === image ? "active" : ""}
              key={`${image}-${index}`}
              onClick={() => setSelection({ key: galleryKey, image })}
              aria-label={t("gallery.viewImage", { number: index + 1 })}
              aria-pressed={activeImage === image}
            >
              <ProductImage src={image} alt="" className="aspect-square" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t("gallery.dialog")}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label={t("gallery.close")}
            autoFocus
          >
            ×
          </button>
          <ProductImage src={activeImage} alt={productName} className="lightbox-image" />
        </div>
      )}
    </div>
  );
}
