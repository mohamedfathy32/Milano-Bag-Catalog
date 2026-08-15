export const WHATSAPP_NUMBER = "201094976357";

export function handleContactProduct(product, language = "ar") {
  const productName =
    product?.localizedName?.[language] || product?.name || "";
  const message =
    language === "ar"
      ? product
        ? `مرحبًا ميلانو باج، أريد الاستفسار عن ${productName} (${product.productCode}).`
        : "مرحبًا ميلانو باج، أريد معرفة المزيد عن مجموعات حقائب السفر."
      : product
        ? `Hello Milano Bag, I would like to ask about ${productName} (${product.productCode}).`
        : "Hello Milano Bag, I would like to know more about your luggage collections.";
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
}
