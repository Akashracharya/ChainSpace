"use client";

import Galaxy from "./LiquidEther";

export default function ClientGalaxy() {
  return (
  <Galaxy 
    mouseRepulsion={true}
    mouseInteraction={true}
    density={1.5}
    glowIntensity={0.5}
    saturation={0.8}
    hueShift={240}
  />
  );
}
