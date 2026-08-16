import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "前程似锦｜升学祝福",
  description: "愿你长风破浪，奔赴热爱；新程灿烂，未来可期。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
