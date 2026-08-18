import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (Object.values(firebaseConfig).some((value) => !value)) {
  throw new Error("Firebase environment variables are missing. Check .env.");
}

const palette = [
  { name: { en: "Midnight Navy", ar: "كحلي داكن" }, value: "#06033b" },
  { name: { en: "Graphite", ar: "جرافيت" }, value: "#4b4b50" },
  { name: { en: "Milano Red", ar: "أحمر ميلانو" }, value: "#f9062d" },
];

const models = [
  ["pp-111", "Model 111", "PP", ["21", "25", "29"], true],
  ["pp-205", "Model 205", "PP", ["20", "24", "28"], true],
  ["pp-310", "Model 310", "PP", ["20", "24", "28"], false],
  ["abs-420", "Model 420", "ABS", ["20", "24", "28"], true],
  ["abs-515", "Model 515", "ABS", ["21", "25", "29"], false],
  ["abs-620", "Model 620", "ABS", ["20", "24", "28"], false],
  ["pc-710", "Model 710", "PC", ["20", "24", "28"], true],
  ["pc-825", "Model 825", "PC", ["21", "25", "29"], false],
  ["pc-930", "Model 930", "PC", ["20", "24", "28"], false],
];

function createProduct([slug, sku, category, sizes, featured]) {
  const materialNames = {
    PP: "pure polypropylene",
    ABS: "premium composite",
    PC: "lightweight polycarbonate",
  };
  return {
    id: slug,
    slug,
    category,
    mainCategoryId: "luggage",
    subcategoryId: `${category.toLowerCase()}-luggage`,
    name: { en: `Milano ${sku}`, ar: `ميلانو ${sku}` },
    sku,
    productCode: sku,
    material: category,
    sizes,
    pieces: sizes.length,
    featured,
    image: "/product-placeholder.svg",
    gallery: ["/product-placeholder.svg"],
    colors: palette.map((color) => ({
      ...color,
      images: ["/product-placeholder.svg"],
    })),
    shortDescription: {
      en: `${category} hard-shell luggage with a refined silhouette and travel-ready construction.`,
      ar: `حقيبة سفر هارد شيل من ${category} بتصميم أنيق وتجهيز عملي للسفر.`,
    },
    longDescription: {
      en: `${sku} is a premium Milano Bag luggage set crafted from ${materialNames[category]}. Its balanced proportions, smooth wheels, and coordinated details make it a dependable choice for retail and wholesale partners.`,
      ar: `${sku} طقم حقائب سفر فاخر من ميلانو باج، يجمع بين المتانة والتصميم المتناسق والعجلات السلسة.`,
    },
    specifications: {
      shell: { en: "Hard shell", ar: "هيكل صلب" },
      wheels: {
        en: "360° smooth spinner wheels",
        ar: "عجلات دوارة سلسة بزاوية 360°",
      },
      lock: {
        en: "Integrated combination lock",
        ar: "قفل أرقام مدمج",
      },
    },
    updatedAt: serverTimestamp(),
  };
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

await Promise.all(
  models.map((model) => {
    const product = createProduct(model);
    return setDoc(doc(db, "products", product.id), product, { merge: true });
  }),
);

console.log(`Seeded ${models.length} Milano Bag products.`);
