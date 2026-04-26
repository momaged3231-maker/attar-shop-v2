"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";

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
  tag: Localized;
  description: Localized;
};

type CartItem = Product & { quantity: number };

const copy = {
  ar: {
    brand: "عطارة الإمارات",
    backHome: "العودة للرئيسية",
    cart: "السلة",
    title: "كتالوج المنتجات",
    subtitle: "كل منتجات العطارة الإماراتية في صفحة مستقلة للشراء والتصفية بسهولة.",
    search: "ابحث عن منتج...",
    all: "الكل",
    visible: "منتج ظاهر",
    add: "أضف للسلة",
    buy: "شراء",
    aed: "درهم",
    favorites: "المفضلة",
    cartTitle: "سلة الطلب",
    emptyCart: "السلة فارغة حالياً",
    total: "الإجمالي",
    checkout: "إتمام الطلب UI",
    added: "تمت الإضافة للسلة",
    liked: "تم تحديث المفضلة",
    noResults: "لا توجد منتجات مطابقة للبحث.",
  },
  en: {
    brand: "Emirates Attar",
    backHome: "Back home",
    cart: "Cart",
    title: "Products Catalog",
    subtitle: "All Emirati attar products in a dedicated page with clean filtering and shopping UI.",
    search: "Search products...",
    all: "All",
    visible: "products visible",
    add: "Add to cart",
    buy: "Buy",
    aed: "AED",
    favorites: "Favorites",
    cartTitle: "Order cart",
    emptyCart: "Your cart is empty",
    total: "Total",
    checkout: "Checkout UI",
    added: "Added to cart",
    liked: "Favorites updated",
    noResults: "No products match your search.",
  },
} satisfies Record<Lang, Record<string, string>>;

const categories = [
  { id: "all", name: { ar: "الكل", en: "All" } },
  { id: "spices", name: { ar: "بهارات وتوابل", en: "Spices" } },
  { id: "herbs", name: { ar: "أعشاب طبيعية", en: "Herbs" } },
  { id: "honey", name: { ar: "عسل إماراتي", en: "Honey" } },
  { id: "oils", name: { ar: "زيوت وعود", en: "Oils & Oud" } },
  { id: "dates", name: { ar: "تمور وضيافة", en: "Dates & Gifts" } },
];

