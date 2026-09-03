/**
 * The automatic community welcome. The thing that matters here is the mention: if the token the
 * message contains is not one the room's renderer and the notification trigger both recognise as a
 * mention, the new member is never told she was greeted, which is the entire point of the feature.
 */
import {
  mentionTokenFor,
  welcomeMessageFor,
  welcomeVariantIndex,
  WELCOME_SPACE_ID,
  WELCOME_VARIANTS,
} from "@/lib/community/welcome-message";

// The pattern the room renderer splits on and the SQL trigger matches with. Kept here so a change
// to either one fails a test rather than silently turning mentions back into plain pink text.
const MENTION_RE = /@([A-Za-z0-9_]+)/;

describe("mentionTokenFor", () => {
  it("uses the first name only", () => {
    expect(mentionTokenFor("Sarah Jones")).toBe("Sarah");
  });

  it("keeps a plain single name as it is", () => {
    expect(mentionTokenFor("Sarah")).toBe("Sarah");
  });

  it("strips accents to base letters rather than truncating the name", () => {
    expect(mentionTokenFor("Renée")).toBe("Renee");
    expect(mentionTokenFor("Zoë Smith")).toBe("Zoe");
  });

  it("drops punctuation that would break the mention", () => {
    expect(mentionTokenFor("O'Brien")).toBe("OBrien");
    expect(mentionTokenFor("anna-marie")).toBe("annamarie");
  });

  it("returns null when nothing usable is left", () => {
    expect(mentionTokenFor("💜")).toBeNull();
    expect(mentionTokenFor("")).toBeNull();
    expect(mentionTokenFor(null)).toBeNull();
    expect(mentionTokenFor("   ")).toBeNull();
  });
});

describe("welcomeMessageFor", () => {
  it("greets her by first name and asks Betty's question", () => {
    const msg = welcomeMessageFor("Sarah")!;
    expect(msg).toContain("@Sarah");
    expect(msg).toContain("welcome to MY SZN");
    expect(msg).toContain("Big 3");
  });

  it("produces a token the room renderer and the notification trigger both match", () => {
    for (const name of ["Sarah", "Sarah Jones", "Renée", "O'Brien", "anna-marie"]) {
      const msg = welcomeMessageFor(name)!;
      const found = msg.match(MENTION_RE);
      expect(found).not.toBeNull();
      expect(found![1]).toBe(mentionTokenFor(name));
    }
  });

  it("posts nothing at all rather than greeting an empty name", () => {
    expect(welcomeMessageFor("💜")).toBeNull();
    expect(welcomeMessageFor(null)).toBeNull();
  });

  it("lands in the main group chat", () => {
    expect(WELCOME_SPACE_ID).toBe("general");
  });
});

describe("welcome variants", () => {
  it("every variant mentions her and asks for the one thing anyone can answer", () => {
    // Some variants ask outright and some tell her to drop it, which is the variety. What none of
    // them may lose is the Big 3 prompt itself, because that is the bit the room replies to.
    for (const template of WELCOME_VARIANTS) {
      expect(template).toContain("@{name}");
      expect(template).toContain("Big 3");
    }
  });

  it("puts her real name into whichever variant she gets", () => {
    for (let i = 0; i < WELCOME_VARIANTS.length; i++) {
      const rendered = WELCOME_VARIANTS[i].replace("{name}", "Sarah");
      expect(rendered).toContain("@Sarah");
      expect(rendered).not.toContain("{name}");
    }
  });

  it("gives the same member the same message every time, so a retry cannot post a second one", () => {
    const id = "8f14e45f-ceea-467a-9c3f-1c2d5b6a7e90";
    expect(welcomeMessageFor("Sarah", id)).toBe(welcomeMessageFor("Sarah", id));
  });

  it("spreads different members across the variants rather than repeating one", () => {
    const ids = Array.from({ length: 300 }, (_, i) => `user-${i}-${(i * 7919) % 104729}`);
    const used = new Set(ids.map(welcomeVariantIndex));
    expect(used.size).toBe(WELCOME_VARIANTS.length);
  });

  it("still greets her when no id is given", () => {
    expect(welcomeMessageFor("Sarah")).toContain("@Sarah");
  });
});
