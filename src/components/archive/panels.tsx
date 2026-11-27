"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Search, BookOpen, Check } from "lucide-react";
import {
  branches,
  chapters,
  dynasties,
  generationNumbers,
  roman,
  searchArchive,
  sources,
  treeKinds,
} from "@/data/archive";
import { useArchive } from "./store";
import { labels } from "@/data/schema";
import { Toggle } from "@/components/ui/toggle";

export function SearchPanel({ onPick }: { onPick: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchArchive(query), [query]);
  const top = results.slice(0, 50);
  return (
    <div className="panel-body">
      <h2>Search the archive</h2>
      <label className="search-input">
        <Search size={18} />
        <input
          autoFocus
          aria-label="Search characters"
          placeholder="Name, title, dynasty, or relative…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="result-count" aria-live="polite">
        {query ? results.length + " matching records" : "Browse characters"}
        {results.length > 50 ? " · First 50 shown" : ""}
      </p>
      <div className="search-results">
        {top.map((c) => (
          <button onClick={() => onPick(c.id)} key={c.id}>
            <Image
              alt=""
              src={"/art/" + c.portrait + ".webp"}
              width={43}
              height={43}
            />
            <span>
              <strong>{c.name}</strong>
              <small>
                {c.title} · Gen. {roman(c.generation)}
              </small>
            </span>
            <ArrowRight size={16} />
          </button>
        ))}
        {!results.length && (
          <p>
            No matching characters. Try a shorter name, a title, or a relative.
          </p>
        )}
      </div>
    </div>
  );
}
export function Filters() {
  const s = useArchive();
  return (
    <div className="filter-body">
      <h3>Refine the lineage</h3>
      <div className="filter-grid">
        {(
          [
            ["generation", "Generation", generationNumbers.map(String)],
            ["dynasty", "Dynasty", dynasties],
            ["branch", "Family branch", branches],
            ["gender", "Gender", ["Female", "Male", "Collective"]],
          ] as const
        ).map(([key, label, items]) => (
          <label key={key}>
            {label}
            <select
              value={s.filter[key]}
              onChange={(e) => {
                if (key === "generation" && e.target.value && !s.all)
                  s.setAll();
                s.update({ [key]: e.target.value });
              }}
            >
              <option value="">All</option>
              {items.map((x) => (
                <option key={x} value={x}>
                  {key === "generation" ? roman(+x) : x}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="checks">
        <label>
          <input
            type="checkbox"
            checked={s.filter.major}
            onChange={(e) => s.update({ major: e.target.checked })}
          />{" "}
          Major characters
        </label>
        <label>
          <input
            type="checkbox"
            checked={s.filter.war}
            onChange={(e) => s.update({ war: e.target.checked })}
          />{" "}
          Kurukshetra participants
        </label>
      </div>
      <h4>Relationship layers</h4>
      <div className="filter-chips">
        {treeKinds.map((k) => (
          <Toggle
            key={k}
            pressed={s.kinds.includes(k)}
            onPressedChange={() => s.toggleKind(k)}
          >
            {s.kinds.includes(k) && <Check size={12} />} {labels[k]}
          </Toggle>
        ))}
      </div>
      <h4>Expanded family branches</h4>
      <div className="filter-chips">
        {branches.map((b) => (
          <Toggle
            key={b}
            pressed={!s.closed.includes(b)}
            onPressedChange={() => s.branchToggle(b)}
          >
            {b}
          </Toggle>
        ))}
      </div>
      <div className="checks">
        <label>
          <input type="checkbox" checked={s.expanded} onChange={s.expand} />{" "}
          Include the extended Kaurava register
        </label>
      </div>
      <button className="secondary" onClick={s.reset}>
        Reset filters
      </button>
    </div>
  );
}
export function About() {
  return (
    <div className="panel-body reading">
      <BookOpen className="gold" />
      <h2>The Kuru Dynasty</h2>
      <p className="deck">A lineage that shaped the destiny of Bharata.</p>
      <p>
        This archive follows the genealogy recited to Janamejaya. Begin with
        Yayati’s household, or enter a later chapter to trace a marriage, a
        contested inheritance, or the descendants who survived Kurukshetra.
      </p>
      <h3>Reading this edition</h3>
      <p>
        Generations count from Yayati. Spouses, guardians and deities are placed
        alongside the household they illuminate. The six chapters group these
        generations into episodes.
      </p>
      <p>
        The primary succession follows Ganguli’s Adi Parva XCV. Enable
        “Alternate account” to see the parallel account in XCIV. Ceremonial
        kinship and divine parentage have their own relationship lines.
      </p>
      <p>
        Portraits are interpretive illustrations. Lesser-documented figures
        share representative artwork. The Kaurava register preserves repeated
        names as separate entries in the order of section CXVII.
      </p>
      {["descent", "parallel", "kauravas"].map((s) => (
        <a
          className="source"
          target="_blank"
          rel="noreferrer"
          key={s}
          href={sources[s].url}
        >
          {sources[s].name} ↗
        </a>
      ))}
    </div>
  );
}
export function Chronicles({ open }: { open: (i: number) => void }) {
  return (
    <div className="panel-body reading">
      <h2>Dynasty chronicles</h2>
      <div className="chronicles">
        {chapters.map(([name, summary], i) => (
          <button key={name} onClick={() => open(i)}>
            <span className="eyebrow">Chapter {roman(i + 1)}</span>
            <strong>{name}</strong>
            <p>{summary}</p>
            <span className="text-action">
              Enter chapter <ArrowRight size={15} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
