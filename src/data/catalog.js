/** Shared color palette — referenced by product.colors[].id */
export const COLOR_OPTIONS = {
  black: { id: "black", hex: "#1a1a1a" },
  navy: { id: "navy", hex: "#1e3a5f" },
  navi: { id: "navi", hex: "#152238" },
  silver: { id: "silver", hex: "#c0c0c0", border: "#9ca3af" },
  "rose-gold": { id: "rose-gold", hex: "#b76e79" },
  "petroleum-burgundy": { id: "petroleum-burgundy", hex: "#4a2c40" },
  burgundy: { id: "burgundy", hex: "#6b1e2f" },
  pink: { id: "pink", hex: "#ec4899" },
  purple: { id: "purple", hex: "#9333ea" },
  yellow: { id: "yellow", hex: "#eab308" },
  "dark-green": { id: "dark-green", hex: "#14532d" },
  olive: { id: "olive", hex: "#556b2f" },
  red: { id: "red", hex: "#dc2626" },
  "dark-gray": { id: "dark-gray", hex: "#374151" },
  "royal-blue": { id: "royal-blue", hex: "#4169e1" },
  "rose-red": { id: "rose-red", hex: "#e11d48" },
  lemon: { id: "lemon", hex: "#fde047", border: "#ca8a04" },
  gold: { id: "gold", hex: "#d4af37" },
  "light-gray": { id: "light-gray", hex: "#d1d5db", border: "#9ca3af" },
  blue: { id: "blue", hex: "#2563eb" },
  white: { id: "white", hex: "#f5f5f5", border: "#d1d5db" },
  gray: { id: "gray", hex: "#6b7280" },
  green: { id: "green", hex: "#16a34a" },
};






/** Build color variants — each color has its own product image */
export function buildProductColors(colorIds, image, gallery = []) {
  const images = [image, ...(gallery ?? [])].filter(Boolean);
  return colorIds.map((id, index) => ({
    id,
    image: images[index % images.length],
  }));
}

const MODEL_111_COLORS = [
  {
    id: "black",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784360003/h0ndagkjlxkg0dek7mkt.jpg",
  },
  {
    id: "red",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784360004/waledqmwhum0gelibjpd.jpg",
  },
  {
    id: "royal-blue",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784360009/rl0wg5sv6jsbaero5stc.jpg",
  },
  {
    id: "dark-gray",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784360007/nwfgks7mluvio0m7fxnu.jpg",
  },
  {
    id: "purple",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784359992/zia3jnvo64pmxwdf7jot.jpg",
  },
  {
    id: "pink",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784359990/db1ttp0yeipztrehhlax.jpg",
  },
  {
    id: "gold",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784359993/jzhmoacam57z2amfprp0.jpg",
  },
  {
    id: "silver",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784360005/bciohopromj0nkan5j6y.jpg",
  },
];

const MODEL_112_MAIN =
  "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784366445/stnosj0aeezytcucvcqc.jpg";

const MODEL_112_COLORS = [
  {
    id: "rose-gold",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784366430/rgdw7xyuaehvigfwtvtt.jpg",
  },
  {
    id: "black",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784366442/zzilzmrmwrck7zkg8aoc.jpg",
  },
  {
    id: "gold",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784366444/uahnnw2cwwcfkjtkwdsa.jpg",
  },
  {
    id: "silver",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784366445/isga1huq1ser1pavbakq.jpg",
  },
  {
    id: "dark-gray",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784366448/kd4hyraznq5zlhdhkygo.jpg",
  },
  {
    id: "red",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1784366448/vd0wprve4dkv9zcr6sau.jpg",
  },
];

const MODEL_032_DETAILS = [
  "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255919/jcmiw92jhgijodmwuwex.jpg",
  "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255900/uzidffocit9uficnflrb.jpg",
];

const MODEL_032_COLORS = [
  {
    id: "burgundy",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255988/tm4o8usctqpb0jlwr2fn.jpg",
  },
  {
    id: "black",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255986/fekv6hcndvrrid0ubwl1.jpg",
  },
  {
    id: "navy",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255979/hhfpflyw7thjukugxsav.jpg",
  },
  {
    id: "olive",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255976/rezwntsgh7b7wqxdhlzy.jpg",
  },
  {
    id: "pink",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255958/gzllq8grgmoczym8e5ls.jpg",
  },
  {
    id: "rose-gold",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255953/nfvt2mqnn0vyewvoficz.jpg",
  },
  {
    id: "gold",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255951/bme6uz2knyazeaoon21z.jpg",
  },
  {
    id: "navi",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255940/kbpm3ybogyub2oyk2dzj.jpg",
  },
  {
    id: "silver",
    image:
      "https://res.cloudinary.com/dikiqxn9f/image/upload/v1786255927/zwpwndphhlwygwwwvrjv.jpg",
  },
];

/**
 * Product fields (dashboard/Firebase-ready):
 * colors[{ id, image }], gallery[], shortDescription { en, ar }, longDescription { en, ar }
 */