const products: Product[] = [
  {
    id: 1,
    name: { ar: "زعفران فاخر للضيافة", en: "Premium Hospitality Saffron" },
    category: "spices",
    price: 165,
    oldPrice: 210,
    unit: { ar: "10 جرام", en: "10g" },
    image: "../products/saffron.svg",
    tag: { ar: "الأكثر طلباً", en: "Best seller" },
    description: { ar: "خيوط زعفران مختارة للقهوة العربية والحلويات الإماراتية.", en: "Selected saffron strands for Arabic coffee and Emirati desserts." },
  },
  {
    id: 2,
    name: { ar: "هيل أخضر للقهوة العربية", en: "Green Cardamom for Arabic Coffee" },
    category: "spices",
    price: 72,
    unit: { ar: "250 جرام", en: "250g" },
    image: "../products/cardamom.svg",
    tag: { ar: "طازج", en: "Fresh" },
    description: { ar: "هيل عطري كامل مناسب للقهوة العربية وخلطات الضيافة.", en: "Aromatic whole cardamom for Arabic coffee and hospitality blends." },
  },
  {
    id: 3,
    name: { ar: "كركم عضوي مطحون", en: "Organic Ground Turmeric" },
    category: "spices",
    price: 48,
    unit: { ar: "500 جرام", en: "500g" },
    image: "../products/turmeric.svg",
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
    image: "../products/cinnamon.svg",
    tag: { ar: "فاخر", en: "Luxury" },
    description: { ar: "قرفة رقيقة وحلوة للمشروبات والحلويات الشرقية.", en: "Sweet, delicate cinnamon for drinks and oriental desserts." },
  },
  {
    id: 5,
    name: { ar: "زعتر بري مجفف", en: "Wild Dried Thyme" },
    category: "herbs",
    price: 42,
    unit: { ar: "250 جرام", en: "250g" },
    image: "../products/thyme.svg",
    tag: { ar: "بري", en: "Wild" },
    description: { ar: "زعتر مجفف بعناية لنكهة طبيعية في الفطور والمخبوزات.", en: "Carefully dried thyme for breakfast and bakes." },
  },
  {
    id: 6,
    name: { ar: "بابونج ذهبي", en: "Golden Chamomile" },
    category: "herbs",
    price: 36,
    unit: { ar: "150 جرام", en: "150g" },
    image: "../products/chamomile.svg",
    tag: { ar: "استرخاء", en: "Calm" },
    description: { ar: "زهور بابونج كاملة لمشروب مسائي خفيف وهادئ.", en: "Whole chamomile flowers for a soft evening drink." },
  },
  {
    id: 7,
    name: { ar: "يانسون نجمي", en: "Star Anise" },
    category: "herbs",
    price: 44,
    unit: { ar: "200 جرام", en: "200g" },
    image: "../products/anise.svg",
    tag: { ar: "مختار", en: "Selected" },
    description: { ar: "يانسون عطري للمشروبات والوصفات الشتوية.", en: "Aromatic star anise for drinks and winter recipes." },
  },
  {
    id: 8,
    name: { ar: "حبة البركة ممتازة", en: "Premium Black Seed" },
    category: "herbs",
    price: 52,
    unit: { ar: "300 جرام", en: "300g" },
    image: "../products/black-seed.svg",
    tag: { ar: "أساسي", en: "Essential" },
    description: { ar: "حبة بركة نظيفة ومنتقاة للاستخدام اليومي.", en: "Clean selected black seed for everyday use." },
  },
  {
    id: 9,
    name: { ar: "عسل سدر إماراتي", en: "Emirati Sidr Honey" },
    category: "honey",
    price: 245,
    oldPrice: 290,
    unit: { ar: "1 كيلو", en: "1kg" },
    image: "../products/sidr-honey.svg",
    tag: { ar: "نخبوي", en: "Elite" },
    description: { ar: "عسل سدر كثيف مناسب للهدايا والضيافة الفاخرة.", en: "Rich sidr honey for gifts and premium hospitality." },
  },
  {
    id: 10,
    name: { ar: "عسل جبلي فاخر", en: "Luxury Mountain Honey" },
    category: "honey",
    price: 285,
    unit: { ar: "1 كيلو", en: "1kg" },
    image: "../products/mountain-honey.svg",
    tag: { ar: "محدود", en: "Limited" },
    description: { ar: "عسل بري بطعم عميق لمحبي الجودة العالية.", en: "Wild honey with deep flavor for premium taste seekers." },
  },
  {
    id: 11,
    name: { ar: "خلطة العسل الملكية", en: "Royal Honey Blend" },
    category: "honey",
    price: 330,
    unit: { ar: "750 جرام", en: "750g" },
    image: "../products/royal-honey.svg",
    tag: { ar: "Premium", en: "Premium" },
    description: { ar: "مزيج فاخر من العسل ومكونات طبيعية مختارة.", en: "A premium blend of honey and natural ingredients." },
  },
  {
    id: 12,
    name: { ar: "زيت زيتون بكر", en: "Virgin Olive Oil" },
    category: "oils",
    price: 88,
    unit: { ar: "1 لتر", en: "1L" },
    image: "../products/olive-oil.svg",
    tag: { ar: "حصاد جديد", en: "New harvest" },
    description: { ar: "زيت بكر بنكهة متوازنة للمطبخ اليومي والسلطات.", en: "Balanced virgin olive oil for daily cooking and salads." },
  },
  {
    id: 13,
    name: { ar: "زيت حبة البركة", en: "Black Seed Oil" },
    category: "oils",
    price: 96,
    unit: { ar: "250 مل", en: "250ml" },
    image: "../products/black-seed-oil.svg",
    tag: { ar: "نقي", en: "Pure" },
    description: { ar: "زيت معصور بعناية للعناية والروتين اليومي.", en: "Carefully pressed oil for care and daily routines." },
  },
  {
    id: 14,
    name: { ar: "زيت لوز حلو", en: "Sweet Almond Oil" },
    category: "oils",
    price: 64,
    unit: { ar: "250 مل", en: "250ml" },
    image: "../products/almond-oil.svg",
    tag: { ar: "عناية", en: "Care" },
    description: { ar: "زيت خفيف مناسب للعناية بالبشرة والشعر.", en: "A light oil for skin and hair care routines." },
  },
  {
    id: 15,
    name: { ar: "تمر خلاص فاخر", en: "Premium Khalas Dates" },
    category: "dates",
    price: 115,
    unit: { ar: "1 كيلو", en: "1kg" },
    image: "../products/almonds.svg",
    tag: { ar: "ضيافة", en: "Hospitality" },
    description: { ar: "تمر فاخر مناسب للقهوة العربية وعلب الهدايا.", en: "Premium dates for Arabic coffee and gift boxes." },
  },
  {
    id: 16,
    name: { ar: "علبة ضيافة إماراتية", en: "Emirati Hospitality Box" },
    category: "dates",
    price: 190,
    unit: { ar: "علبة", en: "Box" },
    image: "../products/walnuts.svg",
    tag: { ar: "هدية", en: "Gift" },
    description: { ar: "مفهوم علبة تجمع التمر، الهيل، الزعفران ولمسة عود.", en: "A gift box concept with dates, cardamom, saffron, and oud notes." },
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

function text(value: Localized, lang: Lang) {
  return value[lang];
}

function ProductImage({ product }: { product: Product }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[28px] bg-[#062f22]">
      <img src={product.image} alt={text(product.name, "en")} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.02),rgba(0,0,0,0.14))]" />
    </div>
  );
}

