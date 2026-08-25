import type { CapacitorConfig } from "@capacitor/cli";

// Wraps the live MY SZN web app in a native iOS/Android shell. Because the app is server-rendered
// with a live backend (Supabase, API routes), the shell loads the hosted site rather than a bundled
// static build. native-shell/ is just the required webDir with a loading fallback; server.url is
// what actually renders. Payments/IAP are deliberately not wired yet, this is the "get it running"
// scaffold. Change server.url to a dev machine URL for local testing.
const config: CapacitorConfig = {
  appId: "com.itsmyszn.app",
  appName: "MY SZN",
  webDir: "native-shell",
  backgroundColor: "#1a1a1a",
  server: {
    url: "https://itsmyszn.com",
    cleartext: false,
  },
};

export default config;
