import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "عطارة النخبة | متجر عطارة فاخر",
  description:
    "متجر عربي فاخر للأعشاب والتوابل والعسل والزيوت الطبيعية، مصمم كتجربة عرض جاهزة للعملاء.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${notoKufi.variable} scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
