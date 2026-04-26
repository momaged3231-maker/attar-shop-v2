"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  unit: string;
  icon: string;
  image: string;
  gradient: string;
  tag: string;
  description: string;
};

type CartItem = Product & { quantity: number };

const categories = [
  { id: "all", name: "الكل", icon: "✦" },
  { id: "spices", name: "بهارات وتوابل", icon: "به" },
  { id: "herbs", name: "أعشاب طبية", icon: "أع" },
  { id: "honey", name: "عسل طبيعي", icon: "عس" },
  { id: "oils", name: "زيوت عطرية", icon: "زي" },
  { id: "nuts", name: "حبوب ومكسرات", icon: "حب" },
];

const products: Product[] = [
  {
    id: 1,
    name: "زعفران فارسي فاخر",
    category: "spices",
    price: 450,
    oldPrice: 520,
    unit: "10 جرام",
    icon: "زع",
    image: "products/saffron.svg",
    gradient: "from-[#7b1d18] via-[#c0542d] to-[#f4c05d]",
    tag: "الأكثر طلباً",
    description: "خيوط زعفران منتقاة بدرجة لون ورائحة ممتازة.",
  },
  {
    id: 2,
    name: "هيل هندي أخضر",
    category: "spices",
    price: 85,
    unit: "250 جرام",
    icon: "هي",
    image: "products/cardamom.svg",
    gradient: "from-[#224f2a] via-[#5f8f3f] to-[#d5d584]",
    tag: "طازج",
    description: "حبوب هيل كاملة برائحة مركزة للقهوة والحلويات.",
  },
  {
    id: 3,
    name: "كركم عضوي مطحون",
    category: "spices",
    price: 65,
    unit: "500 جرام",
    icon: "كر",
    image: "products/turmeric.svg",
    gradient: "from-[#9d4a0b] via-[#e09b1d] to-[#f6d36d]",
    tag: "عضوي",
    description: "كركم نقي بلون غني، مناسب للمطبخ والوصفات اليومية.",
  },
  {
    id: 4,
    name: "قرفة سيلانية عيدان",
    category: "spices",
    price: 75,
    oldPrice: 95,
    unit: "300 جرام",
    icon: "قف",
    image: "products/cinnamon.svg",
    gradient: "from-[#5b2c18] via-[#a76634] to-[#ddb47c]",
    tag: "فاخر",
    description: "قرفة سيلانية خفيفة وحلوة بعيدان رقيقة عالية الجودة.",
  },
  {
    id: 5,
    name: "زعتر بري مجفف",
    category: "herbs",
    price: 55,
    unit: "250 جرام",
    icon: "زع",
    image: "products/thyme.svg",
    gradient: "from-[#1f4b2e] via-[#6f8b4a] to-[#c7c78d]",
    tag: "بري",
    description: "زعتر طبيعي مجفف بعناية ليحافظ على رائحته ونكهته.",
  },
  {
    id: 6,
    name: "بابونج ذهبي",
    category: "herbs",
    price: 40,
    unit: "150 جرام",
    icon: "با",
    image: "products/chamomile.svg",
    gradient: "from-[#7a6b2d] via-[#d0b64d] to-[#fff0ad]",
    tag: "استرخاء",
    description: "زهور بابونج كاملة لمشروب مسائي هادئ وخفيف.",
  },
  {
    id: 7,
    name: "يانسون نجمي",
    category: "herbs",
    price: 50,
    unit: "200 جرام",
    icon: "يا",
    image: "products/anise.svg",
    gradient: "from-[#4d2d1a] via-[#9b704a] to-[#e3c196]",
    tag: "مختار",
    description: "يانسون نجمي عطري، مناسب للمشروبات والوصفات الشرقية.",
  },
  {
    id: 8,
    name: "حبة البركة ممتازة",
    category: "herbs",
    price: 60,
    unit: "300 جرام",
    icon: "حب",
    image: "products/black-seed.svg",
    gradient: "from-[#171717] via-[#3a3a31] to-[#8c8265]",
    tag: "أساسي",
    description: "حبة بركة نظيفة ومنتقاة للاستخدام اليومي.",
  },
  {
    id: 9,
    name: "عسل سدر جبلي",
    category: "honey",
    price: 280,
    oldPrice: 340,
    unit: "1 كيلو",
    icon: "سد",
    image: "products/sidr-honey.svg",
    gradient: "from-[#7a480b] via-[#d39825] to-[#ffe0a3]",
    tag: "نخبوي",
    description: "عسل سدر كثيف من مصادر جبلية موثوقة.",
  },
  {
    id: 10,
    name: "عسل جبلي بري",
    category: "honey",
    price: 320,
    unit: "1 كيلو",
    icon: "جب",
    image: "products/mountain-honey.svg",
    gradient: "from-[#67400f] via-[#b97c24] to-[#f8cc76]",
    tag: "محدود",
    description: "عسل بري بطعم عميق وقوام غني لمحبي الجودة العالية.",
  },
  {
    id: 11,
    name: "خلطة العسل الملكية",
    category: "honey",
    price: 390,
    unit: "750 جرام",
    icon: "مل",
    image: "products/royal-honey.svg",
    gradient: "from-[#2b2111] via-[#b38a2b] to-[#fff0b6]",
    tag: "Premium",
    description: "مزيج فاخر من العسل مع إضافات طبيعية مختارة.",
  },
  {
    id: 12,
    name: "زيت زيتون بكر",
    category: "oils",
    price: 95,
    unit: "1 لتر",
    icon: "زي",
    image: "products/olive-oil.svg",
    gradient: "from-[#203f21] via-[#718441] to-[#d6ca78]",
    tag: "حصاد جديد",
    description: "زيت زيتون بكر أول بعصر بارد ونكهة متوازنة.",
  },
  {
    id: 13,
    name: "زيت حبة البركة",
    category: "oils",
    price: 110,
    unit: "250 مل",
    icon: "زح",
    image: "products/black-seed-oil.svg",
    gradient: "from-[#10100e] via-[#474034] to-[#b39a65]",
    tag: "نقي",
    description: "زيت معصور بعناية للاستخدام الخارجي والروتين اليومي.",
  },
  {
    id: 14,
    name: "زيت لوز حلو",
    category: "oils",
    price: 70,
    unit: "250 مل",
    icon: "لو",
    image: "products/almond-oil.svg",
    gradient: "from-[#6b421f] via-[#c49058] to-[#f4d2a2]",
    tag: "عناية",
    description: "زيت لوز حلو خفيف مناسب للعناية بالبشرة والشعر.",
  },
  {
    id: 15,
    name: "لوز محمص فاخر",
    category: "nuts",
    price: 120,
    unit: "500 جرام",
    icon: "لو",
    image: "products/almonds.svg",
    gradient: "from-[#6b3f23] via-[#b8844e] to-[#edc087]",
    tag: "محمص",
    description: "لوز مختار ومحمص بدرجة متوازنة للضيافة الفاخرة.",
  },
  {
    id: 16,
    name: "عين جمل كامل",
    category: "nuts",
    price: 135,
    unit: "500 جرام",
    icon: "جم",
    image: "products/walnuts.svg",
    gradient: "from-[#4e301d] via-[#a87845] to-[#dfba84]",
    tag: "مختار",
    description: "عين جمل كامل بحجم ممتاز ومذاق غني.",
  },
];

