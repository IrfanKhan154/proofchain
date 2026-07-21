import "./globals.css";

export const metadata = {
  title: "ProofChain | Evidence Audit Workspace",
  description:
    "Professional claim-to-evidence auditing workspace for evaluating supported, contradicted, and missing evidence.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
