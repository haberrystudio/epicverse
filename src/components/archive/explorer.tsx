"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  GitFork,
  LayoutGrid,
  Layers3,
  Network,
  Search,
  SlidersHorizontal,
  Users,
  Waypoints,
} from "lucide-react";
import {
  chapters,
  characters,
  familyIds,
  roman,
  treeKinds,
} from "@/data/archive";
import { labels } from "@/data/schema";
import { useArchive } from "./store";
import { Dialog } from "./dialog";
import { Filters } from "./panels";

const Canvas = dynamic(() => import("./canvas"), {
  ssr: false,
  loading: () => <p className="loading">Opening the family tree…</p>,
});
export function Explorer({
  open,
  search,
  mode,
  setMode,
}: {
  open: (id: string) => void;
  search: () => void;
  mode: "tree" | "index";
  setMode: (m: "tree" | "index") => void;
}) {
  const s = useArchive();
  const [filters, setFilters] = useState(false);
  const focusedFamily = useMemo(
    () => (s.target ? familyIds(s.target) : null),
    [s.target],
  );
  const people = useMemo(
    () =>
      characters.filter(
        (p) =>
          (s.all || p.chapter === s.chapter || focusedFamily?.has(p.id)) &&
          (!p.register || s.expanded) &&
          !s.closed.includes(p.branch) &&
          (!s.filter.generation || p.generation === +s.filter.generation) &&
          (!s.filter.gender || p.gender === s.filter.gender) &&
          (!s.filter.dynasty || p.dynasty === s.filter.dynasty) &&
          (!s.filter.branch || p.branch === s.filter.branch) &&
          (!s.filter.major || p.major) &&
          (!s.filter.war || p.war),
      ),
    [s.all, s.chapter, s.expanded, s.closed, s.filter, focusedFamily],
  );
  const active =
    Object.values(s.filter).filter(Boolean).length + s.closed.length;
  return (
    <section id="explorer" className="explorer page-frame">
      <div className="explorer-intro">
        <div>
          <div className="eyebrow decorated">
            <span />
            The royal genealogy
          </div>
          <h2>Lineage Explorer</h2>
          <p>
            Follow the bloodlines, marriages, and divine bonds of the Kuru
            dynasty.
          </p>
        </div>
        <div className="mode-tabs" aria-label="Explorer view">
          <button
            aria-pressed={mode === "tree"}
            onClick={() => setMode("tree")}
          >
            <Network size={15} />
            Family tree
          </button>
          <button
            aria-pressed={mode === "index"}
            onClick={() => setMode("index")}
          >
            <LayoutGrid size={15} />
            Character index
          </button>
        </div>
      </div>
      <div className="workspace">
        <aside className="chapter-sidebar">
          <div className="sidebar-heading">
            <BookOpen size={16} />
            <span className="eyebrow">Dynasty chapters</span>
          </div>
          <div className="chapter-list">
            {chapters.map(([name], i) => (
              <button
                key={name}
                aria-current={!s.all && i === s.chapter ? "step" : undefined}
                onClick={() => s.changeChapter(i)}
              >
                <span>{roman(i + 1).padStart(2, " ")}</span>
                {name}
                <ChevronRight size={13} />
              </button>
            ))}
          </div>
          <button
            className={"all-link" + (s.all ? " active" : "")}
            onClick={s.setAll}
          >
            <Layers3 size={15} />
            {s.all ? "Return to chapter" : "View entire lineage"}
          </button>
          <div className="legend">
            <h3 className="eyebrow">Relationship key</h3>
            {treeKinds.map((kind) => (
              <button
                key={kind}
                className={!s.kinds.includes(kind) ? "off" : ""}
                aria-pressed={s.kinds.includes(kind)}
                onClick={() => s.toggleKind(kind)}
              >
                <i className={"line " + kind} />
                {labels[kind]}
              </button>
            ))}
          </div>
        </aside>
        <div className="workspace-main">
          <div className="workspace-tools">
            <button onClick={search}>
              <Search size={16} />
              Find a character<span className="shortcut">/</span>
            </button>
            <button onClick={() => setFilters(true)}>
              <SlidersHorizontal size={15} />
              Filters{active > 0 && <b>{active}</b>}
            </button>
          </div>
          {!people.length ? (
            <div className="empty">
              <Waypoints />
              <h3>No characters in this view</h3>
              <p>Choose another chapter or clear your filters.</p>
              <button className="secondary" onClick={s.reset}>
                Reset filters
              </button>
            </div>
          ) : mode === "tree" ? (
            <Canvas people={people} onOpen={open} />
          ) : (
            <div className="directory">
              <div className="eyebrow">{people.length} character records</div>
              <h3>{s.all ? "Character index" : chapters[s.chapter][0]}</h3>
              <div>
                {people.map((p) => (
                  <button key={p.id} onClick={() => open(p.id)}>
                    <Image
                      alt=""
                      src={"/art/" + p.portrait + ".webp"}
                      width={48}
                      height={52}
                    />
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.title}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {(s.chapter === 4 || s.all) && (
            <button className="register-toggle" onClick={s.expand}>
              <Users size={15} />
              {s.expanded ? "Collapse" : "Expand"} Kaurava register
            </button>
          )}
          <div className="canvas-foot">
            <span>
              <GitFork size={13} />
              {people.length} visible characters
            </span>
            <span>Ganguli edition</span>
          </div>
        </div>
      </div>
      {filters && (
        <Dialog title="Archive filters" close={() => setFilters(false)}>
          <Filters />
        </Dialog>
      )}
    </section>
  );
}