const features = [
  { title: "مصادر موثوقة", text: "توريد من موردين مختارين بعقود جودة واضحة.", icon: "01" },
  { title: "تعبئة فاخرة", text: "تجربة تغليف مناسبة للهدايا والضيافة الراقية.", icon: "02" },
  { title: "فرز يدوي", text: "كل دفعة تمر بمراجعة بصرية وحسية قبل العرض.", icon: "03" },
  { title: "توصيل سريع", text: "تجهيز الطلبات بتغليف آمن وجدولة توصيل مرنة.", icon: "04" },
];

const testimonials = [
  { name: "منى الحربي", city: "الرياض", text: "التجربة شكلها فخم جداً، حسيت إن المنتج premium فعلاً قبل ما أطلب.", rating: 5 },
  { name: "عبدالله سالم", city: "جدة", text: "التصنيفات واضحة والسلة بسيطة. مناسب جداً لمتجر عطارة أونلاين.", rating: 5 },
  { name: "نورة خالد", city: "الدمام", text: "أكثر شيء عجبني الإحساس الطبيعي مع الفخامة، مش زحمة ولا شعبي.", rating: 5 },
  { name: "محمد عادل", city: "القاهرة", text: "الواجهة تبيع الثقة قبل المنتج، وده المهم في نيتش العطارة.", rating: 5 },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

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
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.18))]" />
      <motion.div
        className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/18 blur-2xl"
        animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative flex h-full items-end justify-end p-5">
        <span className="rounded-full border border-white/30 bg-white/18 px-7 py-6 text-4xl font-black text-white shadow-2xl backdrop-blur-md">
          {product.icon}
        </span>
      </div>
    </div>
  );
}

