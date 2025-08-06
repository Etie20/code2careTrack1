import type { Metadata } from "next";
import "./globals.css";
import '@fontsource/geist-sans';
export const metadata: Metadata = {
  title: "Code2care chatbot",
  description: "Enlighten innovation Code2care chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
