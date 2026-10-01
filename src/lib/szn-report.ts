import { LIFE_AREAS } from "@/lib/life-areas";
import { AREA_FLAVOUR, eraName, shortLabel } from "@/lib/szn-picks";

// The "what members want" report behind /admin/szn-report. Pure, so it is tested without a database:
// the API route gathers the rows and this turns them into numbers and plain-English findings.
//
// Two signals, kept side by side on purpose:
//   SAID  her "customise my szn" picks, what she tells us she wants more of
//   DID   which area reads she actually opens (/your-season/life/[area] in member_activity)
// Where they disagree is the most useful thing on the page.

export type Segment = "trial" | "paying" | "lapsed";

export interface ReportMember {
  segment: Segment;
  /** Can use the feature right now (active trial or paid). Adoption is measured against these. */
  eligible: boolean;
  /** null = never chose, [] = skipped */
  picks: string[] | null;
  pickedAt: string | null;
  pickSeason: string | null;
  history: { s: string; p: string[]; at: string }[];
  launchSeen: boolean;
}

export interface ReportRead {
  memberKey: string;
  areaId: string;
}

export interface AreaRow {
  id: string;
  label: string;
  pickers: number;
  pickShare: number; // of members who picked at least one area
  firstChoice: number;
  avgRank: number | null;
  trialPickers: number;
  payingPickers: number;
  reads: number;
  readers: number;
  readShare: number; // of all area-read visits
}

export interface SznReport {
  generatedAt: string;
  adoption: { eligible: number; picked: number; skipped: number; notYet: number; sawLaunch: number; rate: number };
  pickersTotal: number;
  avgPicks: number;
  areas: AreaRow[];
  combos: { label: string; count: number }[];
  eras: { label: string; count: number }[];
  bySeason: { season: string; pickers: number }[];
  recent: { at: string; era: string; segment: Segment }[];
  readsTotal: number;
  findings: string[];
  nextMoves: string[];
}

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 100));

const AREA_IDS = LIFE_AREAS.map((a) => a.id).filter((id) => AREA_FLAVOUR[id]);

