export type Design = {
  id: string;
  rarity: string;
  amount: number;
  imageURI: string;
};

function toBase64(value: string) {
  if (typeof window === "undefined") {
    return Buffer.from(value).toString("base64");
  }
  return window.btoa(value);
}

function svgCard(title: string, amount: number, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#090c12" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="50" fill="url(#g)"/>
      <circle cx="645" cy="160" r="130" fill="rgba(255,255,255,0.08)"/>
      <text x="70" y="125" fill="#ffffff" font-size="44" font-family="Arial">ShiftFlow</text>
      <text x="70" y="360" fill="#ffffff" font-size="78" font-family="Arial" font-weight="bold">${title}</text>
      <text x="70" y="470" fill="#d5deea" font-size="40" font-family="Arial">Visual Receive</text>
      <text x="70" y="560" fill="#ffffff" font-size="96" font-family="Arial" font-weight="bold">$${amount}</text>
      <text x="70" y="705" fill="#d5deea" font-size="28" font-family="Arial">Minted on Arc via GiftArc contract</text>
    </svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

export const SHIFT_DESIGNS: Design[] = [
  { id: "settlement-wave", rarity: "COMMON", amount: 25, imageURI: svgCard("Settlement Wave", 25, "#4f7cff") },
  { id: "arc-cascade", rarity: "RARE", amount: 75, imageURI: svgCard("Arc Cascade", 75, "#19d29d") },
  { id: "finality-prime", rarity: "LEGENDARY", amount: 150, imageURI: svgCard("Finality Prime", 150, "#8b93ff") }
];
