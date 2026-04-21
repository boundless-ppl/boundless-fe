import type { DreamFunding, DreamTrackerItem } from "@/lib/api-types";

export type ActiveView =
  | { type: "university"; tracker: DreamTrackerItem }
  | { type: "funding"; fundingId: string; tracker: DreamTrackerItem }
  | { type: "funding-info"; funding: DreamFunding; baseTracker: DreamTrackerItem }
  | null;
