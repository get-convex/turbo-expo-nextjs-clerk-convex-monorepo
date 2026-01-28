export type DataSourceDefinition = {
  source: "calendar" | "location" | "notifications" | "health";
  title: string;
  description: string;
  why: string;
  retentionOptions: number[];
  requires?: string;
};

export const DATA_SOURCE_CATALOG: DataSourceDefinition[] = [
  {
    source: "calendar",
    title: "Calendar",
    description: "Protects a short focus block without overfilling your day.",
    why: "Used to find a realistic window for your commitment.",
    retentionOptions: [7, 14, 30],
  },
  {
    source: "location",
    title: "Location",
    description: "Anchors cues to the right place and time.",
    why: "Used only for place-based reminders you opt into.",
    retentionOptions: [1, 7, 14],
  },
  {
    source: "notifications",
    title: "Notifications",
    description: "Delivers two gentle nudges when you want them.",
    why: "Used to schedule low-pressure reminders.",
    retentionOptions: [7, 14, 30],
  },
  {
    source: "health",
    title: "Health",
    description: "Lets completion be auto-confirmed from movement signals.",
    why: "Used only for habits you connect to HealthKit.",
    retentionOptions: [30, 90],
    requires: "Requires HealthKit entitlement",
  },
];
