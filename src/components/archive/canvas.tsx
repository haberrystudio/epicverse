"use client";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Focus,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { chapters, familyIds, relationships, roman } from "@/data/archive";
import { labels, type Character, type Relationship } from "@/data/schema";
import { useArchive } from "./store";
import {
  cardH,
  cardW,
  layout,
  pathFor,
  type Positioned,
  type Point,
} from "./graph-layout";
import { useFlowBundle, FlowSurface } from "./flow-host";
export const PersonCard = memo(function PersonCard({
  p,
  active,
  dim,
  open,
  hover,
}: {
  p: Character;
  active: boolean;
  dim: boolean;
  open: (id: string) => void;
  hover: (id: string | null) => void;
}) {
  return (
    <button
      className={
        "person-card" + (active ? " chosen" : "") + (dim ? " subdued" : "")
      }
      aria-label={"Open " + p.name + " — " + p.title}
      onClick={() => open(p.id)}
      onMouseEnter={() => hover(p.id)}
      onMouseLeave={() => hover(null)}
      onFocus={() => hover(p.id)}
      onBlur={() => hover(null)}
      title={p.biography}
    >
      <Image
        alt=""
        src={"/art/" + p.portrait + ".webp"}
        width={48}
        height={52}
      />
      <span>
        <small>
          GEN. {roman(p.generation)} · {p.dynasty}
        </small>
        <strong>{p.name}</strong>
        <em>{p.title}</em>
      </span>
    </button>
  );
});
type View = Point & { zoom: number };
const limit = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, max));
export default function Canvas({
  people,
  onOpen,
}: {
  people: Character[];
  onOpen: (id: string) => void;
}) {
  const { chapter, target, selected, move, kinds, all, focus } = useArchive();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(850);
  const [height, setHeight] = useState(520);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<View>({ x: 425, y: 44, zoom: 1 });
  const [animate, setAnimate] = useState(false);
  const drag = useRef<{ x: number; y: number; view: View } | null>(null);
  const nodes = useMemo(() => layout(people), [people]);
  const positions = useMemo(
    () => new Map(nodes.map((n) => [n.person.id, n])),
    [nodes],
  );
  const edges = useMemo(
    () =>
      relationships.filter(
        (e) =>
          kinds.includes(e.kind) &&
          positions.has(e.source) &&
          positions.has(e.target),
      ),
    [kinds, positions],
  );
  const current = hover ?? selected;
  const connected = useMemo(
    () => (current ? familyIds(current) : null),
    [current],
  );
  const fitZoom = Math.min(1, Math.max(0.65, (width - 24) / (3 * 230 - 42)));
  const center = useCallback(
    (n: Positioned, zoom: number, y = height / 2) => ({
      x: width / 2 - (n.x + cardW / 2) * zoom,
      y: y - (n.y + cardH / 2) * zoom,
      zoom,
    }),
    [width, height],
  );
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width) {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const n = target ? positions.get(target) : null;
      setAnimate(true);
      setView(n ? center(n, 1) : { x: width / 2, y: 48, zoom: fitZoom });
    });
    return () => cancelAnimationFrame(frame);
  }, [target, move, width, fitZoom, center, positions]);
  const zoomAt = useCallback(
    (factor: number, x = width / 2, y = height / 2) =>
      setView((v) => {
        const z = limit(v.zoom * factor, 0.015, 2);
        return {
          x: x - ((x - v.x) * z) / v.zoom,
          y: y - ((y - v.y) * z) / v.zoom,
          zoom: z,
        };
      }),
    [width, height],
  );
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setAnimate(false);
      if (e.ctrlKey || e.metaKey) {
        const b = el.getBoundingClientRect();
        zoomAt(
          e.deltaY > 0 ? 0.88 : 1.12,
          e.clientX - b.left,
          e.clientY - b.top,
        );
      } else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [zoomAt]);
  function fit() {
    if (!nodes.length) return;
    const xs = nodes.map((n) => n.x),
      ys = nodes.map((n) => n.y),
      x = Math.min(...xs),
      y = Math.min(...ys),
      w = Math.max(...xs) - x + cardW,
      h = Math.max(...ys) - y + cardH;
    const z = Math.min((width - 36) / w, (height - 50) / h, 1.15);
    setAnimate(true);
    setView({
      x: (width - w * z) / 2 - x * z,
      y: (height - h * z) / 2 - y * z,
      zoom: z,
    });
  }
  const near = nodes.reduce<Positioned | undefined>((best, n) => {
    const distance = (v: Positioned) =>
      Math.abs((v.y + cardH / 2) * view.zoom + view.y - height * 0.3);
    return !best || distance(n) < distance(best) ? n : best;
  }, undefined);
  const gens = Array.from(new Set(nodes.map((n) => n.person.generation)));
  const currentGen = near?.person.generation ?? 0;
  function goGen(gen: number) {
    const n = nodes.find((x) => x.person.generation === gen);
    if (n) {
      setAnimate(true);
      setView(center(n, fitZoom, Math.min(height / 3, 130)));
    }
  }
  const visibleNodes = useMemo(
    () =>
      nodes.filter(
        (n) =>
          n.x + cardW > -view.x / view.zoom - 260 &&
          n.x < (width - view.x) / view.zoom + 260 &&
          n.y + cardH > -view.y / view.zoom - 180 &&
          n.y < (height - view.y) / view.zoom + 180,
      ),
    [nodes, view, width, height],
  );
  const host = useFlowBundle();
  const renderNode = useCallback(
    (n: Positioned) => (
      <PersonCard
        p={n.person}
        active={n.person.id === current}
        dim={!!connected && !connected.has(n.person.id)}
        open={onOpen}
        hover={setHover}
      />
    ),
    [connected, current, onOpen],
  );
  function edge(e: Relationship) {
    const a = positions.get(e.source)!,
      b = positions.get(e.target)!;
    const { d, mx, my } = pathFor(e, a, b);
    return (
      <g
        key={e.id}
        className={
          "edge " +
          e.kind +
          (current && (e.source === current || e.target === current)
            ? " lit"
            : "")
        }
      >
        <title>
          {a.person.name} · {labels[e.kind]} · {b.person.name}
        </title>
        <path d={d} />
        {e.kind === "marriage" && (
          <path className="diamond" d={`M${mx} ${my - 4} l4 4 -4 4 -4 -4Z`} />
        )}
      </g>
    );
  }
  const surface = (
    <>
      <svg className="wires" aria-hidden="true">
        {edges.map(edge)}
      </svg>
      {visibleNodes.map((n) => (
        <div
          key={n.person.id}
          className="node-position"
          style={{ left: n.x, top: n.y }}
        >
          {renderNode(n)}
        </div>
      ))}
    </>
  );
  return (
    <div className="canvas-wrap">
      <div className="canvas-heading">
        <span className="eyebrow">
          {all ? "Complete lineage" : "Chapter " + roman(chapter + 1)}
        </span>
        <h3>{all ? "The royal genealogy" : chapters[chapter][0]}</h3>
        <p>
          {all
            ? "Trace the recorded generations from Yayati to Janamejaya."
            : chapters[chapter][1]}
        </p>
      </div>
      <div
        className="graph"
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Interactive family tree. Drag to pan, scroll through generations, or use arrow keys."
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          const d: Record<string, Point> = {
            ArrowDown: { x: 0, y: -90 },
            ArrowUp: { x: 0, y: 90 },
            ArrowRight: { x: -90, y: 0 },
            ArrowLeft: { x: 90, y: 0 },
          };
          if (d[e.key]) {
            e.preventDefault();
            setView((v) => ({
              ...v,
              x: v.x + d[e.key].x,
              y: v.y + d[e.key].y,
            }));
          }
        }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button,select")) return;
          setAnimate(false);
          drag.current = { x: e.clientX, y: e.clientY, view };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const start = drag.current;
          if (start)
            setView({
              ...start.view,
              x: start.view.x + e.clientX - start.x,
              y: start.view.y + e.clientY - start.y,
            });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {host ? (
          <FlowSurface
            bundle={host}
            positions={positions}
            links={edges}
            viewport={view}
            current={current}
            renderNode={renderNode}
          />
        ) : (
          <div
            className={"graph-transform" + (animate ? " glide" : "")}
            style={{
              transform: `translate(${view.x}px,${view.y}px) scale(${view.zoom})`,
            }}
          >
            {surface}
          </div>
        )}
        <div className="graph-tools">
          <button
            aria-label="Zoom in"
            title="Zoom in"
            onClick={() => zoomAt(1.25)}
          >
            <Plus />
          </button>
          <span>{Math.round(view.zoom * 100)}%</span>
          <button
            aria-label="Zoom out"
            title="Zoom out"
            onClick={() => zoomAt(0.8)}
          >
            <Minus />
          </button>
          <i />
          <button
            aria-label="Fit visible tree"
            title="Fit visible tree"
            onClick={fit}
          >
            <Maximize />
          </button>
          <button
            aria-label="Reset view"
            title="Reset view"
            onClick={() => {
              setAnimate(true);
              setView({ x: width / 2, y: 48, zoom: fitZoom });
            }}
          >
            <RotateCcw />
          </button>
          {selected && positions.has(selected) && (
            <button
              aria-label="Focus selected character"
              title="Focus selected character"
              onClick={() => focus(selected)}
            >
              <Focus />
            </button>
          )}
        </div>
        <div className="gen-tools">
          <button
            title="Previous generation"
            aria-label="Previous generation"
            disabled={gens.indexOf(currentGen) <= 0}
            onClick={() => goGen(gens[gens.indexOf(currentGen) - 1])}
          >
            <ArrowUp />
          </button>
          <select
            aria-label="Jump to generation"
            value={currentGen}
            onChange={(e) => goGen(+e.target.value)}
          >
            {gens.map((g) => (
              <option key={g} value={g}>
                Gen. {roman(g)}
              </option>
            ))}
          </select>
          <button
            title="Next generation"
            aria-label="Next generation"
            disabled={gens.indexOf(currentGen) >= gens.length - 1}
            onClick={() => goGen(gens[gens.indexOf(currentGen) + 1])}
          >
            <ArrowDown />
          </button>
        </div>
      </div>
      <div className="mobile-people">
        <label className="mobile-jump">
          Jump to generation{" "}
          <select
            aria-label="Select mobile generation"
            defaultValue=""
            onChange={(e) =>
              document
                .getElementById("mobile-generation-" + e.target.value)
                ?.scrollIntoView({ block: "start" })
            }
          >
            <option value="">Choose…</option>
            {gens.map((g) => (
              <option key={g} value={g}>
                {roman(g)}
              </option>
            ))}
          </select>
        </label>
        {gens.map((g) => (
          <section key={g} id={"mobile-generation-" + g}>
            <p className="eyebrow">Generation {roman(g)}</p>
            {people
              .filter((p) => p.generation === g)
              .map((p) => (
                <button
                  data-mobile-id={p.id}
                  className={p.id === selected ? "picked" : ""}
                  key={p.id}
                  onClick={() => onOpen(p.id)}
                >
                  <Image
                    src={"/art/" + p.portrait + ".webp"}
                    width={45}
                    height={45}
                    alt=""
                  />
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.title}</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
              ))}
          </section>
        ))}
      </div>
    </div>
  );
}
