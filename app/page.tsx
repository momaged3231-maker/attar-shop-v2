"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Lang = "ar" | "en";
type Localized = Record<Lang, string>;

type Product = {
  id: number;
  name: Localized;
  category: string;
  price: number;
  oldPrice?: number;
  unit: Localized;
  image: string;
  gradient: string;
  tag: Localized;
  description: Localized;
};

type CartItem = Product & { quantity: number };

const dictionary = {
  ar: {
    brand: "عطارة الإمارات",
    navCategories: "التصنيفات",
    navProducts: "المنتجات",
    navStory: "الحكاية",
    navReviews: "آراء العملاء",
    cart: "السلة",
    shopNow: "تسوق الآن",
    heroBadge: "مستوحى من الضيافة الإماراتية والأسواق التراثية",
    heroTitleA: "عطارة إماراتية",
    heroTitleB: "بأسلوب عالمي فاخر",
    heroText:
      "تجربة متجر ثنائية اللغة للأعشاب، التوابل، العسل، الزيوت، التمور ولمسات العود. واجهة هادئة وفخمة تناسب سوق الإمارات وتبيع الثقة قبل المنتج.",
    browseProducts: "تصفح المنتجات",
    discoverStory: "اعرف الحكاية",
    statProducts: "منتج مختار",
    statLanguages: "لغتان",
    statUi: "واجهة عرض",
    categoriesEyebrow: "تسوق حسب الفئة",
    categoriesTitle: "تصنيفات واضحة تناسب عميل الإمارات",
    categoriesText: "اختيار سريع بين التوابل، الأعشاب، العسل، الزيوت، التمور ومنتجات الضيافة.",
    productsEyebrow: "منتجات مختارة",
    productsTitle: "واجهة بيع بسيطة وراقية",
    visibleProducts: "منتج ظاهر",
    addToCart: "أضف للسلة",
    buy: "شراء",
    aed: "درهم",
    storyEyebrow: "الطابع الإماراتي",
    storyTitle: "من روح السوق القديم إلى متجر فاخر على الإنترنت",
    storyP1:
      "التصميم يمزج بين ألوان علم الإمارات، دفء الرمال، فخامة الذهب، وهدوء الأخضر الداكن. الهدف أن يشعر العميل بأن المتجر أصيل ومنظم وجدير بالثقة.",
    storyP2:
      "اللغة العربية والإنجليزية مدمجتان داخل التجربة، لتناسب جمهور الإمارات المتنوع من السكان، الزوار، ومحبي الهدايا التراثية الفاخرة.",
    years: "هوية مستوحاة من التراث",
    delivery: "تجربة UI فقط",
    rating: "إحساس Premium",
    featuresEyebrow: "لماذا التجربة مقنعة؟",
    featuresTitle: "تفاصيل صغيرة ترفع قيمة البراند",
    reviewsEyebrow: "آراء العملاء",
    reviewsTitle: "نبرة محلية تناسب العرض على العميل",
    newsletterEyebrow: "العروض والهدايا",
    newsletterTitle: "اجعل أول طلب يبدأ بضيافة إماراتية",
    newsletterText: "نموذج UI لجمع اهتمام العملاء بعرض خصم أو علبة هدايا تراثية، بدون Backend حالياً.",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    newsletterButton: "احصل على عرض الضيافة",
    cartTitle: "سلة الطلب",
    cartNote: "واجهة فقط بدون دفع حقيقي",
    emptyCart: "السلة فارغة حالياً",
    total: "الإجمالي",
    checkout: "إتمام الطلب UI",
    favoriteAdded: "تمت الإضافة للمفضلة",
    favoriteRemoved: "تمت الإزالة من المفضلة",
    cartAdded: "تمت الإضافة للسلة",
    footerText: "واجهة متجر عطارة إماراتية ثنائية اللغة، جاهزة للتطوير والربط لاحقاً.",
    store: "المتجر",
    contact: "التواصل",
    follow: "تابعنا",
    whatsapp: "وات",
  },
  en: {
    brand: "Emirates Attar",
    navCategories: "Categories",
    navProducts: "Products",
    navStory: "Story",
    navReviews: "Reviews",
    cart: "Cart",
    shopNow: "Shop now",
    heroBadge: "Inspired by Emirati hospitality and heritage souks",
    heroTitleA: "An Emirati Attar Store",
    heroTitleB: "with a global luxury feel",
    heroText:
      "A bilingual storefront for herbs, spices, honey, oils, dates, and oud-inspired gifting. Calm, premium, and made for the UAE market.",
    browseProducts: "Browse products",
    discoverStory: "Discover the story",
    statProducts: "Curated products",
    statLanguages: "Languages",
    statUi: "UI concept",
    categoriesEyebrow: "Shop by category",
    categoriesTitle: "Clear categories for UAE customers",
    categoriesText: "A simple way to browse spices, herbs, honey, oils, dates, and hospitality essentials.",
    productsEyebrow: "Curated products",
    productsTitle: "A simple premium shopping interface",
    visibleProducts: "products visible",
    addToCart: "Add to cart",
    buy: "Buy",
    aed: "AED",
    storyEyebrow: "Emirati character",
    storyTitle: "From old souk warmth to a premium online storefront",
    storyP1:
      "The visual language blends UAE flag colors, warm desert tones, gold accents, and deep green calm. The goal is to make the brand feel authentic, organized, and trustworthy.",
    storyP2:
      "Arabic and English are built into the experience for the UAE’s diverse audience: residents, visitors, and premium heritage gift shoppers.",
    years: "Heritage-inspired identity",
    delivery: "UI concept only",
    rating: "Premium feeling",
    featuresEyebrow: "Why it feels credible",
    featuresTitle: "Small details that lift brand value",
    reviewsEyebrow: "Customer reviews",
    reviewsTitle: "Local tone for client presentations",
    newsletterEyebrow: "Offers and gifting",
    newsletterTitle: "Turn the first order into Emirati hospitality",
    newsletterText: "A UI-only lead form for discounts or heritage gift boxes. No backend is connected yet.",
    emailPlaceholder: "Enter your email",
    newsletterButton: "Get the hospitality offer",
    cartTitle: "Order cart",
    cartNote: "UI only, no real payment",
    emptyCart: "Your cart is empty",
    total: "Total",
    checkout: "Checkout UI",
    favoriteAdded: "Added to favorites",
    favoriteRemoved: "Removed from favorites",
    cartAdded: "Added to cart",
    footerText: "A bilingual Emirati attar storefront UI, ready for future development and backend integration.",
    store: "Store",
    contact: "Contact",
    follow: "Follow us",
    whatsapp: "WA",
  },
} satisfies Record<Lang, Record<string, string>>;

