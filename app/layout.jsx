import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import ClientGalaxy from "../components/ClientGalaxy";
import cursor from "../components/CanvasCursor"

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
      <body
        className={`${jetbrains.variable} font-mono text-slate-100 flex items-center justify-center min-h-screen p-4 bg-transparent`}
      >
        <cursor/>

        {/* 🌌 FULLSCREEN BACKGROUND LAYER */}
        <div
          className="fixed inset-0 -z-50  "
          style={{
            background: "black",
            overflow: "hidden",
          }}
        >
          {/* Galaxy MUST have pointer-events to work */}
          <div className="w-full h-full">
            <ClientGalaxy />
          </div>
        </div>

        {/* Foreground App */}
        {children}
      </body>
    </html>
  );
}
