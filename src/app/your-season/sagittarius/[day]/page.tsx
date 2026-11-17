import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeapDayPage from "@/components/quantum-leap/LeapDayPage";
import { QL_DAYS } from "@/lib/quantum-leap";

// One page per day of the Quantum Leap Experiment (Sagittarius SZN 2026), /your-season/sagittarius/day-1
// to day-30, so every daily post can link straight to its day. Members only (the proxy gates
// /your-season) and hidden until the Sun enters Sagittarius (LeapGate). Rendered per request: a
// generateStaticParams + dynamicParams=false here 404'd every /your-season page under Next 16 dev,
// so unknown days are turned away with notFound() instead.
const dayNumber = (slug: string) => {
  const m = /^day-(\d{1,2})$/.exec(slug);
  return m ? Number(m[1]) : NaN;
};

// The tab title stays generic: the day's name and move only ever come from /api/quantum-leap.
export const metadata: Metadata = { title: "Sagittarius SZN", robots: { index: false } };

export default async function QuantumLeapDay({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const n = dayNumber(day);
  if (!(n >= 1 && n <= QL_DAYS)) notFound();
  return <LeapDayPage n={n} />;
}
