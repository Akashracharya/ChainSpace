import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata = {
  title: "ChainSpace",
  description: "Blockchain-based developer chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetbrains.variable} font-mono bg-slate-900 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
