/**
 * Betty's daily Quantum Leap chat posts (Sagittarius SZN 2026): the copy rules, the timing and the
 * post-exactly-once guarantee, against a fake database so nothing reaches the real coven chat.
 */
jest.mock("@/lib/community/welcome-message", () => ({
  findWelcomeSender: jest.fn(async () => ({ id: "betty-id", name: "Betty" })),
}));

import { ensureTodaysLeapPost, leapPostContent, leapPostDueAt, leapPostId } from "@/lib/quantum-leap-posts";
import { QL_DAYS, QL_LIVE_AT } from "@/lib/quantum-leap";

type Row = { id: string; space_id: string; user_id: string; author: string; content: string };

function fakeAdmin(rows: Row[] = []) {
  const upserts: Row[] = [];
  const admin = {
    from: () => ({
      select: () => ({
        eq: (_col: string, id: string) => ({
          maybeSingle: async () => ({ data: rows.find((r) => r.id === id) ?? null }),
        }),
      }),
      upsert: async (row: Row) => {
        upserts.push(row);
        rows.push(row);
        return { error: null };
      },
    }),
  };
  return { admin: admin as never, upserts };
}

describe("quantum leap chat posts", () => {
  it("has a post for every one of the thirty days, linking to that day's page", () => {
    for (let n = 1; n <= QL_DAYS; n++) {
      const post = leapPostContent(n);
      expect(post).not.toBeNull();
      expect(post).toContain(`DAY ${n} OF ${QL_DAYS}`);
      expect(post).toContain(`https://itsmyszn.com/your-season/sagittarius/day-${n}`);
    }
    expect(leapPostContent(31)).toBeNull();
  });

  it("follows the copy rules: no em dashes, no questions, no sentence opening with And", () => {
    for (let n = 1; n <= QL_DAYS; n++) {
      const post = leapPostContent(n) as string;
      expect(post).not.toMatch(/[—–]/);
      expect(post).not.toContain("?");
      expect(post).not.toMatch(/(^|[.!]\s+)And\b/);
      expect(post.toLowerCase()).not.toMatch(/quietly|cosmic|\bdoor\b/);
    }
  });

  it("posts at 8am UK each day, never before the Sun enters Sagittarius", () => {
    expect(new Date(leapPostDueAt(1)).toISOString()).toBe("2026-11-22T08:00:00.000Z");
    expect(new Date(leapPostDueAt(30)).toISOString()).toBe("2026-12-21T08:00:00.000Z");
    expect(leapPostDueAt(1)).toBeGreaterThan(QL_LIVE_AT);
  });

  it("does nothing before the experiment or before 8am", async () => {
    const early = fakeAdmin();
    expect(await ensureTodaysLeapPost(early.admin, Date.parse("2026-11-20T09:00:00Z"))).toBe("not_due");
    expect(await ensureTodaysLeapPost(early.admin, Date.parse("2026-11-24T07:59:00Z"))).toBe("not_due");
    expect(await ensureTodaysLeapPost(early.admin, Date.parse("2026-12-22T09:00:00Z"))).toBe("not_due");
    expect(early.upserts).toHaveLength(0);
  });

  it("posts today's message once, from Betty, in the coven chat", async () => {
    const db = fakeAdmin();
    const at = Date.parse("2026-11-24T09:15:00Z"); // Day 3
    expect(await ensureTodaysLeapPost(db.admin, at)).toBe("posted");
    expect(await ensureTodaysLeapPost(db.admin, at + 60_000)).toBe("not_due");
    expect(db.upserts).toHaveLength(1);
    expect(db.upserts[0]).toMatchObject({ id: leapPostId(3), space_id: "general", user_id: "betty-id", author: "Betty" });
  });
});
