/**
 * The automatic community welcome. The thing that matters here is the mention: if the token the
 * message contains is not one the room's renderer and the notification trigger both recognise as a
 * mention, the new member is never told she was greeted, which is the entire point of the feature.
 */
import {
  chunkForMessages,
  formatMentionList,
  groupWelcomeMessage,
  mentionTokenFor,
  resolveMentionTokens,
  welcomeMessageFor,
  welcomeVariantIndex,
  WELCOME_GROUP_VARIANTS,
  WELCOME_NAMES_PER_MESSAGE,
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

  it("gives the same seed the same message every time, so a retry cannot post a second one", () => {
    const id = "8f14e45f-ceea-467a-9c3f-1c2d5b6a7e90";
    expect(welcomeMessageFor("Sarah", id)).toBe(welcomeMessageFor("Sarah", id));
  });

  it("spreads different members across the variants rather than repeating one", () => {
    const ids = Array.from({ length: 300 }, (_, i) => `user-${i}-${(i * 7919) % 104729}`);
    // Called explicitly rather than passed to map: map would hand its index in as the pool size.
    const used = new Set(ids.map((id) => welcomeVariantIndex(id)));
    expect(used.size).toBe(WELCOME_VARIANTS.length);
  });

  it("still greets her when no id is given", () => {
    expect(welcomeMessageFor("Sarah")).toContain("@Sarah");
  });
});


describe("the daily group welcome", () => {
  const DAY = "2026-09-04";

  it("greets one joiner on her own rather than reading out a list of one", () => {
    const msg = groupWelcomeMessage(["Sarah"], DAY)!;
    expect(msg).toContain("@Sarah");
    expect(WELCOME_VARIANTS.some((t) => msg === t.replace("{name}", "Sarah"))).toBe(true);
  });

  it("names everyone who joined that day in one message", () => {
    const msg = groupWelcomeMessage(["Sarah", "Priya", "Jo"], DAY)!;
    expect(msg).toContain("@Sarah, @Priya and @Jo");
    expect(WELCOME_GROUP_VARIANTS.some((t) => msg === t.replace("{names}", "@Sarah, @Priya and @Jo"))).toBe(true);
  });

  it("does not render the same first name twice", () => {
    const msg = groupWelcomeMessage(["Sarah", "Sarah", "Jo"], DAY)!;
    expect(msg).toContain("@Sarah and @Jo");
  });

  it("keeps the Big 3 prompt in every group variant", () => {
    for (const template of WELCOME_GROUP_VARIANTS) {
      expect(template).toContain("{names}");
      expect(template).toContain("Big 3");
    }
  });

  it("reads different on different days", () => {
    const days = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06"];
    const seen = new Set(days.map((d) => groupWelcomeMessage(["Sarah", "Jo"], d)));
    expect(seen.size).toBeGreaterThan(1);
  });

  it("posts nothing when nobody has a usable name", () => {
    expect(groupWelcomeMessage([], DAY)).toBeNull();
  });

  it("splits a big day across messages instead of dropping anyone", () => {
    const joiners = Array.from({ length: WELCOME_NAMES_PER_MESSAGE + 3 }, (_, i) => `member${i}`);
    const groups = chunkForMessages(joiners);
    expect(groups).toHaveLength(2);
    expect(groups.flat()).toEqual(joiners);
    expect(groups[0]).toHaveLength(WELCOME_NAMES_PER_MESSAGE);
  });
});

describe("formatMentionList", () => {
  it("reads the way a person would say it", () => {
    expect(formatMentionList(["Sarah"])).toBe("@Sarah");
    expect(formatMentionList(["Sarah", "Jo"])).toBe("@Sarah and @Jo");
    expect(formatMentionList(["Sarah", "Jo", "Priya"])).toBe("@Sarah, @Jo and @Priya");
  });

  it("leaves every name matchable as a mention", () => {
    const list = formatMentionList(["Sarah", "Jo", "Priya"]);
    expect(list.match(/@([A-Za-z0-9_]+)/g)).toEqual(["@Sarah", "@Jo", "@Priya"]);
  });
});

describe("mention tokens when names collide", () => {
  it("uses a first name when nobody else shares it", () => {
    const tokens = resolveMentionTokens([{ id: "u1", name: "Brunilda" }], ["Brunilda", "Elana", "Logan"]);
    expect(tokens.get("u1")).toBe("Brunilda");
  });

  it("writes the full name when other members share the first name", () => {
    // Three Sarahs in the app. "@Sarah" would leave the room unable to tell which one was welcomed
    // and would link the mention to somebody else's profile.
    const tokens = resolveMentionTokens(
      [{ id: "u1", name: "Sarah Elizabeth" }],
      ["Sarah", "Sarah", "Sarah Elizabeth", "Logan"]
    );
    expect(tokens.get("u1")).toBe("SarahElizabeth");
  });

  it("still produces something a mention can match", () => {
    const tokens = resolveMentionTokens(
      [{ id: "u1", name: "Sarah Elizabeth" }],
      ["Sarah", "Sarah Elizabeth"]
    );
    expect(tokens.get("u1")).toMatch(/^[A-Za-z0-9_]+$/);
  });

  it("skips a member with no usable name rather than greeting an empty mention", () => {
    const tokens = resolveMentionTokens([{ id: "u1", name: "💜" }], ["💜"]);
    expect(tokens.has("u1")).toBe(false);
  });
});
