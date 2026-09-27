import { handleMatchesName, mentionsAll, mentionTokenFor, fullMentionTokenFor } from "@/lib/community/mention-tokens";

// A tag has to lead to the member it names. The welcome writes "@Jessica" for Jessica Moody, and
// "@JessicaMoody" when another Jessica has joined, so both have to find her, and so does the name
// as the feed prints it.
describe("a tag finds the member it names", () => {
  it("matches a first-name mention, a full-name mention and the plain name", () => {
    for (const handle of ["jessica", "jessicamoody", "jessica moody", "JESSICA"]) {
      expect(handleMatchesName(handle, "Jessica Moody")).toBe(true);
    }
  });

  it("matches through accents, the way the welcome strips them", () => {
    expect(mentionTokenFor("Renée Smith")).toBe("Renee");
    expect(fullMentionTokenFor("Renée Smith")).toBe("ReneeSmith");
    expect(handleMatchesName("renee", "Renée Smith")).toBe(true);
  });

  it("does not match someone else", () => {
    expect(handleMatchesName("jess", "Jessica Moody")).toBe(false);
    expect(handleMatchesName("moody", "Jessica Moody")).toBe(false);
    expect(handleMatchesName("", "Jessica Moody")).toBe(false);
    expect(handleMatchesName("jessica", null)).toBe(false);
  });
});

describe("@all", () => {
  it("is spotted wherever it sits in a message", () => {
    expect(mentionsAll("@all class starts in 10")).toBe(true);
    expect(mentionsAll("hey @ALL the replay is up")).toBe(true);
    expect(mentionsAll("hi everyone (@all)")).toBe(true);
  });

  it("is not set off by a longer word or an email address", () => {
    expect(mentionsAll("hey @allison")).toBe(false);
    expect(mentionsAll("write to me at hello@allsorts.com")).toBe(false);
    expect(mentionsAll("all of you")).toBe(false);
  });
});
