import localFont from "next/font/local";
import { Space_Grotesk, JetBrains_Mono, Playfair_Display } from "next/font/google";

/**
 * Font pairing strategy:
 * 
 * 1. SECTOR 034 (display) — Local font via next/font/local.
 *    Used for: hero headlines, section titles, logo wordmark, dashboard labels.
 *    A techno-futuristic display font with angular cuts — the spec's primary.
 * 
 * 2. SPACE GROTESK (body sans) — Google Fonts.
 *    Used for: body text, descriptions, nav items, form labels, buttons.
 * 
 * 3. JETBRAINS MONO (code/data) — Google Fonts.
 *    Used for: transaction hashes, code blocks, tabular data, addresses.
 * 
 * 4. PLAYFAIR DISPLAY (serif accent) — Google Fonts.
 */

export const sectorFont = localFont({
  src: "../../public/fonts/sector-034.woff",
  variable: "--font-display",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
