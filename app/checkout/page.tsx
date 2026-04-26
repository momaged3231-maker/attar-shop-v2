"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Lang = "ar" | "en";
type Localized = Record<Lang, string>;

type CartItem = {
  id: number;
  name: Localized;
  price: number;
  unit: Localized;
  image: string;
  description: Localized;
  tag: Localized;
  category: string;
  quantity: number;
};

const CART_STORAGE_KEY = "emirates-attar-cart";
const LANGUAGE_STORAGE_KEY = "emirates-attar-language";

const copy = {
  ar: {
    brand: "عطارة الإمارات",
    backProducts: "العودة للمنتجات",
    backHome: "الرئيسية",
    title: "إتمام الطلب",
    subtitle: "نموذج Checkout كامل للعرض فقط، مناسب لطلب منتجات عطارة داخل الإمارات.",
    customerInfo: "بيانات العميل",
    deliveryInfo: "بيانات التوصيل",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني",
    emirate: "الإمارة",
    area: "المنطقة",
    address: "العنوان التفصيلي",
    deliveryMethod: "طريقة التوصيل",
    paymentMethod: "طريقة الدفع",
    standard: "توصيل عادي 24-48 ساعة",
    express: "توصيل سريع نفس اليوم UI",
    card: "بطاقة بنكية UI",
    cash: "الدفع عند الاستلام UI",
    summary: "ملخص الطلب",
    empty: "السلة فارغة. اختر منتجات أولاً من الكتالوج.",
    subtotal: "المجموع الفرعي",
    delivery: "التوصيل",
    total: "الإجمالي",
    free: "مجاني",
    aed: "درهم",
    placeOrder: "تأكيد الطلب UI",
    successTitle: "تم تجهيز نموذج الطلب",
    successText: "هذه واجهة فقط، لا يوجد دفع أو إرسال حقيقي حالياً.",
    close: "إغلاق",
    requiredNote: "كل الحقول هنا للعرض فقط ويمكن ربطها لاحقاً بالـ backend.",
  },
  en: {
    brand: "Emirates Attar",
    backProducts: "Back to products",
    backHome: "Home",
    title: "Checkout",
    subtitle: "A complete checkout UI concept for UAE attar orders. No real payment is connected.",
    customerInfo: "Customer details",
    deliveryInfo: "Delivery details",
    fullName: "Full name",
    phone: "Phone number",
    email: "Email address",
    emirate: "Emirate",
    area: "Area",
    address: "Detailed address",
    deliveryMethod: "Delivery method",
    paymentMethod: "Payment method",
    standard: "Standard delivery 24-48h",
    express: "Same-day express UI",
    card: "Bank card UI",
    cash: "Cash on delivery UI",
    summary: "Order summary",
    empty: "Your cart is empty. Choose products from the catalog first.",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    free: "Free",
    aed: "AED",
    placeOrder: "Confirm order UI",
    successTitle: "Order form prepared",
    successText: "This is UI only. No payment or real submission is connected yet.",
    close: "Close",
    requiredNote: "All fields are presentation-only and can be connected to a backend later.",
  },
} satisfies Record<Lang, Record<string, string>>;

const emirates = {
  ar: ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"],
  en: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
};

function text(value: Localized, lang: Lang) {
  return value[lang];
}

function normalizeImage(image: string) {
  if (image.startsWith("../")) return image;
  if (image.startsWith("products/")) return `../${image}`;
  return image;
}

function ProductImage({ item }: { item: CartItem }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[24px] bg-[#062f22]">
      <img src={normalizeImage(item.image)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(0,0,0,0.16))]" />
    </div>
  );
}

function Field({ label, type = "text", textarea = false }: { label: string; type?: string; textarea?: boolean }) {
  if (textarea) {
    return (
      <label className="block text-start">
        <span className="mb-2 block text-sm font-black text-[#062f22]">{label}</span>
        <textarea className="min-h-28 w-full resize-none rounded-[24px] border border-[#ead7a4] bg-white px-5 py-4 text-start outline-none transition focus:border-[#c8a45d]" />
      </label>
    );
  }

  return (
    <label className="block text-start">
      <span className="mb-2 block text-sm font-black text-[#062f22]">{label}</span>
      <input type={type} className="min-h-14 w-full rounded-full border border-[#ead7a4] bg-white px-5 text-start outline-none transition focus:border-[#c8a45d]" />
    </label>
  );
}

