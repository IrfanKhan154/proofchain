import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://proofchain-beta.vercel.app"),
  title: "ProofChain | AI Evidence Verification Platform",
  description:
    "AI-powered evidence verification platform for claim verification, evidence matching, confidence scoring, and structured audit reports.",

  openGraph: {
    title: "ProofChain | AI Evidence Verification Platform",
    description:
      "AI-powered evidence verification platform for claim verification, evidence matching, confidence scoring, and structured audit reports.",
    url: "https://proofchain-beta.vercel.app",
    siteName: "ProofChain",
    images: [
      {
        url: "/og-image.png",
        width: 1280,
        height: 640,
        alt: "ProofChain AI Evidence Verification Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ProofChain | AI Evidence Verification Platform",
    description: "AI-powered evidence verification platform.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
