// Tools hub — the tile grid behind the default "Tools" segment of the Tools tab
// (DiscoverScreen → ToolsHubView). Mirrors the client "Tools FFIE" mockup: two
// sections of shortcut tiles that launch the federation's trade tools.
//
// A tile leads to one of two places:
//   • { type: "calculator" } → a working calculator sheet (members only). Today
//     two exist — Power & current and Voltage drop — both already built in
//     CalculatorsView and reused here. ("Falling tension" is the client's label
//     for the voltage-drop tool — chute de tension.)
//   • { type: "soon" } → a tool FFIE has not shipped yet. These render as full
//     tiles but open an honest "coming soon" sheet rather than inventing
//     functionality (CLAUDE.md: no fabricated real-world data / behaviour).
//
// To change the grid, edit TOOL_SECTIONS — order is row-major within each
// section (the screen lays the tiles out two-up).

import {
  Cable,
  ClipboardList,
  FileCheck,
  IdCard,
  Sparkles,
  Sun,
  TrendingDown,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import type { CalculatorKind } from "./calculators";

// Where a tile leads. "calculator" tiles open a working sheet (members only);
// "soon" tiles open the coming-soon state.
export type ToolAction =
  | { type: "calculator"; kind: CalculatorKind }
  | { type: "soon" };

export type ToolTile = {
  id: string;
  /** Tile label (client wording, verbatim from the mockup). */
  title: string;
  icon: LucideIcon;
  action: ToolAction;
};

export type ToolSection = {
  id: string;
  /** Section heading — rendered uppercase, like the mockup. */
  title: string;
  tiles: ReadonlyArray<ToolTile>;
};

export const TOOL_SECTIONS: ReadonlyArray<ToolSection> = [
  {
    id: "calculations",
    title: "Calculations & sizing",
    tiles: [
      { id: "cable-section", title: "Cable section calculator", icon: Cable, action: { type: "soon" } },
      { id: "power", title: "Power calculation", icon: Zap, action: { type: "calculator", kind: "power" } },
      { id: "lux", title: "Lighting & calculation lux", icon: Sun, action: { type: "soon" } },
      // "Falling tension" = chute de tension → the existing voltage-drop tool.
      { id: "voltage-drop", title: "Falling tension", icon: TrendingDown, action: { type: "calculator", kind: "voltage-drop" } },
    ],
  },
  {
    id: "compliance",
    title: "Help with compliance",
    tiles: [
      { id: "normative", title: "Normative references", icon: FileCheck, action: { type: "soon" } },
      { id: "intervention", title: "Intervention report", icon: ClipboardList, action: { type: "soon" } },
      { id: "assistant", title: "Assistant IA FFIE", icon: Sparkles, action: { type: "soon" } },
      { id: "member-card", title: "Members' Card", icon: IdCard, action: { type: "soon" } },
    ],
  },
];
