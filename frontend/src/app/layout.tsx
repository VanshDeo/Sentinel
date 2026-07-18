import type { Metadata } from "next";
import { sectorFont, spaceGrotesk, jetbrainsMono, playfairDisplay } from "@/lib/fonts";
import { LenisProvider } from "@/components/lenis-provider";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel — Privacy that isn't secrecy",
  description:
    "Encrypted treasuries with policy checks before settlement, and audit access no single person controls. Built on Avalanche.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sectorFont.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0A0A0B] text-[#F5F5F7]">
        <Providers>
          <LenisProvider>
            {children}
          </LenisProvider>
        </Providers>
      </body>
    </html>
  );
}