export default function CheckoutPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const [items, setItems] = useState<CartItem[]>([]);
  const [success, setSuccess] = useState(false);
  const c = copy[lang];
  const direction = lang === "ar" ? "rtl" : "ltr";
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
  }, [direction, lang]);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (storedLanguage === "ar" || storedLanguage === "en") setLang(storedLanguage);
    if (storedCart) setItems(JSON.parse(storedCart) as CartItem[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  const updateQuantity = (id: number, delta: number) => {
    setItems((current) => {
      const next = current.flatMap((item) => {
        if (item.id !== id) return [item];
        const quantity = item.quantity + delta;
        if (quantity <= 0) return [];
        return [{ ...item, quantity }];
      });
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div dir={direction} lang={lang} className="min-h-screen bg-[#fbf7ef]">
      <header className="border-b border-[#ead7a4]/70 bg-[#fffaf0]/92 backdrop-blur-xl">
        <div className="uae-ribbon h-1 w-full" />
        <nav className="luxury-container flex flex-wrap items-center justify-between gap-4 py-4">
          <a href="../" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#062f22] text-sm font-black text-[#ead7a4]">AE</span>
            <span className="font-black text-[#062f22]">{c.brand}</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="../products/" className="rounded-full border border-[#ead7a4] px-4 py-2 text-sm font-black text-[#062f22]">{c.backProducts}</a>
            <a href="../" className="hidden rounded-full border border-[#ead7a4] px-4 py-2 text-sm font-black text-[#062f22] sm:inline-block">{c.backHome}</a>
            <div className="rounded-full border border-[#ead7a4] bg-white p-1">
              {(["ar", "en"] as Lang[]).map((item) => (
                <button key={item} type="button" onClick={() => setLang(item)} className={`rounded-full px-3 py-1.5 text-xs font-black ${lang === item ? "bg-[#c8a45d] text-[#111]" : "text-[#062f22]"}`}>
                  {item === "ar" ? "ع" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-pattern py-16 text-white">
          <div className="luxury-container text-start">
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black md:text-7xl">
              {c.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-2xl text-lg leading-9 text-white/74">
              {c.subtitle}
            </motion.p>
          </div>
        </section>

        <section className="py-12">
          <div className="luxury-container grid gap-8 lg:grid-cols-[1fr_0.78fr]">
            <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[38px] border border-[#ead7a4]/70 bg-[#fffaf0] p-6 shadow-xl shadow-green-950/5" onSubmit={(event) => { event.preventDefault(); setSuccess(true); }}>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="text-start">
                  <h2 className="text-2xl font-black text-[#062f22]">{c.customerInfo}</h2>
                  <p className="mt-2 text-sm text-[#756b5d]">{c.requiredNote}</p>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={c.fullName} />
                <Field label={c.phone} type="tel" />
                <Field label={c.email} type="email" />
                <label className="block text-start">
                  <span className="mb-2 block text-sm font-black text-[#062f22]">{c.emirate}</span>
                  <select className="min-h-14 w-full rounded-full border border-[#ead7a4] bg-white px-5 text-start outline-none transition focus:border-[#c8a45d]">
                    {emirates[lang].map((emirate) => <option key={emirate}>{emirate}</option>)}
                  </select>
                </label>
                <Field label={c.area} />
                <Field label={c.address} textarea />
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-[28px] border border-[#ead7a4] bg-white p-5 text-start">
                  <h3 className="font-black text-[#062f22]">{c.deliveryMethod}</h3>
                  <label className="mt-4 flex items-center gap-3 text-sm text-[#756b5d]"><input defaultChecked type="radio" name="delivery" /> {c.standard}</label>
                  <label className="mt-3 flex items-center gap-3 text-sm text-[#756b5d]"><input type="radio" name="delivery" /> {c.express}</label>
                </div>
                <div className="rounded-[28px] border border-[#ead7a4] bg-white p-5 text-start">
                  <h3 className="font-black text-[#062f22]">{c.paymentMethod}</h3>
                  <label className="mt-4 flex items-center gap-3 text-sm text-[#756b5d]"><input defaultChecked type="radio" name="payment" /> {c.card}</label>
                  <label className="mt-3 flex items-center gap-3 text-sm text-[#756b5d]"><input type="radio" name="payment" /> {c.cash}</label>
                </div>
              </div>

              <button type="submit" disabled={items.length === 0} className="mt-8 w-full rounded-full bg-[#062f22] px-8 py-4 font-black text-white transition disabled:cursor-not-allowed disabled:opacity-40">
                {c.placeOrder}
              </button>
            </motion.form>

            <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="h-fit rounded-[38px] border border-[#ead7a4]/70 bg-[#fffaf0] p-6 shadow-xl shadow-green-950/5">
              <h2 className="text-start text-2xl font-black text-[#062f22]">{c.summary}</h2>
              <div className="mt-6 space-y-4">
                {items.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[#ead7a4] bg-white p-8 text-center text-[#756b5d]">{c.empty}</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-[28px] border border-[#ead7a4]/70 bg-white p-3">
                      <div className="h-24 w-24 shrink-0"><ProductImage item={item} /></div>
                      <div className="min-w-0 flex-1 text-start">
                        <h3 className="font-black text-[#062f22]">{text(item.name, lang)}</h3>
                        <p className="mt-1 text-sm text-[#756b5d]">{item.price} {c.aed}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <button type="button" onClick={() => updateQuantity(item.id, -1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f0dfbe] font-black">-</button>
                          <span className="min-w-6 text-center font-black">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#062f22] font-black text-white">+</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-[#ead7a4] pt-5 text-[#062f22]">
                <div className="flex items-center justify-between"><span>{c.subtotal}</span><strong>{subtotal} {c.aed}</strong></div>
                <div className="flex items-center justify-between"><span>{c.delivery}</span><strong>{deliveryFee === 0 ? c.free : `${deliveryFee} ${c.aed}`}</strong></div>
                <div className="flex items-center justify-between text-xl font-black"><span>{c.total}</span><span>{total} {c.aed}</span></div>
              </div>
            </motion.aside>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {success && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 14 }} className="max-w-md rounded-[36px] bg-[#fffaf0] p-8 text-center shadow-2xl">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#062f22] font-black text-[#ead7a4]">AE</div>
              <h3 className="mt-5 text-2xl font-black text-[#062f22]">{c.successTitle}</h3>
              <p className="mt-3 leading-8 text-[#756b5d]">{c.successText}</p>
              <button type="button" onClick={() => setSuccess(false)} className="mt-6 rounded-full bg-[#c8a45d] px-8 py-3 font-black text-[#111]">{c.close}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
