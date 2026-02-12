import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "漢方候補サジェスト（参考用）",
  description: "症状と簡易質問から漢方薬候補を参考表示するアプリ"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
