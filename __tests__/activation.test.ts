import { activationState, markActivationStep, reportActivationComplete } from "@/lib/activation";

// The activation steps are the first numbers the trial funnel has ever had between sign_up and
// purchase, so the counting has to be right: a step must record exactly once, a blocked or broken
// localStorage must degrade to "nothing done" rather than throwing on a dashboard render, and the
// goal step must follow her real goals rather than a flag that can drift from them.
//
// The lib is browser-only and the suite runs on node, so window and its storage are stood up here.

type Store = Record<string, string>;

function installWindow(store: Store, opts: { throwOnWrite?: boolean; throwOnRead?: boolean } = {}) {
  (globalThis as { window?: unknown }).window = {
    localStorage: {
      getItem(key: string) {
        if (opts.throwOnRead) throw new Error("blocked");
        return key in store ? store[key] : null;
      },
      setItem(key: string, value: string) {
        if (opts.throwOnWrite) throw new Error("blocked");
        store[key] = value;
      },
    },
  };
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe("activation", () => {
  it("counts nothing done for a member who has just arrived", () => {
    installWindow({});
    const state = activationState(false);
    expect(state).toMatchObject({ reading: false, room: false, goal: false, done: 0, all: false });
  });

  it("records a step once and only once", () => {
    installWindow({});
    expect(markActivationStep("room")).toBe(true);
    expect(markActivationStep("room")).toBe(false);
    expect(activationState(false)).toMatchObject({ room: true, done: 1, all: false });
  });

  it("keeps the steps independent", () => {
    installWindow({});
    markActivationStep("reading");
    const state = activationState(false);
    expect(state.reading).toBe(true);
    expect(state.room).toBe(false);
  });

  it("reads the goal step from her real goals, not from storage", () => {
    installWindow({});
    expect(activationState(true)).toMatchObject({ goal: true, done: 1 });
    // Goal deleted: the step un-ticks, because it reflects what is actually there.
    expect(activationState(false)).toMatchObject({ goal: false, done: 0 });
  });

  it("completes only when all three are done", () => {
    const store: Store = {};
    installWindow(store);
    markActivationStep("reading");
    markActivationStep("room");
    expect(activationState(false).all).toBe(false);
    expect(activationState(true)).toMatchObject({ done: 3, all: true });
  });

  it("reports completion exactly once per browser", () => {
    const store: Store = {};
    installWindow(store);
    reportActivationComplete();
    const afterFirst = { ...store };
    reportActivationComplete();
    expect(store).toEqual(afterFirst);
  });

  it("degrades to nothing done when storage is unavailable, rather than throwing", () => {
    installWindow({}, { throwOnRead: true });
    expect(() => activationState(false)).not.toThrow();
    expect(activationState(false).done).toBe(0);

    installWindow({}, { throwOnWrite: true });
    expect(() => markActivationStep("room")).not.toThrow();
    expect(markActivationStep("room")).toBe(false);
  });

  it("does nothing at all when there is no window, so a server render is safe", () => {
    delete (globalThis as { window?: unknown }).window;
    expect(markActivationStep("room")).toBe(false);
    expect(activationState(true)).toMatchObject({ goal: true, done: 1 });
  });
});
