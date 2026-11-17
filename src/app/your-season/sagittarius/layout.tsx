import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sagittarius SZN",
  robots: { index: false },
};

export default function SagittariusSznLayout({ children }: { children: ReactNode }) {
  return children;
}