function Header({ lang, setLang, cartCount, openCart }: { lang: Lang; setLang: (lang: Lang) => void; cartCount: number; openCart: () => void }) {
  const c = copy[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-[#ead7a4]/70 bg-[#fffaf0]/90 backdrop-blur-xl">
      <div className="uae-ribbon h-1 w-full" />
      <nav className="luxury-container flex items-center justify-between gap-4 py-4">
        <a href="../" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#062f22] text-sm font-black text-[#ead7a4]">AE</span>
          <span className="font-black text-[#062f22]">{c.brand}</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="../" className="hidden rounded-full border border-[#ead7a4] px-4 py-2 text-sm font-black text-[#062f22] sm:inline-block">
            {c.backHome}
          </a>
          <div className="rounded-full border border-[#ead7a4] bg-white p-1">
            {(["ar", "en"] as Lang[]).map((item) => (
              <button key={item} type="button" onClick={() => setLang(item)} className={`rounded-full px-3 py-1.5 text-xs font-black ${lang === item ? "bg-[#c8a45d] text-[#111]" : "text-[#062f22]"}`}>
                {item === "ar" ? "ع" : "EN"}
              </button>
            ))}
          </div>
          <button type="button" onClick={openCart} className="relative rounded-full bg-[#062f22] px-5 py-2.5 text-sm font-black text-white">
            {c.cart}
            {cartCount > 0 && <span className="absolute -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#c8102e] text-xs ltr:-right-2 rtl:-left-2">{cartCount}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}

function ProductCard({ product, lang, liked, addToCart, toggleLike }: { product: Product; lang: Lang; liked: boolean; addToCart: () => void; toggleLike: () => void }) {
  const c = copy[lang];

  return (
    <motion.article layout variants={fadeUp} whileHover={{ y: -8 }} className="group rounded-[34px] border border-[#ead7a4]/70 bg-[#fffaf0] p-4 shadow-xl shadow-green-950/5">
      <div className="relative h-60 overflow-hidden rounded-[28px]">
        <ProductImage product={product} />
        <span className="absolute top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-[#062f22] backdrop-blur-md ltr:left-4 rtl:right-4">{text(product.tag, lang)}</span>
        <button type="button" onClick={toggleLike} className={`absolute top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md ltr:right-4 rtl:left-4 ${liked ? "bg-[#c8102e] text-white" : "bg-white/85 text-[#062f22]"}`}>
          ♥
        </button>
      </div>
      <div className="p-3 text-start">
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-[#062f22]">{text(product.name, lang)}</h3>
          <span className="rounded-full bg-[#f1e1c0] px-3 py-1 text-xs font-bold text-[#755322]">{text(product.unit, lang)}</span>
        </div>
        <p className="mt-3 min-h-[3.5rem] text-sm leading-7 text-[#756b5d]">{text(product.description, lang)}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-[#c8a45d]">{product.price}</span>
            <span className="mx-1 text-sm text-[#756b5d]">{c.aed}</span>
            {product.oldPrice && <div className="text-xs text-[#9a8c78] line-through">{product.oldPrice} {c.aed}</div>}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={addToCart} className="rounded-full bg-[#062f22] px-4 py-2 text-sm font-black text-white">
              {c.add}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CartSidebar({ lang, open, items, close, increase, decrease }: { lang: Lang; open: boolean; items: CartItem[]; close: () => void; increase: (id: number) => void; decrease: (id: number) => void }) {
  const c = copy[lang];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="fixed top-0 z-[90] flex h-full w-full max-w-md flex-col bg-[#fffaf0] shadow-2xl ltr:right-0 rtl:left-0"
            initial={{ x: lang === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: lang === "ar" ? "-100%" : "100%" }}
            transition={{ duration: 0.42 }}
          >
            <div className="flex items-center justify-between border-b border-[#ead7a4]/70 p-6">
              <h3 className="text-2xl font-black text-[#062f22]">{c.cartTitle}</h3>
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-[#f0dfbe] font-black text-[#062f22]">×</button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center text-[#756b5d]">{c.emptyCart}</div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-[28px] border border-[#ead7a4]/70 bg-white p-3">
                    <div className="h-24 w-24 shrink-0"><ProductImage product={item} /></div>
                    <div className="min-w-0 flex-1 text-start">
                      <h4 className="font-black text-[#062f22]">{text(item.name, lang)}</h4>
                      <p className="mt-1 text-sm text-[#756b5d]">{item.price} {c.aed}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" onClick={() => decrease(item.id)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f0dfbe] font-black">-</button>
                        <span className="min-w-6 text-center font-black">{item.quantity}</span>
                        <button type="button" onClick={() => increase(item.id)} className="grid h-8 w-8 place-items-center rounded-full bg-[#062f22] font-black text-white">+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-[#ead7a4]/70 p-6">
              <div className="mb-4 flex items-center justify-between text-lg font-black text-[#062f22]">
                <span>{c.total}</span>
                <span>{total} {c.aed}</span>
              </div>
              <button type="button" className="w-full rounded-full bg-[#062f22] px-6 py-4 font-black text-white">{c.checkout}</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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

export default function ProductsPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState("");
  const c = copy[lang];
  const direction = lang === "ar" ? "rtl" : "ltr";
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
  }, [direction, lang]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selected === "all" || product.category === selected;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || text(product.name, lang).toLowerCase().includes(query) || text(product.description, lang).toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...current, { ...product, quantity: 1 }];
    });
    showToast(c.added);
  };

  const increase = (id: number) => setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  const decrease = (id: number) => setCartItems((current) => current.flatMap((item) => (item.id !== id ? [item] : item.quantity <= 1 ? [] : [{ ...item, quantity: item.quantity - 1 }])));

  const toggleLike = (id: number) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    showToast(c.liked);
  };

  return (
    <div dir={direction} lang={lang}>
      <Header lang={lang} setLang={setLang} cartCount={cartCount} openCart={() => setCartOpen(true)} />
      <main>
        <section className="hero-pattern relative overflow-hidden pb-20 pt-20 text-white">
          <div className="luxury-container">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl text-start">
              <span className="inline-flex rounded-full border border-[#c8a45d]/35 bg-white/8 px-5 py-2 text-sm font-semibold text-[#ead7a4] backdrop-blur-md">{c.brand}</span>
              <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">{c.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-white/74">{c.subtitle}</p>
            </motion.div>
          </div>
        </section>

        <section className="py-10">
          <div className="luxury-container">
            <div className="rounded-[34px] border border-[#ead7a4]/70 bg-[#fffaf0] p-4 shadow-xl shadow-green-950/5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={c.search} className="min-h-14 rounded-full border border-[#ead7a4] bg-white px-5 text-start text-[#062f22] outline-none" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button key={category.id} type="button" onClick={() => setSelected(category.id)} className={`rounded-full px-4 py-2 text-sm font-black transition ${selected === category.id ? "bg-[#062f22] text-white" : "bg-white text-[#062f22] hover:bg-[#f1e1c0]"}`}>
                      {text(category.name, lang)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-[#756b5d]">
                <span>{filteredProducts.length} {c.visible}</span>
                <span>{favorites.length} {c.favorites}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="luxury-container">
            {filteredProducts.length === 0 ? (
              <div className="rounded-[34px] border border-[#ead7a4]/70 bg-[#fffaf0] p-12 text-center text-[#756b5d]">{c.noResults}</div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} lang={lang} liked={favorites.includes(product.id)} addToCart={() => addToCart(product)} toggleLike={() => toggleLike(product.id)} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <CartSidebar lang={lang} open={cartOpen} items={cartItems} close={() => setCartOpen(false)} increase={increase} decrease={decrease} />
      <Toast message={toast} />
    </div>
  );
}
