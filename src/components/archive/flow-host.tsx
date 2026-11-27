"use client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as jsxRuntime from "react/jsx-runtime";
import type { Relationship } from "@/data/schema";
import { cardW, cardH, type Positioned, pathFor } from "./graph-layout";
type Viewport = { x: number; y: number; zoom: number };
type NodeData = { content: React.ReactNode };
type EdgeData = {
  link: Relationship;
  from: Positioned;
  to: Positioned;
  active: boolean;
};
type FlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
  width: number;
  height: number;
};
type FlowEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  sourceHandle: string;
  targetHandle: string;
  data: EdgeData;
};
type FlowBundle = {
  ReactFlow: React.ComponentType<{
    viewport: Viewport;
    nodes: FlowNode[];
    edges: FlowEdge[];
    nodeTypes: Record<string, React.ComponentType<{ data: NodeData }>>;
    edgeTypes: Record<string, React.ComponentType<{ data: EdgeData }>>;
    minZoom: number;
    maxZoom: number;
    panOnDrag: boolean;
    zoomOnScroll: boolean;
    zoomOnPinch: boolean;
    zoomOnDoubleClick: boolean;
    preventScrolling: boolean;
    nodesFocusable: boolean;
    nodesDraggable: boolean;
    nodesConnectable: boolean;
    onlyRenderVisibleElements: boolean;
  }>;
  Handle: React.ComponentType<{
    id: string;
    position: string;
    type: "source" | "target";
    isConnectable: boolean;
  }>;
};
type Global = Window & {
  React?: typeof React;
  ReactDOM?: typeof ReactDOM;
  jsxRuntime?: typeof jsxRuntime;
  ReactFlow?: FlowBundle;
};
let pending: Promise<FlowBundle | null> | undefined;
function loadFlow() {
  if (pending) return pending;
  pending = new Promise<FlowBundle | null>((resolve) => {
    const win = window as Global;
    win.React ??= React;
    win.ReactDOM ??= ReactDOM;
    win.jsxRuntime ??= jsxRuntime;
    if (win.ReactFlow?.ReactFlow) {
      resolve(win.ReactFlow);
      return;
    }
    const root = "https://cdn.jsdelivr.net/npm/@xyflow/react@12.8.5/dist/";
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = root + "style.css";
    const script = document.createElement("script");
    script.src = root + "umd/index.js";
    script.async = true;
    script.onload = () =>
      resolve(win.ReactFlow?.ReactFlow ? win.ReactFlow : null);
    script.onerror = () => resolve(null);
    document.head.append(css, script);
  });
  return pending;
}
export function useFlowBundle() {
  const [bundle, setBundle] = React.useState<FlowBundle | null>(null);
  React.useEffect(() => {
    let live = true;
    loadFlow().then((result) => {
      if (live) setBundle(result);
    });
    return () => {
      live = false;
    };
  }, []);
  return bundle;
}
const edgeTypes = {
  kinship: ({ data }: { data: EdgeData }) => {
    const { d, mx, my } = pathFor(data.link, data.from, data.to);
    return (
      <g className={"edge " + data.link.kind + (data.active ? " lit" : "")}>
        <path d={d} />
        {data.link.kind === "marriage" && (
          <path className="diamond" d={`M${mx} ${my - 4}l4 4 -4 4 -4 -4Z`} />
        )}
      </g>
    );
  },
};
export function FlowSurface({
  bundle,
  positions,
  links,
  viewport,
  current,
  renderNode,
}: {
  bundle: FlowBundle;
  positions: Map<string, Positioned>;
  links: Relationship[];
  viewport: Viewport;
  current: string | null;
  renderNode: (node: Positioned) => React.ReactNode;
}) {
  const nodeTypes = React.useMemo(
    () => ({
      person: ({ data }: { data: NodeData }) => (
        <>
          <bundle.Handle
            id="in"
            type="target"
            position="top"
            isConnectable={false}
          />
          {data.content}
          <bundle.Handle
            id="out"
            type="source"
            position="bottom"
            isConnectable={false}
          />
        </>
      ),
    }),
    [bundle],
  );
  const nodes = React.useMemo(
    () =>
      Array.from(positions, ([id, n]) => ({
        id,
        type: "person",
        position: { x: n.x, y: n.y },
        width: cardW,
        height: cardH,
        data: { content: renderNode(n) },
      })),
    [positions, renderNode],
  );
  const edges = React.useMemo(
    () =>
      links.map((link) => ({
        id: link.id,
        source: link.source,
        target: link.target,
        sourceHandle: "out",
        targetHandle: "in",
        type: "kinship",
        data: {
          link,
          from: positions.get(link.source)!,
          to: positions.get(link.target)!,
          active: link.source === current || link.target === current,
        },
      })),
    [links, positions, current],
  );
  return (
    <bundle.ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      viewport={viewport}
      minZoom={0.005}
      maxZoom={2}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      nodesFocusable={false}
      nodesDraggable={false}
      nodesConnectable={false}
      onlyRenderVisibleElements
    />
  );
}
