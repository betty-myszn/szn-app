import { listedRooms, seasonRoom, findRoom, ALL_ROOMS, SIGN_ROOMS, isRitualSpace } from "@/lib/community-store";

// The hub used to list all 20 rooms, 8 topic spaces and one per zodiac sign, which at this size
// meant almost every room anyone opened was empty. The listing was cut to a short set; the rooms
// themselves were NOT deleted. These tests hold both halves of that: the listing stays short, and
// nothing that was ever posted becomes unreachable.

describe("listed rooms", () => {
  it("lists a short set, not the whole catalogue", () => {
    const rooms = listedRooms("Virgo");
    expect(rooms.length).toBeLessThanOrEqual(6);
    expect(ALL_ROOMS.length).toBeGreaterThan(rooms.length);
  });

  it("leads with the open rooms and puts the rituals last", () => {
    const ids = listedRooms("Virgo").map((r) => r.id);
    expect(ids).toEqual(["general", "wins", "astrology", "virgo", "events"]);
    const firstRitual = ids.findIndex((id) => isRitualSpace(id));
    const lastOpen = ids.map((id) => isRitualSpace(id)).lastIndexOf(false);
    expect(firstRitual).toBeGreaterThan(lastOpen - 1);
  });

  it("shows exactly one sign room, the season's own, relabelled for it", () => {
    const rooms = listedRooms("Virgo");
    const signRooms = rooms.filter((r) => SIGN_ROOMS.some((s) => s.id === r.id));
    expect(signRooms).toHaveLength(1);
    expect(signRooms[0].id).toBe("virgo");
    expect(signRooms[0].label).toBe("virgo szn room");
  });

  it("follows the season, keeping the sign room's existing id so its history carries over", () => {
    expect(listedRooms("Libra").map((r) => r.id)).toContain("libra");
    expect(listedRooms("Libra").map((r) => r.id)).not.toContain("virgo");
    // The id matches the room that already existed, rather than a new empty one.
    expect(SIGN_ROOMS.some((r) => r.id === "libra")).toBe(true);
  });

  it("copes with an unknown or missing season rather than dropping the whole list", () => {
    for (const season of [null, undefined, "", "Ophiuchus"]) {
      const rooms = listedRooms(season);
      expect(rooms.map((r) => r.id)).toEqual(["general", "wins", "astrology", "events"]);
    }
    expect(seasonRoom("Ophiuchus")).toBeNull();
  });

  it("keeps every retired room reachable, so old links and old messages still resolve", () => {
    for (const id of ["business", "mce", "bookclub", "challenges", "aries", "pisces"]) {
      expect(findRoom(id)).toBeDefined();
      expect(listedRooms("Virgo").some((r) => r.id === id)).toBe(false);
    }
  });

  it("still knows about all twenty rooms for lookups and moderation", () => {
    expect(ALL_ROOMS.length).toBe(20);
    expect(SIGN_ROOMS.length).toBe(12);
  });
});
