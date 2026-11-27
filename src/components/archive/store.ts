"use client";
import { create } from "zustand";
import { byId, treeKinds } from "@/data/archive";
import type { Kind } from "@/data/schema";
export type Filter = {
  dynasty: string;
  branch: string;
  gender: string;
  generation: string;
  major: boolean;
  war: boolean;
};
const clean: Filter = {
  dynasty: "",
  branch: "",
  gender: "",
  generation: "",
  major: false,
  war: false,
};
type State = {
  chapter: number;
  all: boolean;
  expanded: boolean;
  closed: string[];
  filter: Filter;
  kinds: Kind[];
  selected: string | null;
  target: string | null;
  move: number;
  changeChapter: (i: number) => void;
  setAll: () => void;
  expand: () => void;
  branchToggle: (name: string) => void;
  update: (values: Partial<Filter>) => void;
  toggleKind: (kind: Kind) => void;
  reset: () => void;
  locate: (id: string) => void;
  select: (id: string | null) => void;
  focus: (id: string) => void;
};
export const useArchive = create<State>((set) => ({
  chapter: 0,
  all: false,
  expanded: false,
  closed: [],
  filter: clean,
  kinds: treeKinds.filter((k) => k !== "variant"),
  selected: null,
  target: null,
  move: 0,
  changeChapter: (i) =>
    set((s) => ({
      chapter: i,
      all: false,
      filter: { ...s.filter, generation: "" },
      target: null,
      move: s.move + 1,
    })),
  setAll: () => set((s) => ({ all: !s.all, target: null, move: s.move + 1 })),
  expand: () => set((s) => ({ expanded: !s.expanded })),
  branchToggle: (name) =>
    set((s) => ({
      closed: s.closed.includes(name)
        ? s.closed.filter((i) => i !== name)
        : [...s.closed, name],
    })),
  update: (v) => set((s) => ({ filter: { ...s.filter, ...v }, target: null })),
  toggleKind: (k) =>
    set((s) => ({
      kinds: s.kinds.includes(k)
        ? s.kinds.filter((x) => x !== k)
        : [...s.kinds, k],
    })),
  reset: () =>
    set((s) => ({
      filter: clean,
      closed: [],
      kinds: treeKinds.filter((k) => k !== "variant"),
      expanded: false,
      target: null,
      move: s.move + 1,
    })),
  locate: (id) => {
    const p = byId.get(id);
    if (p)
      set((s) => ({
        chapter: p.chapter,
        all: false,
        filter: clean,
        kinds: treeKinds.filter((k) => k !== "variant"),
        closed: [],
        expanded: p.register,
        target: id,
        selected: id,
        move: s.move + 1,
      }));
  },
  focus: (id) => set((s) => ({ target: id, move: s.move + 1 })),
  select: (id) => set({ selected: id }),
}));
