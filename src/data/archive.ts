import { characters } from "./universes/mahabharata/characters";
import { relationships } from "./universes/mahabharata/relationships";
import { chapters, sources } from "./universes/mahabharata/sources";
import { type Character, type Kind, type Relationship, labels } from "./schema";
export { characters, relationships, chapters, sources };
export const byId = new Map(characters.map((c) => [c.id, c]));
export const dynasties = [
  ...new Set(
    characters.map((c) => c.dynasty).filter((d) => d !== "Unrecorded"),
  ),
].sort();
export const branches = [...new Set(characters.map((c) => c.branch))];
export const generationNumbers = [
  ...new Set(characters.map((c) => c.generation)),
].sort((a, b) => a - b);
const adjacent = new Map<string, Relationship[]>();
if (
  byId.size !== characters.length ||
  new Set(relationships.map((r) => r.id)).size !== relationships.length
)
  throw Error("Duplicate archive ID");
for (const c of characters)
  if (!chapters[c.chapter] || c.sources.some((s) => !sources[s]))
    throw Error("Invalid character reference: " + c.id);
for (const edge of relationships) {
  if (
    !byId.has(edge.source) ||
    !byId.has(edge.target) ||
    !sources[edge.reference] ||
    edge.source === edge.target
  )
    throw Error("Invalid relationship: " + edge.id);
  for (const id of [edge.source, edge.target]) {
    const list = adjacent.get(id) ?? [];
    list.push(edge);
    adjacent.set(id, list);
  }
}
export const edgesOf = (id: string) => adjacent.get(id) ?? [];
export const other = (id: string, e: Relationship) =>
  byId.get(e.source === id ? e.target : e.source)!;
export function relatives(c: Character) {
  const groups = new Map<string, Set<Character>>();
  function add(label: string, person: Character) {
    if (person.id === c.id) return;
    const set = groups.get(label) ?? new Set();
    set.add(person);
    groups.set(label, set);
  }
  const parents = (id: string) =>
    edgesOf(id).filter(
      (r) => r.target === id && ["birth", "divine"].includes(r.kind),
    );
  const familyParents = parents(c.id);
  for (const e of edgesOf(c.id)) {
    const incoming = e.target === c.id,
      p = other(c.id, e);
    const group: Record<Kind, string> = {
      birth: incoming
        ? p.gender === "Female"
          ? "Birth mother"
          : "Birth father"
        : "Children",
      marriage: "Spouses",
      divine: incoming ? "Divine parentage" : "Divine children",
      social: incoming ? "Dynastic father" : "Dynastic children",
      guardian: incoming ? "Guardians" : "Wards",
      adoption: incoming ? "Adoptive parents" : "Adopted children",
      variant: "Alternate textual connection",
      teacher: incoming ? "Teachers" : "Students",
      ally: "Allies",
      rival: "Rivals",
    };
    add(group[e.kind], p);
  }
  for (const e of familyParents) {
    for (const g of parents(e.source)) add("Grandparents", byId.get(g.source)!);
    for (const sibling of edgesOf(e.source).filter(
      (r) => r.source === e.source && ["birth", "divine"].includes(r.kind),
    )) {
      const parentSet = parents(sibling.target);
      const overlap = parentSet.filter((p) =>
        familyParents.some((q) => q.source === p.source),
      ).length;
      add(
        overlap >= 2
          ? "Siblings"
          : parentSet.length >= 2 && familyParents.length >= 2
            ? "Half-siblings"
            : "Siblings sharing a recorded parent",
        byId.get(sibling.target)!,
      );
    }
  }
  for (const edge of edgesOf(c.id).filter(e => e.target === c.id && e.kind === "social")) {
    for (const kin of edgesOf(edge.source)) {
      if (kin.source === edge.source && kin.kind === "social") add("Siblings of the royal house", byId.get(kin.target)!);
      if (kin.target === edge.source && ["birth", "divine", "social"].includes(kin.kind)) add("Grandparents of the royal house", byId.get(kin.source)!);
    }
  }
  return groups;
}
export function familyIds(id: string) {
  const ids = new Set([id]);
  const c = byId.get(id);
  if (c)
    for (const [label, people] of relatives(c))
      if (
        ![
          "Grandparents",
          "Grandparents of the royal house",
          "Teachers",
          "Students",
          "Rivals",
          "Allies",
          "Alternate textual connection",
        ].includes(label)
      )
        for (const p of people) ids.add(p.id);
  return ids;
}
const textIndex = characters.map((person) => ({
  person,
  own: [person.name, ...person.aliases, person.title].join(" ").toLowerCase(),
  extended: [
    person.dynasty,
    person.branch,
    ...edgesOf(person.id)
      .filter((e) =>
        ["birth", "marriage", "adoption", "social", "divine"].includes(e.kind),
      )
      .map((e) => other(person.id, e).name),
  ]
    .join(" ")
    .toLowerCase(),
}));
export function searchArchive(term: string) {
  const q = term.trim().toLowerCase();
  if (!q) return characters;
  return textIndex
    .map((i) => ({
      person: i.person,
      rank:
        i.person.name.toLowerCase() === q
          ? 0
          : i.own.includes(q)
            ? 1
            : i.extended.includes(q)
              ? 2
              : 3,
    }))
    .filter((i) => i.rank < 3)
    .sort((a, b) => a.rank - b.rank)
    .map((i) => i.person);
}
export const treeKinds = (Object.keys(labels) as Kind[]).filter(
  (k) => !["teacher", "ally", "rival"].includes(k),
);
export function roman(n: number) {
  const pairs: [number, string][] = [
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let s = "";
  for (const [v, t] of pairs) {
    while (n >= v) {
      s += t;
      n -= v;
    }
  }
  return s;
}