export function buildSznReport(members: ReportMember[], reads: ReportRead[], now = new Date()): SznReport {
  const eligible = members.filter((m) => m.eligible);
  const pickers = members.filter((m) => m.picks && m.picks.length > 0);
  const readsTotal = reads.length;

  const areas: AreaRow[] = AREA_IDS.map((id) => {
    const withIt = pickers.filter((m) => m.picks!.includes(id));
    const ranks = withIt.map((m) => m.picks!.indexOf(id) + 1);
    const areaReads = reads.filter((r) => r.areaId === id);
    return {
      id,
      label: shortLabel(id),
      pickers: withIt.length,
      pickShare: pct(withIt.length, pickers.length),
      firstChoice: pickers.filter((m) => m.picks![0] === id).length,
      avgRank: ranks.length ? Math.round((ranks.reduce((a, b) => a + b, 0) / ranks.length) * 10) / 10 : null,
      trialPickers: withIt.filter((m) => m.segment === "trial").length,
      payingPickers: withIt.filter((m) => m.segment === "paying").length,
      reads: areaReads.length,
      readers: new Set(areaReads.map((r) => r.memberKey)).size,
      readShare: pct(areaReads.length, readsTotal),
    };
  }).sort((a, b) => b.pickers - a.pickers || b.firstChoice - a.firstChoice || b.reads - a.reads);

  const tally = (keys: string[]) => {
    const m = new Map<string, number>();
    for (const k of keys) m.set(k, (m.get(k) ?? 0) + 1);
    return [...m.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  };

  // Every pair she picked together, order ignored, so "money + love" and "love + money" are one mix.
  const pairs: string[] = [];
  for (const m of pickers) {
    const p = m.picks!;
    for (let i = 0; i < p.length; i++)
      for (let j = i + 1; j < p.length; j++) pairs.push([shortLabel(p[i]), shortLabel(p[j])].sort().join(" + "));
  }

  const seasons = tally(
    members.flatMap((m) => {
      const s = new Set(m.history.filter((h) => h.p.length > 0).map((h) => h.s));
      if (m.picks?.length && m.pickSeason) s.add(m.pickSeason);
      return [...s];
    }),
  ).map(({ label, count }) => ({ season: label, pickers: count }));

  const recent = pickers
    .filter((m) => m.pickedAt)
    .sort((a, b) => (b.pickedAt! > a.pickedAt! ? 1 : -1))
    .slice(0, 12)
    .map((m) => ({ at: m.pickedAt!, era: eraName(m.picks!), segment: m.segment }));

  const adoption = {
    eligible: eligible.length,
    picked: eligible.filter((m) => m.picks && m.picks.length > 0).length,
    skipped: eligible.filter((m) => m.picks && m.picks.length === 0).length,
    notYet: eligible.filter((m) => m.picks === null).length,
    sawLaunch: eligible.filter((m) => m.launchSeen).length,
    rate: 0,
  };
  adoption.rate = pct(adoption.picked, adoption.eligible);

  const report: SznReport = {
    generatedAt: now.toISOString(),
    adoption,
    pickersTotal: pickers.length,
    avgPicks: pickers.length ? Math.round((pickers.reduce((a, m) => a + m.picks!.length, 0) / pickers.length) * 10) / 10 : 0,
    areas,
    combos: tally(pairs).slice(0, 8),
    eras: tally(pickers.map((m) => eraName(m.picks!))).slice(0, 8),
    bySeason: seasons,
    recent,
    readsTotal,
    findings: [],
    nextMoves: [],
  };
  report.findings = findingsFor(report);
  report.nextMoves = nextMovesFor(report);
  return report;
}

function findingsFor(r: SznReport): string[] {
  const out: string[] = [];
  const picked = r.areas.filter((a) => a.pickers > 0);
  const top = picked[0];

  if (r.pickersTotal === 0) {
    out.push("Nobody has picked yet. The launch popup shows each member once, so the first answers arrive as members open the app over the next few days.");
  } else {
    if (r.pickersTotal < 10) {
      out.push(`Early days: ${r.pickersTotal} ${r.pickersTotal === 1 ? "member has" : "members have"} picked so far, so read the order of the list rather than the exact percentages.`);
    }
    out.push(`${cap(top.label)} is what members want most: ${top.pickers} of ${r.pickersTotal} picked it (${top.pickShare}%), and ${top.firstChoice} put it first.`);

    const firsts = [...r.areas].sort((a, b) => b.firstChoice - a.firstChoice);
    if (firsts[0].firstChoice > 0 && firsts[0].id !== top.id) {
      out.push(`${cap(firsts[0].label)} gets put first most often (${firsts[0].firstChoice} times), so it is the thing members lead with even though ${top.label} is picked by more of them.`);
    }

    const trialTop = [...r.areas].sort((a, b) => b.trialPickers - a.trialPickers)[0];
    const payTop = [...r.areas].sort((a, b) => b.payingPickers - a.payingPickers)[0];
    if (trialTop.trialPickers > 0 && payTop.payingPickers > 0 && trialTop.id !== payTop.id) {
      out.push(`Trials lean ${trialTop.label}, paying members lean ${payTop.label}. The trial week should show off ${trialTop.label} hardest, because that is what new people arrive wanting.`);
    }

    const untouched = r.areas.filter((a) => a.pickers === 0).map((a) => a.label);
    if (untouched.length && untouched.length < r.areas.length) {
      out.push(`Nobody has picked ${listOf(untouched)} yet.`);
    }

    if (r.combos[0]?.count > 1) {
      out.push(`The most common mix is ${r.combos[0].label} (${r.combos[0].count} members).`);
    }
    out.push(`Members pick ${r.avgPicks} areas on average.`);
  }

  // SAID vs DID: an area read far more than it is picked is hidden demand, the reverse is a read
  // that is not pulling its weight.
  if (r.readsTotal >= 5) {
    const mostRead = [...r.areas].sort((a, b) => b.reads - a.reads)[0];
    out.push(`Most opened read in the last 30 days: ${mostRead.label} (${mostRead.reads} visits from ${mostRead.readers} ${mostRead.readers === 1 ? "member" : "members"}).`);
    if (r.pickersTotal >= 5) {
      const hidden = r.areas.find((a) => a.readShare - a.pickShare >= 15 && a.reads >= 3);
      if (hidden) out.push(`Hidden demand: ${hidden.label} is ${hidden.readShare}% of all area reads but only ${hidden.pickShare}% of members pick it. They want it more than they say.`);
      const flat = r.areas.find((a) => a.pickShare - a.readShare >= 25 && a.pickers >= 3);
      if (flat) out.push(`${cap(flat.label)} is picked by ${flat.pickShare}% but gets only ${flat.readShare}% of reads, so members want it and the read itself is not pulling them in.`);
    }
  }
  return out;
}

function nextMovesFor(r: SznReport): string[] {
  if (r.pickersTotal === 0) {
    return [
      "Nothing to act on yet. Open this page again once a handful of members have picked.",
      "If adoption is still low after a week, mention customise my szn in the next email and in the chat rooms.",
    ];
  }
  const [a, b] = r.areas.filter((x) => x.pickers > 0);
  const moves = [
    `Make ${a.label} the theme of the next masterclass and the opening of the next email, since it is the clearest thing members are asking for.`,
  ];
  if (b) {
    const pairedOften = r.combos[0]?.count > 1 && r.combos[0].label === [a.label, b.label].sort().join(" + ");
    moves.push(
      pairedOften
        ? `Line up ${b.label} as the follow-on and pair the two where you can, because ${a.label} + ${b.label} is the most common mix.`
        : `Line up ${b.label} as the follow-on, it is the second most wanted area.`,
    );
  }
  if (r.adoption.eligible > 0 && r.adoption.rate < 50) {
    moves.push(`${r.adoption.notYet} eligible ${r.adoption.notYet === 1 ? "member hasn't" : "members haven't"} picked yet. A nudge in the rooms or the next email ("tell your dashboard what you want more of") will lift that.`);
  }
  return moves;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function listOf(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}
