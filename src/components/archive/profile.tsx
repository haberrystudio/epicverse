import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronRight, MapPin } from "lucide-react";
import {
  byId,
  chapters,
  edgesOf,
  other,
  relatives,
  roman,
  sources,
} from "@/data/archive";
import type { Character } from "@/data/schema";
import { labels } from "@/data/schema";

export function Profile({
  person: p,
  onPerson,
}: {
  person: Character;
  onPerson?: (id: string) => void;
}) {
  const grouped = relatives(p);
  const events = p.events.length ? p.events : [];
  const groupedRefs = new Set([
    ...p.sources,
    ...edgesOf(p.id).map((e) => e.reference),
  ]);
  const notes = edgesOf(p.id).filter((e) => e.note);
  return (
    <article className="profile" key={p.id}>
      <div className="profile-intro">
        <Image
          src={"/art/" + p.portrait + ".webp"}
          width={184}
          height={210}
          alt={"Illustration for " + p.name}
        />
        <div>
          <span className="eyebrow">
            Character folio · {roman(p.generation)}
          </span>
          <h2>{p.name}</h2>
          <p className="profile-title">{p.title}</p>
          {p.aliases.length > 0 && (
            <p className="muted">Also known as {p.aliases.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="profile-meta">
        <span>{p.dynasty}</span>
        <span>{chapters[p.chapter][0]}</span>
        {p.kingdom && (
          <span>
            <MapPin size={13} /> {p.kingdom}
          </span>
        )}
      </div>
      <section>
        <h3>Biography</h3>
        <p>{p.biography}</p>
        {p.skills.length > 0 && (
          <p>
            <strong>Skills and arms</strong> · {p.skills.join(", ")}
          </p>
        )}
      </section>
      {events.length > 0 && (
        <section>
          <h3>Life chronicle</h3>
          <ol className="timeline">
            {events.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ol>
        </section>
      )}
      <section>
        <h3>Family &amp; connections</h3>
        {[...grouped].map(([label, people]) => (
          <div className="kin-group" key={label}>
            <h4>{label}</h4>
            <div>
              {[...people].map((c) =>
                onPerson ? (
                  <button key={c.id} onClick={() => onPerson(c.id)}>
                    {c.name}
                    <ChevronRight size={12} />
                  </button>
                ) : (
                  <Link key={c.id} href={"/characters/" + c.id}>
                    {c.name}
                    <ChevronRight size={12} />
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </section>
      {notes.length > 0 && (
        <section>
          <h3>Reading the relationships</h3>
          {notes.map((e) => (
            <p key={e.id}>
              <strong>
                {other(p.id, e).name} · {labels[e.kind]}
              </strong>
              <br />
              {e.note}{" "}
              <a
                href={sources[e.reference].url}
                target="_blank"
                rel="noreferrer"
              >
                {sources[e.reference].name} ↗
              </a>
            </p>
          ))}
        </section>
      )}
      <section>
        <h3>
          <BookOpen size={17} /> Sources
        </h3>
        <p className="muted">
          Kisari Mohan Ganguli’s English translation of the Mahabharata.
        </p>
        {[...groupedRefs].map((id) => (
          <a
            className="source"
            key={id}
            href={sources[id].url}
            target="_blank"
            rel="noreferrer"
          >
            {sources[id].name}
            <ArrowUpRight size={14} />
          </a>
        ))}
      </section>
      {onPerson && byId.has(p.id) && (
        <Link className="text-action" href={"/characters/" + p.id}>
          Open permanent character page <ArrowUpRight size={14} />
        </Link>
      )}
    </article>
  );
}
