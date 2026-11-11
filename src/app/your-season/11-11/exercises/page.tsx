"use client";

import ElevenElevenExercises from "@/components/eleven-eleven/Exercises";
import { MembersOnly } from "@/components/eleven-eleven/Shared";

export default function Page() {
  return (
    <MembersOnly>
      <ElevenElevenExercises />
    </MembersOnly>
  );
}