export const products = [
  // PP Luggage
  {
    id: "model-111",
    slug: "model-111",
    mainCategoryId: "luggage",
    subcategoryId: "pp-luggage",
    sku: "Model 111",
    material: "PP",
    sizes: ["21", "25", "29"],
    featureIds: [
      "pureMaterial",
      "sameColorAccessories",
      "durable",
      "smoothWheels",
      "matchedSet",
    ],
    image: MODEL_111_COLORS[0].image,
    featured: true,
    gallery: MODEL_111_COLORS.map((color) => color.image),
    colors: MODEL_111_COLORS,
    shortDescription: {
      en: "PP hard-shell luggage set — 100% pure material with same-color accessories.",
      ar: "طقم أمتعة PP هارد شيل — خامة 100% نقية مع إكسسوارات بنفس اللون.",
    },
    longDescription: {
      en: "Model 111 is a premium PP hard-shell luggage set built from 100% pure polypropylene material. Handles, zippers, and wheel accents are color-matched to each shell for a cohesive export-ready presentation. Available as a matched 3-piece set in 21\", 25\", and 29\" sizes with eight color options for wholesale and retail partners.",
      ar: "موديل 111 طقم أمتعة PP هارد شيل مصنوع من خامة بولي بروبيلين 100% نقية. المقابض والسحّابات ولمسات العجلات بنفس لون الهيكل لمظهر متناسق جاهز للتصدير. متاح كطقم 3 قطع متناسق بمقاسات 21 و 25 و 29 بوصة مع 8 ألوان لشركاء الجملة والتجزئة.",
    },
  },
  {
    id: "model-112",
    slug: "model-112",
    mainCategoryId: "luggage",
    subcategoryId: "pp-luggage",
    sku: "Model 112",
    material: "PP",
    sizes: ["21", "25", "29"],
    featureIds: [
      "pureMaterial",
      "sameColorAccessories",
      "durable",
      "smoothWheels",
      "matchedSet",
    ],
    image: MODEL_112_MAIN,
    featured: true,
    gallery: [MODEL_112_MAIN, ...MODEL_112_COLORS.map((color) => color.image)],
    colors: MODEL_112_COLORS,
    shortDescription: {
      en: "PP hard-shell luggage set — 100% pure material with same-color accessories. Custom colors available.",
      ar: "طقم أمتعة PP هارد شيل — خامة 100% نقية مع إكسسوارات بنفس اللون. ألوان مخصصة متاحة.",
    },
    longDescription: {
      en: "Model 112 is a premium PP hard-shell luggage set built from 100% pure polypropylene material. Handles, zippers, and wheel accents are color-matched to each shell for a cohesive export-ready presentation. Available as a matched 3-piece set in 21\", 25\", and 29\" sizes with six color options shown — and all colors are available upon request if you need a different shade for your order.",
      ar: "موديل 112 طقم أمتعة PP هارد شيل مصنوع من خامة بولي بروبيلين 100% نقية. المقابض والسحّابات ولمسات العجلات بنفس لون الهيكل لمظهر متناسق جاهز للتصدير. متاح كطقم 3 قطع متناسق بمقاسات 21 و 25 و 29 بوصة مع 6 ألوان معروضة — وجميع الألوان متاحة عند الطلب لو محتاجين لون مختلف لطلبكم.",
    },
  },
  // ABS Luggage
  {
    id: "model-032",
    slug: "model-032",
    mainCategoryId: "luggage",
    subcategoryId: "abs-luggage",
    sku: "Model 032",
    material: "ABS",
    sizes: ["20", "24", "28"],
    featureIds: [
      "expansionZipper",
      "grayAccessories",
      "doubleWheel360Lock",
      "durable",
      "impactResistant",
    ],
    image: MODEL_032_COLORS[0].image,
    featured: true,
    gallery: [
      ...MODEL_032_COLORS.map((color) => color.image),
      ...MODEL_032_DETAILS,
    ],
    colors: MODEL_032_COLORS,
    shortDescription: {
      en: "ABS fiber hard-shell luggage with expansion zipper, gray accessories, and 360° double wheels with lock. Additional colors available upon request.",
      ar: "أمتعة ABS فيبر هارد شيل بسوستة توسيع وإكسسوارات رمادي وعجلات مزدوجة 360 مع قفل. ألوان إضافية متاحة عند الطلب.",
    },
    longDescription: {
      en: "Model 032 is our core ABS fiber hard-shell luggage line, engineered for wholesale and export partners. The shell combines impact-resistant ABS fiber construction with an expansion zipper for added packing capacity, complemented by gray accessories throughout the set and 360° double wheels with lock for smooth, secure mobility. Offered in 20\", 24\", and 28\" sizes across the displayed color range, with the full spectrum of colors available upon request to match your order requirements.",
      ar: "موديل 032 هو خط أمتعة ABS فيبر الأساسي لدينا، مصمّم لشركاء الجملة والتصدير. يجمع الهيكل بين خامة ABS فيبر المقاومة للصدمات وسوستة التوسيع لزيادة سعة التعبئة، مع إكسسوارات رمادي متناسقة على كامل الطقم وعجلات مزدوجة دوّارة 360 درجة مزوّدة بقفل لتنقّل سلس وآمن. متاح بمقاسات 20 و 24 و 28 بوصة ضمن مجموعة الألوان المعروضة، مع إمكانية توفير جميع الألوان عند الطلب بما يتوافق مع متطلبات طلبكم.",
    },
  },

];

