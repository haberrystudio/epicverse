import { group } from "d3-array";
import type { Character, Relationship } from "@/data/schema";

export const cardW = 188,
  cardH = 72,
  rowGap = 162,
  columnGap = 230;
export type Point = { x: number; y: number };
export type Positioned = Point & { person: Character };
export function layout(people: Character[]) {
  const rows = [...group(people, (c) => c.generation)].sort(
    ([a], [b]) => a - b,
  );
  return rows.flatMap(([, members], r) =>
    members.map((person, i) => ({
      person,
      x: (i - (members.length - 1) / 2) * columnGap - cardW / 2,
      y: r * rowGap,
    })),
  );
}
export function pathFor(link: Relationship, a: Point, b: Point) {
  if (link.kind === "marriage") {
    const direction = a.x < b.x ? 1 : -1;
    const x1 = a.x + (direction === 1 ? cardW : 0),
      x2 = b.x + (direction === 1 ? 0 : cardW),
      y1 = a.y + cardH / 2,
      y2 = b.y + cardH / 2;
    if (Math.abs(x2 - x1) < columnGap)
      return {
        d: `M${x1} ${y1} L${x2} ${y2}`,
        mx: (x1 + x2) / 2,
        my: (y1 + y2) / 2,
      };
    const lane = Math.min(a.y, b.y) - 20;
    return {
      d: `M${x1} ${y1} h${12 * direction} V${lane} H${x2 - 12 * direction} V${y2} H${x2}`,
      mx: (x1 + x2) / 2,
      my: lane,
    };
  }
  const x1 = a.x + cardW / 2,
    x2 = b.x + cardW / 2,
    y1 = a.y + cardH,
    y2 = b.y,
    mid = (y1 + y2) / 2;
  return {
    d: `M${x1} ${y1} V${mid} H${x2} V${y2}`,
    mx: (x1 + x2) / 2,
    my: mid,
  };
}