function Navbar({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? "bg-[#fffaf0]/86 py-3 shadow-[0_12px_36px_rgba(14,40,24,0.1)] backdrop-blur-xl" : "bg-transparent py-5"
      }`}
    >
      <nav className="luxury-container flex items-center justify-between gap-5">
        <a href="#hero" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0e2818] text-lg font-black text-[#eacf86] shadow-xl shadow-green-950/20">
            ع
          </span>
          <span className={`text-lg font-black ${scrolled ? "text-[#0e2818]" : "text-white"}`}>عطارة النخبة</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {[
            ["التصنيفات", "categories"],
            ["المنتجات", "products"],
            ["القصة", "about"],
            ["آراء العملاء", "testimonials"],
          ].map(([label, href]) => (
            <a key={href} href={`#${href}`} className={`nav-link text-sm font-semibold ${scrolled ? "text-[#263324]" : "text-white/86"}`}>
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={onCartOpen}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`relative rounded-full border px-5 py-2.5 text-sm font-bold transition ${
              scrolled ? "border-[#d9bd78] bg-white text-[#0e2818]" : "border-white/24 bg-white/10 text-white backdrop-blur-md"
            }`}
          >
            السلة
            {cartCount > 0 && (
              <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#c99a38] text-xs text-white">
                {cartCount}
              </span>
            )}
          </motion.button>
          <a href="#products" className="hidden rounded-full bg-[#c99a38] px-5 py-2.5 text-sm font-bold text-[#151512] shadow-lg shadow-[#c99a38]/20 sm:inline-block">
            تسوق الآن
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 70]);

  return (
    <section id="hero" className="hero-pattern relative min-h-screen overflow-hidden pt-32 text-white">
      <motion.div
        className="absolute inset-0 opacity-80"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 16, repeat: Infinity }}
      />
      <motion.div style={{ y }} className="absolute -right-20 top-28 h-72 w-72 rounded-full bg-[#c99a38]/20 blur-3xl" />
      <motion.div style={{ y }} className="absolute bottom-16 left-4 h-96 w-96 rounded-full bg-[#6f8161]/18 blur-3xl" />

      <div className="luxury-container relative grid min-h-[calc(100vh-8rem)] items-center gap-12 py-16 lg:grid-cols-[1.06fr_0.94fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.span variants={fadeUp} className="mb-6 inline-flex rounded-full border border-[#c99a38]/35 bg-white/8 px-5 py-2 text-sm font-semibold text-[#ead29d] backdrop-blur-md">
            متجر عطارة فاخر جاهز للعرض والعملاء
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl font-black leading-tight md:text-7xl">
            تجربة عطارة <span className="gold-text">راقية</span> تبيع الثقة قبل المنتج
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-9 text-white/74 md:text-xl">
            واجهة متجر عربية بسيطة وفاخرة للأعشاب، التوابل، العسل والزيوت الطبيعية. تصميم نظيف يساعد العميل يختار بسرعة ويحس بجودة البراند.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} href="#products" className="rounded-full bg-[#c99a38] px-8 py-4 text-center font-black text-[#151512] shadow-2xl shadow-[#c99a38]/20">
              تصفح المنتجات
            </motion.a>
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} href="#about" className="rounded-full border border-white/22 bg-white/8 px-8 py-4 text-center font-bold text-white backdrop-blur-md">
              اعرف القصة
            </motion.a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            {[
              ["16+", "منتج Demo"],
              ["6", "تصنيفات"],
              ["100%", "واجهة UI"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/8 p-4 text-center backdrop-blur-md">
                <div className="text-2xl font-black text-[#ead29d]">{value}</div>
                <div className="mt-1 text-xs text-white/60">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="glass-panel relative rounded-[42px] p-4">
          <div className="relative overflow-hidden rounded-[34px] bg-[#fffaf0] p-5 text-[#0e2818]">
            <div className="grid gap-4 sm:grid-cols-2">
              {products.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  className="rounded-[28px] border border-[#ead29d]/60 bg-white p-3 shadow-xl shadow-green-950/5"
                  animate={{ y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0] }}
                  transition={{ duration: 4 + index, repeat: Infinity }}
                >
                  <div className="h-36"><ProductVisual product={product} /></div>
                  <div className="mt-3 text-sm font-black">{product.name}</div>
                  <div className="mt-1 text-xs text-[#756b5d]">{product.price} ريال</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Categories({ selected, onSelect }: { selected: string; onSelect: (category: string) => void }) {
  return (
    <section id="categories" className="py-20">
      <div className="luxury-container">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-bold text-[#c99a38]">التصنيفات</span>
            <h2 className="mt-3 text-4xl font-black text-[#0e2818] md:text-5xl">اختيار سريع حسب احتياج العميل</h2>
          </div>
          <p className="max-w-xl leading-8 text-[#756b5d]">فلترة بسيطة تساعد العميل يوصل للمنتج المناسب بدون زحمة أو تعقيد.</p>
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
                className={`rounded-[28px] border p-5 text-right shadow-lg transition ${
                  active
                    ? "border-[#c99a38] bg-[#0e2818] text-white shadow-green-950/20"
                    : "border-[#ead29d]/70 bg-[#fffaf0] text-[#0e2818] shadow-green-950/5 hover:border-[#c99a38]"
                }`}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-black ${active ? "bg-[#c99a38] text-[#151512]" : "bg-[#f2e2c3] text-[#8a651d]"}`}>
                  {category.icon}
                </span>
                <span className="mt-5 block text-sm font-black">{category.name}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ product, liked, onLike, onAdd }: { product: Product; liked: boolean; onLike: () => void; onAdd: () => void }) {
  return (
    <motion.article variants={fadeUp} layout whileHover={{ y: -8 }} className="group rounded-[34px] border border-[#ead29d]/70 bg-[#fffaf0] p-4 shadow-xl shadow-green-950/5">
      <div className="relative h-56 overflow-hidden rounded-[28px]">
        <ProductVisual product={product} />
        <div className="absolute right-4 top-4 rounded-full bg-white/82 px-3 py-1 text-xs font-bold text-[#0e2818] backdrop-blur-md">{product.tag}</div>
        <motion.button
          type="button"
          onClick={onLike}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md ${liked ? "bg-[#c99a38] text-white" : "bg-white/80 text-[#0e2818]"}`}
          aria-label="إضافة للمفضلة"
        >
          ♥
        </motion.button>
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button type="button" onClick={onAdd} className="w-full rounded-full bg-[#0e2818] px-5 py-3 text-sm font-black text-white shadow-xl">
            أضف للسلة
          </button>
        </div>
      </div>
      <div className="p-3">
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-[#0e2818]">{product.name}</h3>
          <span className="rounded-full bg-[#f1e1c0] px-3 py-1 text-xs font-bold text-[#8a651d]">{product.unit}</span>
        </div>
        <p className="mt-3 min-h-[3.5rem] text-sm leading-7 text-[#756b5d]">{product.description}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-[#c99a38]">{product.price}</span>
            <span className="mr-1 text-sm text-[#756b5d]">ريال</span>
            {product.oldPrice && <div className="text-xs text-[#9a8c78] line-through">{product.oldPrice} ريال</div>}
          </div>
          <button type="button" onClick={onAdd} className="rounded-full border border-[#c99a38]/40 px-4 py-2 text-sm font-black text-[#0e2818] transition hover:bg-[#0e2818] hover:text-white">
            شراء
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductsSection({ selected, favorites, onToggleFavorite, onAddToCart }: { selected: string; favorites: number[]; onToggleFavorite: (id: number) => void; onAddToCart: (product: Product) => void }) {
  const visibleProducts = selected === "all" ? products : products.filter((product) => product.category === selected);

  return (
    <section id="products" className="bg-white/54 py-20">
      <div className="luxury-container">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-bold text-[#c99a38]">المنتجات</span>
            <h2 className="mt-3 text-4xl font-black text-[#0e2818] md:text-5xl">واجهة بيع واضحة وفاخرة</h2>
          </div>
          <div className="rounded-full border border-[#ead29d] bg-[#fffaf0] px-5 py-3 text-sm font-bold text-[#756b5d]">
            {visibleProducts.length} منتج ظاهر
          </div>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                liked={favorites.includes(product.id)}
                onLike={() => onToggleFavorite(product.id)}
                onAdd={() => onAddToCart(product)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="paper-texture relative overflow-hidden bg-[#0e2818] py-24 text-white">
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
          <span className="text-sm font-bold text-[#ead29d]">قصة البراند</span>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">عطارة بروح تراثية، لكن بتجربة شراء حديثة</h2>
          <div className="mt-6 space-y-5 text-lg leading-9 text-white/74">
            <p>V2 مصمم عشان يقدم العطارة كبراند موثوق، نظيف، وفاخر. العميل يشوف المنتجات، يعرف التصنيفات، يضيف للسلة، ويحس إن المتجر منظم قبل أي تعامل حقيقي.</p>
            <p>الهدف مش زحمة صور وتأثيرات، الهدف واجهة تبيع الإحساس بالجودة: ألوان هادئة، مساحات واضحة، كروت منتجات قوية، وتجربة عربية RTL كاملة.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["40+", "سنة خبرة مقترحة"],
              ["24h", "تجهيز سريع"],
              ["4.9", "تقييم العملاء"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <div className="text-2xl font-black text-[#ead29d]">{value}</div>
                <div className="mt-1 text-xs text-white/58">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-20">
      <div className="luxury-container">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-sm font-bold text-[#c99a38]">لماذا المتجر مقنع؟</span>
          <h2 className="mt-3 text-4xl font-black text-[#0e2818] md:text-5xl">تفاصيل صغيرة ترفع ثقة العميل</h2>
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp} whileHover={{ y: -6 }} className="rounded-[34px] border border-[#ead29d]/70 bg-[#fffaf0] p-7 shadow-xl shadow-green-950/5">
              <div className="text-4xl font-black text-[#c99a38]/40">{feature.icon}</div>
              <h3 className="mt-8 text-xl font-black text-[#0e2818]">{feature.title}</h3>
              <p className="mt-3 leading-7 text-[#756b5d]">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 4200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="bg-[#fffaf0] py-20">
      <div className="luxury-container">
        <Reveal className="mb-12 text-center">
          <span className="text-sm font-bold text-[#c99a38]">آراء العملاء</span>
          <h2 className="mt-3 text-4xl font-black text-[#0e2818] md:text-5xl">كلام واقعي مناسب للعرض</h2>
        </Reveal>
        <div className="mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -18 }}
              transition={{ duration: 0.45 }}
              className="rounded-[40px] border border-[#ead29d] bg-white p-8 text-center shadow-2xl shadow-green-950/7"
            >
              <div className="mb-5 text-[#c99a38]">{"★".repeat(testimonials[active].rating)}</div>
              <p className="text-xl leading-10 text-[#263324]">“{testimonials[active].text}”</p>
              <div className="mt-7 font-black text-[#0e2818]">{testimonials[active].name}</div>
              <div className="mt-1 text-sm text-[#756b5d]">{testimonials[active].city}</div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((item, index) => (
              <button key={item.name} type="button" onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${active === index ? "w-9 bg-[#c99a38]" : "w-2.5 bg-[#d8c8aa]"}`} aria-label={`عرض رأي ${item.name}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="py-20">
      <div className="luxury-container">
        <Reveal className="relative overflow-hidden rounded-[44px] bg-[#0e2818] p-8 text-white shadow-2xl shadow-green-950/16 md:p-12">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#c99a38]/18 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <span className="text-sm font-bold text-[#ead29d]">Newsletter</span>
              <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">اعرض خصم أول طلب بطريقة أنيقة</h2>
              <p className="mt-5 max-w-2xl leading-8 text-white/70">نموذج واجهة فقط لالتقاط اهتمام العميل، مناسب للعرض على صاحب المشروع قبل ربط backend.</p>
            </div>
            <form className="rounded-[32px] border border-white/10 bg-white/8 p-3 backdrop-blur-md" onSubmit={(event) => event.preventDefault()}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input className="min-h-14 flex-1 rounded-full border border-white/10 bg-white px-5 text-right text-[#0e2818] outline-none" placeholder="أدخل بريدك الإلكتروني" type="email" />
                <button className="rounded-full bg-[#c99a38] px-7 py-4 font-black text-[#151512]" type="submit">
                  احصل على خصم 10%
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CartSidebar({ open, items, onClose, onIncrease, onDecrease }: { open: boolean; items: CartItem[]; onClose: () => void; onIncrease: (id: number) => void; onDecrease: (id: number) => void }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed left-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-[#fffaf0] shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.42 }}
          >
            <div className="flex items-center justify-between border-b border-[#ead29d]/70 p-6">
              <div>
                <h3 className="text-2xl font-black text-[#0e2818]">سلة الطلب</h3>
                <p className="mt-1 text-sm text-[#756b5d]">UI فقط، بدون checkout حقيقي</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-[#f0dfbe] font-black text-[#0e2818]">
                ×
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center text-[#756b5d]">السلة فارغة حالياً</div>
              ) : (
                items.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4 rounded-[28px] border border-[#ead29d]/70 bg-white p-3">
                    <div className="h-24 w-24 shrink-0"><ProductVisual product={item} /></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-[#0e2818]">{item.name}</h4>
                      <p className="mt-1 text-sm text-[#756b5d]">{item.price} ريال</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" onClick={() => onDecrease(item.id)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f0dfbe] font-black">-</button>
                        <span className="min-w-6 text-center font-black">{item.quantity}</span>
                        <button type="button" onClick={() => onIncrease(item.id)} className="grid h-8 w-8 place-items-center rounded-full bg-[#0e2818] font-black text-white">+</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="border-t border-[#ead29d]/70 p-6">
              <div className="mb-4 flex items-center justify-between text-lg font-black text-[#0e2818]">
                <span>الإجمالي</span>
                <span>{total} ريال</span>
              </div>
              <button type="button" className="w-full rounded-full bg-[#0e2818] px-6 py-4 font-black text-white">
                إتمام الطلب UI
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0b1c11] py-14 text-white">
      <div className="luxury-container grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c99a38] font-black text-[#151512]">ع</span>
            <span className="text-xl font-black">عطارة النخبة</span>
          </div>
          <p className="mt-5 max-w-sm leading-8 text-white/62">V2 واجهة متجر عطارة Modern Luxury، جاهزة للتطوير والربط لاحقاً.</p>
        </div>
        <div>
          <h4 className="font-black text-[#ead29d]">المتجر</h4>
          <div className="mt-4 space-y-3 text-white/62">
            <a href="#products" className="block hover:text-white">المنتجات</a>
            <a href="#categories" className="block hover:text-white">التصنيفات</a>
            <a href="#about" className="block hover:text-white">من نحن</a>
          </div>
        </div>
        <div>
          <h4 className="font-black text-[#ead29d]">التواصل</h4>
          <div className="mt-4 space-y-3 text-white/62">
            <p>+966 55 123 4567</p>
            <p>hello@attar-v2.com</p>
            <p>الرياض، السعودية</p>
          </div>
        </div>
        <div>
          <h4 className="font-black text-[#ead29d]">تابعنا</h4>
          <div className="mt-4 flex gap-3">
            {['in', 'ig', 'x'].map((item) => (
              <a key={item} href="#" className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/5 text-sm font-black transition hover:bg-[#c99a38] hover:text-[#151512]">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingActions() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      <motion.a href="#" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="grid h-14 w-14 place-items-center rounded-full bg-[#25d366] font-black text-white shadow-2xl shadow-green-950/20">
        وات
      </motion.a>
      <motion.a href="#hero" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="grid h-12 w-12 place-items-center rounded-full border border-[#ead29d] bg-[#fffaf0] font-black text-[#0e2818] shadow-xl">
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
      className="pointer-events-none fixed z-[100] hidden h-24 w-24 rounded-full bg-[#c99a38]/14 blur-2xl lg:block"
      animate={{ x: position.x - 48, y: position.y - 48 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    />
  );
}

function Toast({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} className="fixed bottom-8 right-1/2 z-[120] translate-x-1/2 rounded-full bg-[#0e2818] px-6 py-3 text-sm font-black text-white shadow-2xl">
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState("");

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
    showToast("تمت الإضافة للسلة");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    showToast(favorites.includes(id) ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة");
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
    <>
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
        <ProductsSection selected={selectedCategory} favorites={favorites} onToggleFavorite={toggleFavorite} onAddToCart={addToCart} />
        <About />
        <Features />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <CartSidebar open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onIncrease={increaseItem} onDecrease={decreaseItem} />
      <FloatingActions />
      <CursorGlow />
      <Toast message={toast} />
    </>
  );
}
