"use client";

import { Component, type ReactNode } from "react";

// Keeps one broken dashboard section from taking the whole page down with it. Without this, a
// throw anywhere inside a section reaches the page's error boundary and the member sees "this page
// didn't load properly" instead of her season, which is how a stellium in one house blanked the
// dashboard for ten members in September 2026. A failed section now renders nothing, and the rest
// of the page carries on.
export default class SectionBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`dashboard section "${this.props.name}" failed and was hidden`, error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
