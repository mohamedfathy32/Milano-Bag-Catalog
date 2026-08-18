import { useEffect, useState } from "react";
import useI18n from "../../hooks/useI18n";
import {
  createProduct,
  createSlug,
  updateProduct,
} from "../../services/adminProductService";
import { uploadImageToCloudinaryWithProgress } from "../../services/cloudinaryUpload";

function createInitialForm(product) {
  const gallery = product?.gallery?.length
    ? [...product.gallery]
    : product?.image
      ? [product.image]
      : [];

  return {
    nameAr: product?.localizedName?.ar || "",
    nameEn: product?.localizedName?.en || product?.name || "",
    productCode: product?.productCode || "",
    slug: product?.slug || "",
    category: product?.category || "PP",
    material: product?.material || "PP",
    sizes: product?.sizes?.join(", ") || "",
    image: product?.image || gallery[0] || "",
    gallery,
    shortAr: product?.localizedShortDescription?.ar || "",
    shortEn:
      product?.localizedShortDescription?.en || product?.shortDescription || "",
    longAr: product?.localizedLongDescription?.ar || "",
    longEn:
      product?.localizedLongDescription?.en || product?.longDescription || "",
    featured: Boolean(product?.featured),
    enabled: product?.enabled !== false,
  };
}

export default function DashboardProductForm({
  product,
  onCancel,
  onSaved,
}) {
  const { t } = useI18n();
  const [form, setForm] = useState(() => createInitialForm(product));
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addGalleryImage(url) {
    if (!url) return;
    setForm((current) => {
      const gallery = current.gallery.includes(url)
        ? current.gallery
        : [...current.gallery, url];
      return {
        ...current,
        gallery,
        image: current.image || url,
      };
    });
  }

  function removeGalleryImage(url) {
    setForm((current) => {
      const gallery = current.gallery.filter((item) => item !== url);
      return {
        ...current,
        gallery,
        image: current.image === url ? gallery[0] || "" : current.image,
      };
    });
  }

  async function handleImageUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setError("");
    setUploadProgress(1);

    try {
      for (const [index, file] of files.entries()) {
        const imageUrl = await uploadImageToCloudinaryWithProgress(
          file,
          (progress) => {
            const overall = Math.round(
              ((index + progress / 100) / files.length) * 100,
            );
            setUploadProgress(overall);
          },
        );
        addGalleryImage(imageUrl);
      }
      setUploadProgress(100);
    } catch (uploadError) {
      setError(uploadError.message || t("dashboard.imageUploadError"));
      setUploadProgress(0);
    } finally {
      event.target.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const gallery = [...new Set(form.gallery.filter(Boolean))];
    if (form.image && !gallery.includes(form.image)) {
      gallery.unshift(form.image);
    }

    const payload = {
      slug: createSlug(form.slug || form.productCode || form.nameEn),
      name: { ar: form.nameAr, en: form.nameEn },
      productCode: form.productCode,
      category: form.category,
      material: form.material,
      sizes: form.sizes,
      image: form.image || gallery[0] || "",
      gallery,
      colors: product?.colors || [],
      shortDescription: { ar: form.shortAr, en: form.shortEn },
      longDescription: { ar: form.longAr, en: form.longEn },
      featured: form.featured,
      enabled: form.enabled,
    };

    try {
      if (product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved();
    } catch (saveError) {
      setError(
        t(
          saveError.code === "product/already-exists"
            ? "dashboard.duplicateProduct"
            : "dashboard.saveError",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-form-overlay" role="dialog" aria-modal="true">
      <button
        className="dashboard-form-backdrop"
        type="button"
        onClick={onCancel}
        aria-label={t("dashboard.cancel")}
      />
      <section className="dashboard-product-form">
        <header>
          <div>
            <span className="eyebrow">
              {product ? t("dashboard.editProduct") : t("dashboard.addProduct")}
            </span>
            <h2>
              {product
                ? product.localizedName?.ar || product.name
                : t("dashboard.newProduct")}
            </h2>
          </div>
          <button type="button" onClick={onCancel} aria-label={t("dashboard.cancel")}>
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="dashboard-form-grid">
            <label>
              <span>{t("dashboard.nameAr")}</span>
              <input
                value={form.nameAr}
                onChange={(event) => updateField("nameAr", event.target.value)}
                required
              />
            </label>
            <label>
              <span>{t("dashboard.nameEn")}</span>
              <input
                value={form.nameEn}
                onChange={(event) => updateField("nameEn", event.target.value)}
                dir="ltr"
                required
              />
            </label>
            <label>
              <span>{t("dashboard.productCode")}</span>
              <input
                value={form.productCode}
                onChange={(event) =>
                  updateField("productCode", event.target.value)
                }
                dir="ltr"
                required
              />
            </label>
            <label>
              <span>{t("dashboard.slug")}</span>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder={createSlug(form.productCode || form.nameEn)}
                dir="ltr"
              />
            </label>
            <label>
              <span>{t("dashboard.category")}</span>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
              >
                <option value="PP">PP</option>
                <option value="ABS">ABS</option>
                <option value="PC">PC</option>
              </select>
            </label>
            <label>
              <span>{t("dashboard.material")}</span>
              <input
                value={form.material}
                onChange={(event) => updateField("material", event.target.value)}
              />
            </label>
            <label className="form-full">
              <span>{t("dashboard.sizes")}</span>
              <input
                value={form.sizes}
                onChange={(event) => updateField("sizes", event.target.value)}
                placeholder="20, 24, 28"
                dir="ltr"
              />
            </label>
            <label className="form-full">
              <span>{t("dashboard.imageUrl")}</span>
              <input
                type="url"
                value={form.image}
                onChange={(event) => {
                  const value = event.target.value;
                  updateField("image", value);
                  if (value) addGalleryImage(value);
                }}
                dir="ltr"
              />
            </label>
            <label className="dashboard-image-upload form-full">
              <span>{t("dashboard.uploadGallery")}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <small>
                  {t("dashboard.imageProgress", { progress: uploadProgress })}
                </small>
              )}
            </label>
            {!!form.gallery.length && (
              <div className="dashboard-gallery-grid form-full">
                {form.gallery.map((image) => (
                  <div className="dashboard-gallery-item" key={image}>
                    <img src={image} alt="" />
                    <div className="dashboard-gallery-item-actions">
                      <button
                        type="button"
                        className={form.image === image ? "active" : ""}
                        onClick={() => updateField("image", image)}
                      >
                        {form.image === image
                          ? t("dashboard.mainImage")
                          : t("dashboard.setMainImage")}
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeGalleryImage(image)}
                      >
                        {t("dashboard.removeImage")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label className="form-full">
              <span>{t("dashboard.shortAr")}</span>
              <textarea
                value={form.shortAr}
                onChange={(event) => updateField("shortAr", event.target.value)}
                rows="2"
              />
            </label>
            <label className="form-full">
              <span>{t("dashboard.shortEn")}</span>
              <textarea
                value={form.shortEn}
                onChange={(event) => updateField("shortEn", event.target.value)}
                rows="2"
                dir="ltr"
              />
            </label>
            <label className="form-full">
              <span>{t("dashboard.longAr")}</span>
              <textarea
                value={form.longAr}
                onChange={(event) => updateField("longAr", event.target.value)}
                rows="4"
              />
            </label>
            <label className="form-full">
              <span>{t("dashboard.longEn")}</span>
              <textarea
                value={form.longEn}
                onChange={(event) => updateField("longEn", event.target.value)}
                rows="4"
                dir="ltr"
              />
            </label>
          </div>

          <div className="dashboard-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => updateField("featured", event.target.checked)}
              />
              <span>{t("dashboard.featured")}</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) => updateField("enabled", event.target.checked)}
              />
              <span>{t("dashboard.enabled")}</span>
            </label>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <footer>
            <button className="btn btn-secondary" type="button" onClick={onCancel}>
              {t("dashboard.cancel")}
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? t("dashboard.saving") : t("dashboard.save")}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
