import type { ReactNode } from "react";

export { metadata, generateStaticParams } from "./[locale]/layout";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
