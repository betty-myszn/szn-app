import { houseForLongitude, houseForSign, longitudeForSignDegree, houseSpanNote } from "@/lib/interpretations";

// A chart whose cusps fall mid-sign, which is the normal case on Placidus. Every cusp here sits
// at 20 degrees of its sign, so each sign straddles two houses: the first 20 degrees of a sign
// belong to one house and the last 10 to the next.
const midSignCusps = [
  20,  // 1st: 20 Aries
  50,  // 2nd: 20 Taurus
  80,  // 3rd: 20 Gemini
  110, // 4th: 20 Cancer
  140, // 5th: 20 Leo
  170, // 6th: 20 Virgo
  200, // 7th: 20 Libra
  230, // 8th: 20 Scorpio
  260, // 9th: 20 Sagittarius
  290, // 10th: 20 Capricorn
  320, // 11th: 20 Aquarius
  350, // 12th: 20 Pisces
];

describe("longitudeForSignDegree", () => {
  it("converts a sign and degree to an ecliptic longitude", () => {
    expect(longitudeForSignDegree("Aries", 0)).toBe(0);
    expect(longitudeForSignDegree("Leo", 15)).toBe(135);
    expect(longitudeForSignDegree("Pisces", 4)).toBe(334);
  });

  it("returns null for a sign it does not recognise", () => {
    expect(longitudeForSignDegree("Ophiuchus", 4)).toBeNull();
  });
});

describe("houseForLongitude", () => {
  it("places a degree in the house that actually contains it", () => {
    expect(houseForLongitude(25, midSignCusps)).toBe(1); // 25 Aries, just past the 1st cusp
    expect(houseForLongitude(15, midSignCusps)).toBe(12); // 15 Aries, still the 12th
  });

  it("handles the wrap across 0 Aries", () => {
    expect(houseForLongitude(355, midSignCusps)).toBe(12); // 25 Pisces
    expect(houseForLongitude(5, midSignCusps)).toBe(12); // 5 Aries, same house, past the wrap
  });

  it("puts a whole sign in two different houses depending on the degree", () => {
    // Leo spans 120 to 150. The 5th cusp is at 140, so early Leo is the 4th and late Leo the 5th.
    expect(houseForLongitude(longitudeForSignDegree("Leo", 2)!, midSignCusps)).toBe(4);
    expect(houseForLongitude(longitudeForSignDegree("Leo", 27)!, midSignCusps)).toBe(5);
  });
});

describe("houseSpanNote", () => {
  it("stays silent when the event sign is the sign on the cusp", () => {
    expect(houseSpanNote("Aquarius", 1, "Aquarius", "eclipse")).toBe("");
  });

  it("explains, naming both signs, when they differ (interception)", () => {
    // Betty's case: Aquarius on the 1st cusp, Pisces intercepted inside the 1st.
    const note = houseSpanNote("Pisces", 1, "Aquarius", "lunar eclipse");
    expect(note).not.toBe("");
    expect(note).toContain("aquarius");
    expect(note).toContain("pisces");
    expect(note).toContain("1st house");
    expect(note).toContain("lunar eclipse");
  });

  it("is silent when the cusp sign is unknown", () => {
    expect(houseSpanNote("Pisces", 1, undefined, "eclipse")).toBe("");
  });

  it("uses no em dashes", () => {
    expect(houseSpanNote("Pisces", 1, "Aquarius", "new moon")).not.toContain("—");
  });
});

describe("houseForSign, the sign-midpoint version", () => {
  it("still measures from the middle of the sign", () => {
    // 15 Leo = 135, which is before the 5th cusp at 140, so the midpoint reads as the 4th.
    expect(houseForSign("Leo", midSignCusps)).toBe(4);
  });

  it("is why a late-degree eclipse used to be reported in the wrong house", () => {
    // This is the regression the degree-aware version fixes: an eclipse at 27 Leo genuinely
    // falls in the 5th, but placing it by its sign alone reported the 4th.
    const lateLeo = longitudeForSignDegree("Leo", 27)!;
    expect(houseForSign("Leo", midSignCusps)).toBe(4);
    expect(houseForLongitude(lateLeo, midSignCusps)).toBe(5);
    expect(houseForLongitude(lateLeo, midSignCusps)).not.toBe(houseForSign("Leo", midSignCusps));
  });
});

// Betty's own chart, and the reason the season guide read wrong: her 7th house cusp is in Leo, and
// the house is wide enough (125 to 200) to swallow the whole of Virgo, so Virgo is intercepted
// inside her Leo 7th house. Both Leo season and Virgo season put the season sun in the 7th, which
// is correct Placidus astrology but reads as a bug unless the interception is explained. The season
// guide now composes that explanation with houseSpanNote, exactly like the eclipse and moon reads.
const interceptedCusps = [305, 20, 45, 70, 95, 110, 125, 200, 225, 250, 275, 290];

describe("an intercepted season sign (Betty's 7th house)", () => {
  it("places both Leo and Virgo season in the same wide 7th house", () => {
    expect(houseForSign("Leo", interceptedCusps)).toBe(7);
    expect(houseForSign("Virgo", interceptedCusps)).toBe(7);
  });

  it("confirms the 7th cusp is Leo, so Virgo is the non-cusp (intercepted) sign", () => {
    // 125 = 5 Leo, so the sign on the 7th cusp is Leo, not Virgo.
    expect(houseForLongitude(125, interceptedCusps)).toBe(7);
    const note = houseSpanNote("Virgo", 7, "Leo", "season");
    expect(note).not.toBe("");
    expect(note).toContain("leo");
    expect(note).toContain("virgo");
    expect(note).toContain("7th house");
    expect(note).toContain("season");
  });

  it("stays silent when the season sign is the sign on the cusp", () => {
    // Leo season on a Leo 7th cusp needs no interception explainer.
    expect(houseSpanNote("Leo", 7, "Leo", "season")).toBe("");
  });
});
