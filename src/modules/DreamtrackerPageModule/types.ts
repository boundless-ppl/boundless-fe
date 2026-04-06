import type { DreamFunding, DreamTrackerItem } from "@/lib/api-types";

export type ActiveView =
  | { type: "university"; tracker: DreamTrackerItem }
  | { type: "funding"; funding: DreamFunding; tracker: DreamTrackerItem }
  | null;
