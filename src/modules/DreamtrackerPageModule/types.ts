import type { DreamTrackerItem } from "@/lib/api-types";

export type ActiveView =
  | { type: "university"; tracker: DreamTrackerItem }
  | { type: "funding"; fundingId: string; tracker: DreamTrackerItem }
  | null;
