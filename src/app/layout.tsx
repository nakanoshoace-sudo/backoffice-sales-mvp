import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "オンラインバックオフィス代行",
  description:
    "経理・請求・総務・秘書業務をオンラインで代行。採用不要・月額制で、すぐにバックオフィス体制を整えられます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