const categories = [
  { id: "all", name: { ar: "الكل", en: "All" }, icon: "✦" },
  { id: "spices", name: { ar: "بهارات وتوابل", en: "Spices" }, icon: "به" },
  { id: "herbs", name: { ar: "أعشاب طبيعية", en: "Herbs" }, icon: "أع" },
  { id: "honey", name: { ar: "عسل إماراتي", en: "Honey" }, icon: "عس" },
  { id: "oils", name: { ar: "زيوت وعود", en: "Oils & Oud" }, icon: "زي" },
  { id: "dates", name: { ar: "تمور وضيافة", en: "Dates & Gifts" }, icon: "تم" },
];

const products: Product[] = [
  {
    id: 1,
    name: { ar: "زعفران فاخر للضيافة", en: "Premium Hospitality Saffron" },
    category: "spices",
    price: 165,
    oldPrice: 210,
    unit: { ar: "10 جرام", en: "10g" },
    image: "products/saffron.svg",
    gradient: "from-[#7b1d18] via-[#c0542d] to-[#f4c05d]",
    tag: { ar: "الأكثر طلباً", en: "Best seller" },
    description: { ar: "خيوط زعفران مختارة للقهوة العربية والحلويات الإماراتية.", en: "Selected saffron strands for Arabic coffee and Emirati desserts." },
  },
  {
    id: 2,
    name: { ar: "هيل أخضر للقهوة العربية", en: "Green Cardamom for Arabic Coffee" },
    category: "spices",
    price: 72,
    unit: { ar: "250 جرام", en: "250g" },
    image: "products/cardamom.svg",
    gradient: "from-[#224f2a] via-[#5f8f3f] to-[#d5d584]",
    tag: { ar: "طازج", en: "Fresh" },
    description: { ar: "هيل عطري كامل، مناسب للقهوة العربية وخلطات الضيافة.", en: "Aromatic whole cardamom for Arabic coffee and hospitality blends." },
  },
  {
    id: 3,
    name: { ar: "كركم عضوي مطحون", en: "Organic Ground Turmeric" },
    category: "spices",
    price: 48,
    unit: { ar: "500 جرام", en: "500g" },
    image: "products/turmeric.svg",
    gradient: "from-[#9d4a0b] via-[#e09b1d] to-[#f6d36d]",
    tag: { ar: "عضوي", en: "Organic" },
    description: { ar: "كركم نقي بلون غني للاستخدام اليومي في المطبخ الخليجي.", en: "Pure turmeric with rich color for everyday Gulf cooking." },
  },
  {
    id: 4,
    name: { ar: "قرفة سيلانية عيدان", en: "Ceylon Cinnamon Sticks" },
    category: "spices",
    price: 58,
    oldPrice: 72,
    unit: { ar: "300 جرام", en: "300g" },
    image: "products/cinnamon.svg",
    gradient: "from-[#5b2c18] via-[#a76634] to-[#ddb47c]",
    tag: { ar: "فاخر", en: "Luxury" },
    description: { ar: "قرفة رقيقة وحلوة للمشروبات والحلويات الشرقية.", en: "Sweet, delicate cinnamon for drinks and oriental desserts." },
  },
  {
    id: 5,
    name: { ar: "زعتر بري مجفف", en: "Wild Dried Thyme" },
    category: "herbs",
    price: 42,
    unit: { ar: "250 جرام", en: "250g" },
    image: "products/thyme.svg",
    gradient: "from-[#1f4b2e] via-[#6f8b4a] to-[#c7c78d]",
    tag: { ar: "بري", en: "Wild" },
    description: { ar: "زعتر مجفف بعناية لنكهة طبيعية في الفطور والمخبوزات.", en: "Carefully dried thyme for natural flavor in breakfast and bakes." },
  },
  {
    id: 6,
    name: { ar: "بابونج ذهبي", en: "Golden Chamomile" },
    category: "herbs",
    price: 36,
    unit: { ar: "150 جرام", en: "150g" },
    image: "products/chamomile.svg",
    gradient: "from-[#7a6b2d] via-[#d0b64d] to-[#fff0ad]",
    tag: { ar: "استرخاء", en: "Calm" },
    description: { ar: "زهور بابونج كاملة لمشروب مسائي خفيف وهادئ.", en: "Whole chamomile flowers for a soft evening drink." },
  },
  {
    id: 7,
    name: { ar: "يانسون نجمي", en: "Star Anise" },
    category: "herbs",
    price: 44,
    unit: { ar: "200 جرام", en: "200g" },
    image: "products/anise.svg",
    gradient: "from-[#4d2d1a] via-[#9b704a] to-[#e3c196]",
    tag: { ar: "مختار", en: "Selected" },
    description: { ar: "يانسون عطري للمشروبات والوصفات الشتوية.", en: "Aromatic star anise for drinks and winter recipes." },
  },
  {
    id: 8,
    name: { ar: "حبة البركة ممتازة", en: "Premium Black Seed" },
    category: "herbs",
    price: 52,
    unit: { ar: "300 جرام", en: "300g" },
    image: "products/black-seed.svg",
    gradient: "from-[#171717] via-[#3a3a31] to-[#8c8265]",
    tag: { ar: "أساسي", en: "Essential" },
    description: { ar: "حبة بركة نظيفة ومنتقاة للاستخدام اليومي.", en: "Clean, selected black seed for everyday use." },
  },
  {
    id: 9,
    name: { ar: "عسل سدر إماراتي", en: "Emirati Sidr Honey" },
    category: "honey",
    price: 245,
    oldPrice: 290,
    unit: { ar: "1 كيلو", en: "1kg" },
    image: "products/sidr-honey.svg",
    gradient: "from-[#7a480b] via-[#d39825] to-[#ffe0a3]",
    tag: { ar: "نخبوي", en: "Elite" },
    description: { ar: "عسل سدر كثيف مناسب للهدايا والضيافة الفاخرة.", en: "Rich sidr honey for gifting and premium hospitality." },
  },
  {
    id: 10,
    name: { ar: "عسل جبلي فاخر", en: "Luxury Mountain Honey" },
    category: "honey",
    price: 285,
    unit: { ar: "1 كيلو", en: "1kg" },
    image: "products/mountain-honey.svg",
    gradient: "from-[#67400f] via-[#b97c24] to-[#f8cc76]",
    tag: { ar: "محدود", en: "Limited" },
    description: { ar: "عسل بري بطعم عميق لمحبي الجودة العالية.", en: "Wild honey with deep flavor for premium taste seekers." },
  },
  {
    id: 11,
    name: { ar: "خلطة العسل الملكية", en: "Royal Honey Blend" },
    category: "honey",
    price: 330,
    unit: { ar: "750 جرام", en: "750g" },
    image: "products/royal-honey.svg",
    gradient: "from-[#2b2111] via-[#b38a2b] to-[#fff0b6]",
    tag: { ar: "Premium", en: "Premium" },
    description: { ar: "مزيج فاخر من العسل ومكونات طبيعية مختارة.", en: "A premium blend of honey and selected natural ingredients." },
  },
  {
    id: 12,
    name: { ar: "زيت زيتون بكر", en: "Virgin Olive Oil" },
    category: "oils",
    price: 88,
    unit: { ar: "1 لتر", en: "1L" },
    image: "products/olive-oil.svg",
    gradient: "from-[#203f21] via-[#718441] to-[#d6ca78]",
    tag: { ar: "حصاد جديد", en: "New harvest" },
    description: { ar: "زيت بكر بنكهة متوازنة للمطبخ اليومي والسلطات.", en: "Balanced virgin olive oil for daily cooking and salads." },
  },
  {
    id: 13,
    name: { ar: "زيت حبة البركة", en: "Black Seed Oil" },
    category: "oils",
    price: 96,
    unit: { ar: "250 مل", en: "250ml" },
    image: "products/black-seed-oil.svg",
    gradient: "from-[#10100e] via-[#474034] to-[#b39a65]",
    tag: { ar: "نقي", en: "Pure" },
    description: { ar: "زيت معصور بعناية للعناية والروتين اليومي.", en: "Carefully pressed oil for care and daily routines." },
  },
  {
    id: 14,
    name: { ar: "زيت لوز حلو", en: "Sweet Almond Oil" },
    category: "oils",
    price: 64,
    unit: { ar: "250 مل", en: "250ml" },
    image: "products/almond-oil.svg",
    gradient: "from-[#6b421f] via-[#c49058] to-[#f4d2a2]",
    tag: { ar: "عناية", en: "Care" },
    description: { ar: "زيت خفيف مناسب للعناية بالبشرة والشعر.", en: "A light oil for skin and hair care routines." },
  },
  {
    id: 15,
    name: { ar: "تمر خلاص فاخر", en: "Premium Khalas Dates" },
    category: "dates",
    price: 115,
    unit: { ar: "1 كيلو", en: "1kg" },
    image: "products/almonds.svg",
    gradient: "from-[#6b3f23] via-[#b8844e] to-[#edc087]",
    tag: { ar: "ضيافة", en: "Hospitality" },
    description: { ar: "تمر فاخر مناسب للقهوة العربية وعلب الهدايا.", en: "Premium dates for Arabic coffee and gift boxes." },
  },
  {
    id: 16,
    name: { ar: "علبة ضيافة إماراتية", en: "Emirati Hospitality Box" },
    category: "dates",
    price: 190,
    unit: { ar: "علبة", en: "Box" },
    image: "products/walnuts.svg",
    gradient: "from-[#4e301d] via-[#a87845] to-[#dfba84]",
    tag: { ar: "هدية", en: "Gift" },
    description: { ar: "مفهوم علبة تجمع التمر، الهيل، الزعفران ولمسة عود.", en: "A gift box concept with dates, cardamom, saffron, and oud notes." },
  },
];

