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
      <body className={`${jetbrains.variable} font-mono text-slate-100 flex items-center justify-center min-h-screen p-4`}>
        {children}
      </body>
    </html>
  );
}
