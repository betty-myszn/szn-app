"use client";

import HumanDesignReading from "@/components/HumanDesignReading";

// The standalone Human Design reading page (reached by members from /my-chart). The reading itself
// lives in the shared HumanDesignReading component so the exact same content also renders inside the
// combined free-chart results under the "human design" tab. memberNav shows the member-only links
// back to the astrology chart.
export default function HumanDesignPage() {
  return <HumanDesignReading memberNav />;
}