const features = [
  {
    title: { ar: "هوية إماراتية", en: "Emirati Identity" },
    text: { ar: "ألوان وتفاصيل مستوحاة من العلم، الصحراء، الضيافة والقهوة العربية.", en: "Colors and details inspired by the flag, desert, hospitality, and Arabic coffee." },
    icon: "01",
  },
  {
    title: { ar: "لغتان في نفس التجربة", en: "Two Languages" },
    text: { ar: "زر تبديل واضح بين العربية والإنجليزية مع اتجاه مناسب لكل لغة.", en: "A clear switch between Arabic and English with proper direction for each language." },
    icon: "02",
  },
  {
    title: { ar: "واجهة هادئة", en: "Calm Interface" },
    text: { ar: "تصميم بسيط ومريح بدون زحمة، مناسب لمنتجات طبيعية وفاخرة.", en: "A clean, relaxed interface suited for natural premium products." },
    icon: "03",
  },
  {
    title: { ar: "قابل للتطوير", en: "Ready to Scale" },
    text: { ar: "الواجهة UI فقط الآن، ويمكن ربطها لاحقاً بسلة دفع ونظام إدارة منتجات.", en: "UI-only now, ready for cart, payments, and product management later." },
    icon: "04",
  },
];

const testimonials = [
  {
    name: { ar: "سالم المهيري", en: "Salem Al Mehairi" },
    city: { ar: "دبي", en: "Dubai" },
    text: { ar: "الطابع الإماراتي واضح وفخم، واللغة الإنجليزية تخلي المتجر مناسب للسياح والمقيمين.", en: "The Emirati feel is clear and premium, and English makes it suitable for tourists and residents." },
    rating: 5,
  },
  {
    name: { ar: "مريم الكتبي", en: "Maryam Al Ketbi" },
    city: { ar: "أبوظبي", en: "Abu Dhabi" },
    text: { ar: "الواجهة هادئة وتناسب منتجات العسل والزعفران والهدايا التراثية.", en: "The interface feels calm and fits honey, saffron, and heritage gift products." },
    rating: 5,
  },
  {
    name: { ar: "علي البلوشي", en: "Ali Al Balushi" },
    city: { ar: "الشارقة", en: "Sharjah" },
    text: { ar: "التصنيفات واضحة والسلة بسيطة، مناسب جداً كمتجر عطارة إماراتي.", en: "The categories are clear and the cart is simple, ideal for an Emirati attar shop." },
    rating: 5,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const getText = (value: Localized, lang: Lang) => value[lang];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.58 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProductVisual({ product }: { product: Product }) {
  return (
    <div className={`relative h-full overflow-hidden rounded-[28px] bg-gradient-to-br ${product.gradient}`}>
      <img src={product.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.18))]" />
      <motion.div
        className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/18 blur-2xl"
        animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}

function Navbar({ lang, cartCount, onCartOpen, onLanguageChange }: { lang: Lang; cartCount: number; onCartOpen: () => void; onLanguageChange: (lang: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const copy = dictionary[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#fffaf0]/88 py-3 shadow-[0_12px_36px_rgba(6,47,34,0.1)] backdrop-blur-xl" : "bg-transparent py-5"
      }`}
    >
      <div className="uae-ribbon h-1 w-full" />
      <nav className="luxury-container mt-3 flex items-center justify-between gap-5">
        <a href="#hero" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#062f22] text-lg font-black text-[#ead7a4] shadow-xl shadow-green-950/20">
            AE
          </span>
          <span className={`text-lg font-black ${scrolled ? "text-[#062f22]" : "text-white"}`}>{copy.brand}</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {[
            [copy.navCategories, "categories"],
            [copy.navProducts, "products"],
            [copy.navStory, "about"],
            [copy.navReviews, "testimonials"],
          ].map(([label, href]) => (
            <a key={href} href={`#${href}`} className={`nav-link text-sm font-semibold ${scrolled ? "text-[#263324]" : "text-white/86"}`}>
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`rounded-full border p-1 ${scrolled ? "border-[#dec77f] bg-white" : "border-white/20 bg-white/10 backdrop-blur-md"}`}>
            {(["ar", "en"] as Lang[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onLanguageChange(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-black transition ${lang === item ? "bg-[#c8a45d] text-[#111]" : scrolled ? "text-[#062f22]" : "text-white/75"}`}
              >
                {item === "ar" ? "ع" : "EN"}
              </button>
            ))}
          </div>
          <motion.button
            type="button"
            onClick={onCartOpen}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`relative rounded-full border px-5 py-2.5 text-sm font-bold transition ${
              scrolled ? "border-[#dec77f] bg-white text-[#062f22]" : "border-white/24 bg-white/10 text-white backdrop-blur-md"
            }`}
          >
            {copy.cart}
            {cartCount > 0 && <span className="absolute -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#c8102e] text-xs text-white ltr:-right-2 rtl:-left-2">{cartCount}</span>}
          </motion.button>
          <a href="#products" className="hidden rounded-full bg-[#c8a45d] px-5 py-2.5 text-sm font-bold text-[#111] shadow-lg shadow-[#c8a45d]/20 sm:inline-block">
            {copy.shopNow}
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const copy = dictionary[lang];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 70]);

  return (
    <section id="hero" className="hero-pattern relative min-h-screen overflow-hidden pt-36 text-white">
      <motion.div className="absolute inset-0 opacity-80" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 16, repeat: Infinity }} />
      <motion.div style={{ y }} className="absolute -right-20 top-28 h-72 w-72 rounded-full bg-[#c8a45d]/20 blur-3xl" />
      <motion.div style={{ y }} className="absolute bottom-16 left-4 h-96 w-96 rounded-full bg-[#00732f]/16 blur-3xl" />

      <div className="luxury-container relative grid min-h-[calc(100vh-9rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={stagger} initial="hidden" animate="show" className="text-start">
          <motion.span variants={fadeUp} className="mb-6 inline-flex rounded-full border border-[#c8a45d]/35 bg-white/8 px-5 py-2 text-sm font-semibold text-[#ead7a4] backdrop-blur-md">
            {copy.heroBadge}
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl font-black leading-tight md:text-7xl">
            {copy.heroTitleA}
            <span className="gold-text block">{copy.heroTitleB}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-9 text-white/76 md:text-xl">
            {copy.heroText}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} href="#products" className="rounded-full bg-[#c8a45d] px-8 py-4 text-center font-black text-[#111] shadow-2xl shadow-[#c8a45d]/20">
              {copy.browseProducts}
            </motion.a>
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} href="#about" className="rounded-full border border-white/22 bg-white/8 px-8 py-4 text-center font-bold text-white backdrop-blur-md">
              {copy.discoverStory}
            </motion.a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            {[
              ["16+", copy.statProducts],
              ["AR/EN", copy.statLanguages],
              ["100%", copy.statUi],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/8 p-4 text-center backdrop-blur-md">
                <div className="text-2xl font-black text-[#ead7a4]">{value}</div>
                <div className="mt-1 text-xs text-white/60">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="glass-panel relative rounded-[42px] p-4">
          <div className="relative overflow-hidden rounded-[34px] bg-[#fffaf0] p-5 text-[#062f22]">
            <div className="uae-ribbon mb-4 h-2 rounded-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              {products.slice(0, 4).map((product, index) => (
                <motion.div key={product.id} className="rounded-[28px] border border-[#ead7a4]/60 bg-white p-3 shadow-xl shadow-green-950/5" animate={{ y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0] }} transition={{ duration: 4 + index, repeat: Infinity }}>
                  <div className="h-36"><ProductVisual product={product} /></div>
                  <div className="mt-3 text-sm font-black">{getText(product.name, lang)}</div>
                  <div className="mt-1 text-xs text-[#756b5d]">{product.price} {copy.aed}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Categories({ lang, selected, onSelect }: { lang: Lang; selected: string; onSelect: (category: string) => void }) {
  const copy = dictionary[lang];

  return (
    <section id="categories" className="py-20">
      <div className="luxury-container">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="text-start">
            <span className="text-sm font-bold text-[#c8a45d]">{copy.categoriesEyebrow}</span>
            <h2 className="mt-3 text-4xl font-black text-[#062f22] md:text-5xl">{copy.categoriesTitle}</h2>
          </div>
          <p className="max-w-xl text-start leading-8 text-[#756b5d]">{copy.categoriesText}</p>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const active = selected === category.id;
            return (
              <motion.button
                type="button"
                key={category.id}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(category.id)}
                className={`rounded-[28px] border p-5 text-start shadow-lg transition ${
                  active ? "border-[#c8a45d] bg-[#062f22] text-white shadow-green-950/20" : "border-[#ead7a4]/70 bg-[#fffaf0] text-[#062f22] shadow-green-950/5 hover:border-[#c8a45d]"
                }`}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-black ${active ? "bg-[#c8a45d] text-[#111]" : "bg-[#f2e2c3] text-[#755322]"}`}>{category.icon}</span>
                <span className="mt-5 block text-sm font-black">{getText(category.name, lang)}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ lang, product, liked, onLike, onAdd }: { lang: Lang; product: Product; liked: boolean; onLike: () => void; onAdd: () => void }) {
  const copy = dictionary[lang];

  return (
    <motion.article variants={fadeUp} layout whileHover={{ y: -8 }} className="group rounded-[34px] border border-[#ead7a4]/70 bg-[#fffaf0] p-4 shadow-xl shadow-green-950/5">
      <div className="relative h-56 overflow-hidden rounded-[28px]">
        <ProductVisual product={product} />
        <div className="absolute top-4 rounded-full bg-white/82 px-3 py-1 text-xs font-bold text-[#062f22] backdrop-blur-md ltr:left-4 rtl:right-4">{getText(product.tag, lang)}</div>
        <motion.button
          type="button"
          onClick={onLike}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`absolute top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md ltr:right-4 rtl:left-4 ${liked ? "bg-[#c8102e] text-white" : "bg-white/80 text-[#062f22]"}`}
          aria-label="Favorite"
        >
          ♥
        </motion.button>
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button type="button" onClick={onAdd} className="w-full rounded-full bg-[#062f22] px-5 py-3 text-sm font-black text-white shadow-xl">
            {copy.addToCart}
          </button>
        </div>
      </div>
      <div className="p-3 text-start">
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-[#062f22]">{getText(product.name, lang)}</h3>
          <span className="rounded-full bg-[#f1e1c0] px-3 py-1 text-xs font-bold text-[#755322]">{getText(product.unit, lang)}</span>
        </div>
        <p className="mt-3 min-h-[3.5rem] text-sm leading-7 text-[#756b5d]">{getText(product.description, lang)}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-[#c8a45d]">{product.price}</span>
            <span className="mx-1 text-sm text-[#756b5d]">{copy.aed}</span>
            {product.oldPrice && <div className="text-xs text-[#9a8c78] line-through">{product.oldPrice} {copy.aed}</div>}
          </div>
          <button type="button" onClick={onAdd} className="rounded-full border border-[#c8a45d]/40 px-4 py-2 text-sm font-black text-[#062f22] transition hover:bg-[#062f22] hover:text-white">
            {copy.buy}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductsSection({ lang, selected, favorites, onToggleFavorite, onAddToCart }: { lang: Lang; selected: string; favorites: number[]; onToggleFavorite: (id: number) => void; onAddToCart: (product: Product) => void }) {
  const copy = dictionary[lang];
  const visibleProducts = selected === "all" ? products : products.filter((product) => product.category === selected);

  return (
    <section id="products" className="bg-white/54 py-20">
      <div className="luxury-container">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="text-start">
            <span className="text-sm font-bold text-[#c8a45d]">{copy.productsEyebrow}</span>
            <h2 className="mt-3 text-4xl font-black text-[#062f22] md:text-5xl">{copy.productsTitle}</h2>
          </div>
          <div className="rounded-full border border-[#ead7a4] bg-[#fffaf0] px-5 py-3 text-sm font-bold text-[#756b5d]">
            {visibleProducts.length} {copy.visibleProducts}
          </div>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} lang={lang} product={product} liked={favorites.includes(product.id)} onLike={() => onToggleFavorite(product.id)} onAdd={() => onAddToCart(product)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function About({ lang }: { lang: Lang }) {
  const copy = dictionary[lang];

  return (
    <section id="about" className="paper-texture relative overflow-hidden bg-[#062f22] py-24 text-white">
      <div className="luxury-container relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(8, 12).map((product, index) => (
              <motion.div key={product.id} className={`h-48 rounded-[32px] p-3 ${index % 2 ? "mt-10" : ""}`} whileHover={{ scale: 1.03, rotate: index % 2 ? -1 : 1 }}>
                <ProductVisual product={product} />
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div className="text-start">
            <span className="text-sm font-bold text-[#ead7a4]">{copy.storyEyebrow}</span>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{copy.storyTitle}</h2>
            <div className="mt-6 space-y-5 text-lg leading-9 text-white/74">
              <p>{copy.storyP1}</p>
              <p>{copy.storyP2}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["AE", copy.years],
              ["UI", copy.delivery],
              ["4.9", copy.rating],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <div className="text-2xl font-black text-[#ead7a4]">{value}</div>
                <div className="mt-1 text-xs text-white/58">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Features({ lang }: { lang: Lang }) {
  const copy = dictionary[lang];

  return (
    <section className="py-20">
      <div className="luxury-container">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-sm font-bold text-[#c8a45d]">{copy.featuresEyebrow}</span>
          <h2 className="mt-3 text-4xl font-black text-[#062f22] md:text-5xl">{copy.featuresTitle}</h2>
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.div key={getText(feature.title, lang)} variants={fadeUp} whileHover={{ y: -6 }} className="rounded-[34px] border border-[#ead7a4]/70 bg-[#fffaf0] p-7 text-start shadow-xl shadow-green-950/5">
              <div className="text-4xl font-black text-[#c8102e]/28">{feature.icon}</div>
              <h3 className="mt-8 text-xl font-black text-[#062f22]">{getText(feature.title, lang)}</h3>
              <p className="mt-3 leading-7 text-[#756b5d]">{getText(feature.text, lang)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials({ lang }: { lang: Lang }) {
  const copy = dictionary[lang];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 4200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="bg-[#fffaf0] py-20">
      <div className="luxury-container">
        <Reveal className="mb-12 text-center">
          <span className="text-sm font-bold text-[#c8a45d]">{copy.reviewsEyebrow}</span>
          <h2 className="mt-3 text-4xl font-black text-[#062f22] md:text-5xl">{copy.reviewsTitle}</h2>
        </Reveal>
        <div className="mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -18 }} transition={{ duration: 0.45 }} className="rounded-[40px] border border-[#ead7a4] bg-white p-8 text-center shadow-2xl shadow-green-950/7">
              <div className="mb-5 text-[#c8a45d]">{"★".repeat(testimonials[active].rating)}</div>
              <p className="text-xl leading-10 text-[#263324]">“{getText(testimonials[active].text, lang)}”</p>
              <div className="mt-7 font-black text-[#062f22]">{getText(testimonials[active].name, lang)}</div>
              <div className="mt-1 text-sm text-[#756b5d]">{getText(testimonials[active].city, lang)}</div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((item, index) => (
              <button key={getText(item.name, lang)} type="button" onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${active === index ? "w-9 bg-[#c8a45d]" : "w-2.5 bg-[#d8c8aa]"}`} aria-label={getText(item.name, lang)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter({ lang }: { lang: Lang }) {
  const copy = dictionary[lang];

  return (
    <section className="py-20">
      <div className="luxury-container">
        <Reveal className="relative overflow-hidden rounded-[44px] bg-[#062f22] p-8 text-white shadow-2xl shadow-green-950/16 md:p-12">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#c8a45d]/18 blur-3xl" />
          <div className="absolute right-0 top-0 h-full w-4 bg-[#c8102e]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="text-start">
              <span className="text-sm font-bold text-[#ead7a4]">{copy.newsletterEyebrow}</span>
              <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{copy.newsletterTitle}</h2>
              <p className="mt-5 max-w-2xl leading-8 text-white/70">{copy.newsletterText}</p>
            </div>
            <form className="rounded-[32px] border border-white/10 bg-white/8 p-3 backdrop-blur-md" onSubmit={(event) => event.preventDefault()}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input className="min-h-14 flex-1 rounded-full border border-white/10 bg-white px-5 text-start text-[#062f22] outline-none" placeholder={copy.emailPlaceholder} type="email" />
                <button className="rounded-full bg-[#c8a45d] px-7 py-4 font-black text-[#111]" type="submit">
                  {copy.newsletterButton}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CartSidebar({ lang, open, items, onClose, onIncrease, onDecrease }: { lang: Lang; open: boolean; items: CartItem[]; onClose: () => void; onIncrease: (id: number) => void; onDecrease: (id: number) => void }) {
  const copy = dictionary[lang];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="fixed top-0 z-[90] flex h-full w-full max-w-md flex-col bg-[#fffaf0] shadow-2xl ltr:right-0 rtl:left-0"
            initial={{ x: lang === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: lang === "ar" ? "-100%" : "100%" }}
            transition={{ duration: 0.42 }}
          >
            <div className="flex items-center justify-between border-b border-[#ead7a4]/70 p-6">
              <div className="text-start">
                <h3 className="text-2xl font-black text-[#062f22]">{copy.cartTitle}</h3>
                <p className="mt-1 text-sm text-[#756b5d]">{copy.cartNote}</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-[#f0dfbe] font-black text-[#062f22]">
                ×
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center text-[#756b5d]">{copy.emptyCart}</div>
              ) : (
                items.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4 rounded-[28px] border border-[#ead7a4]/70 bg-white p-3">
                    <div className="h-24 w-24 shrink-0"><ProductVisual product={item} /></div>
                    <div className="min-w-0 flex-1 text-start">
                      <h4 className="font-black text-[#062f22]">{getText(item.name, lang)}</h4>
                      <p className="mt-1 text-sm text-[#756b5d]">{item.price} {copy.aed}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" onClick={() => onDecrease(item.id)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f0dfbe] font-black">-</button>
                        <span className="min-w-6 text-center font-black">{item.quantity}</span>
                        <button type="button" onClick={() => onIncrease(item.id)} className="grid h-8 w-8 place-items-center rounded-full bg-[#062f22] font-black text-white">+</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="border-t border-[#ead7a4]/70 p-6">
              <div className="mb-4 flex items-center justify-between text-lg font-black text-[#062f22]">
                <span>{copy.total}</span>
                <span>{total} {copy.aed}</span>
              </div>
              <button type="button" className="w-full rounded-full bg-[#062f22] px-6 py-4 font-black text-white">
                {copy.checkout}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const copy = dictionary[lang];

  return (
    <footer className="bg-[#050505] py-14 text-white">
      <div className="uae-ribbon mb-12 h-2 w-full" />
      <div className="luxury-container grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="text-start">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c8a45d] font-black text-[#111]">AE</span>
            <span className="text-xl font-black">{copy.brand}</span>
          </div>
          <p className="mt-5 max-w-sm leading-8 text-white/62">{copy.footerText}</p>
        </div>
        <div className="text-start">
          <h4 className="font-black text-[#ead7a4]">{copy.store}</h4>
          <div className="mt-4 space-y-3 text-white/62">
            <a href="#products" className="block hover:text-white">{copy.navProducts}</a>
            <a href="#categories" className="block hover:text-white">{copy.navCategories}</a>
            <a href="#about" className="block hover:text-white">{copy.navStory}</a>
          </div>
        </div>
        <div className="text-start">
          <h4 className="font-black text-[#ead7a4]">{copy.contact}</h4>
          <div className="mt-4 space-y-3 text-white/62">
            <p>+971 55 123 4567</p>
            <p>hello@emirates-attar.ae</p>
            <p>{lang === "ar" ? "دبي، الإمارات" : "Dubai, UAE"}</p>
          </div>
        </div>
        <div className="text-start">
          <h4 className="font-black text-[#ead7a4]">{copy.follow}</h4>
          <div className="mt-4 flex gap-3">
            {["in", "ig", "x"].map((item) => (
              <a key={item} href="#" className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/5 text-sm font-black transition hover:bg-[#c8a45d] hover:text-[#111]">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingActions({ lang }: { lang: Lang }) {
  const copy = dictionary[lang];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      <motion.a href="#" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-xs font-black text-white shadow-2xl shadow-green-950/20">
        {copy.whatsapp}
      </motion.a>
      <motion.a href="#hero" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="grid h-12 w-12 place-items-center rounded-full border border-[#ead7a4] bg-[#fffaf0] font-black text-[#062f22] shadow-xl">
        ↑
      </motion.a>
    </div>
  );
}

function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-[100] hidden h-24 w-24 rounded-full bg-[#c8a45d]/14 blur-2xl lg:block"
      animate={{ x: position.x - 48, y: position.y - 48 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    />
  );
}

function Toast({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} className="fixed bottom-8 right-1/2 z-[120] translate-x-1/2 rounded-full bg-[#062f22] px-6 py-3 text-sm font-black text-white shadow-2xl">
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState("");
  const copy = dictionary[lang];
  const direction = lang === "ar" ? "rtl" : "ltr";
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
  }, [direction, lang]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1900);
  };

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
    showToast(copy.cartAdded);
  };

  const toggleFavorite = (id: number) => {
    const liked = favorites.includes(id);
    setFavorites((current) => (liked ? current.filter((item) => item !== id) : [...current, id]));
    showToast(liked ? copy.favoriteRemoved : copy.favoriteAdded);
  };

  const increaseItem = (id: number) => {
    setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseItem = (id: number) => {
    setCartItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  return (
    <div lang={lang} dir={direction}>
      <Navbar lang={lang} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onLanguageChange={setLang} />
      <main>
        <Hero lang={lang} />
        <Categories lang={lang} selected={selectedCategory} onSelect={setSelectedCategory} />
        <ProductsSection lang={lang} selected={selectedCategory} favorites={favorites} onToggleFavorite={toggleFavorite} onAddToCart={addToCart} />
        <About lang={lang} />
        <Features lang={lang} />
        <Testimonials lang={lang} />
        <Newsletter lang={lang} />
      </main>
      <Footer lang={lang} />
      <CartSidebar lang={lang} open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onIncrease={increaseItem} onDecrease={decreaseItem} />
      <FloatingActions lang={lang} />
      <CursorGlow />
      <Toast message={toast} />
    </div>
  );
}
