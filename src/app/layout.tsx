import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "EPICVERSE | The Kuru Dynasty",
    template: "%s | EPICVERSE",
  },
  description:
    "Explore the illustrated Mahabharatam family tree, from Yayati to the descendants of the Pandavas, in the EPICVERSE royal archive.",
  icons: { icon: "/seal.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
