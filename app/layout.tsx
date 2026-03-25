import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexian Training Portal",
  description: "Actionstep customer training portal and admin workspace."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-frame">{children}</div>
      </body>
    </html>
  );
}
