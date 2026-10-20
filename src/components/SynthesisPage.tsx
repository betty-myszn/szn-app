"use client";

import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { buildSynthesis } from "@/lib/synthesis";
import { glossify } from "@/components/AstroTerm";
import { Box, SectionHead, makeLead } from "@/components/learn/LearnKit";
import { DeepDiveBody, DeepDiveHero, DeepDivePage, PinkLink, Stack, goDeeper, toneFromBg } from "@/components/learn/DeepDive";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const lead = makeLead(glossify);

export default function SynthesisPage({ slug }: { slug: string }) {
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            members only, babe.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const reading = chart ? buildSynthesis(slug, chart) : null;

  if (!reading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            add your birth details to unlock this reading.
          </h1>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  return (
    <DeepDivePage eyebrow={reading.title}>
      <DeepDiveHero eyebrow={`${reading.title} · read from your whole chart`} title={reading.heroLine}>
        {glossify(reading.intro)}
      </DeepDiveHero>

      <DeepDiveBody>
        <SectionHead title="your reading" />
        <Stack cols={260}>
          {reading.sections.map((section) => {
            const tone = toneFromBg(section.bg);
            return (
              <Box key={section.title} tone={tone} label={section.title}>
                {lead(section.body)}
                {section.href && (
                  <div>
                    <Link href={section.href} className="no-underline" style={goDeeper(tone === "dark")}>
                      go deeper →
                    </Link>
                  </div>
                )}
              </Box>
            );
          })}
        </Stack>

        <SectionHead title="make it real" />
        <Box tone="lav">
          <strong style={{ display: "block", fontFamily: poppins, fontSize: 20, lineHeight: 1.3, marginBottom: 14 }}>journal on what landed hardest.</strong>
          <PinkLink href="/journal">open my journal</PinkLink>
        </Box>
      </DeepDiveBody>
    </DeepDivePage>
  );
}
