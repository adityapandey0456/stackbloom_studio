import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StackBloom Studio | Websites, Apps & Automation",
    template: "%s | StackBloom Studio",
  },
  description:
    "StackBloom Studio builds websites, web applications, dashboards and automation tools. Founded by Aditya Pandey.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body id="page-top">{children}</body>
    </html>
  );
}