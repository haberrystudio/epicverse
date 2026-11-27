"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Crown,
  GitFork,
  Landmark,
  Layers3,
  MapPin,
  Menu,
  Network,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  branches,
  byId,
  characters,
  dynasties,
  generationNumbers,
} from "@/data/archive";
import { useArchive } from "./store";
import { Brand, Seal } from "./brand";
import { Dialog } from "./dialog";
import { About, Chronicles, SearchPanel } from "./panels";
import { Explorer } from "./explorer";
import { Profile } from "./profile";

type Panel = "search" | "about" | "chronicles" | "profile" | null;
const stats = [
  [UsersRound, characters.length, "Documented characters"],
  [Layers3, generationNumbers.length, "Generations"],
  [Crown, dynasties.length, "Dynastic affiliations"],
  [GitFork, branches.length, "Family branches"],
] as const;
export default function Archive() {
  const [panel, setPanel] = useState<Panel>(null),
    [mode, setMode] = useState<"tree" | "index">("tree"),
    [menu, setMenu] = useState(false),
    [history, setHistory] = useState<string[]>([]);
  const s = useArchive();
  const reduce = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const person = s.selected ? byId.get(s.selected) : null;
  function scrollTree() {
    document
      .getElementById("explorer")
      ?.scrollIntoView({ behavior: reduce ? "instant" : "smooth" });
  }
  function go(m: "tree" | "index") {
    setMode(m);
    setMenu(false);
    if (m === "index" && !s.all) s.setAll();
    scrollTree();
  }
  function select(id: string) {
    s.select(id);
    setHistory([]);
    setPanel("profile");
  }
  function locate(id: string) {
    s.locate(id);
    setPanel(null);
    setHistory([]);
    setMode("tree");
    scrollTree();
    window.setTimeout(() => {
      const mobile = document.querySelector<HTMLElement>(
        '[data-mobile-id="' + id + '"]',
      );
      if (mobile?.offsetParent)
        mobile.scrollIntoView({
          block: "center",
          behavior: reduce ? "instant" : "smooth",
        });
    }, 150);
  }
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      const target = e.target as HTMLElement;
      if (
        e.metaKey || e.ctrlKey
          ? e.key.toLowerCase() === "k"
          : e.key === "/" && !target.closest("input,textarea,select,dialog")
      ) {
        e.preventDefault();
        setMenu(false);
        setPanel("search");
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  useEffect(() => {
    if (!hero.current || reduce) return;
    let dispose: (() => void) | undefined;
    let active = true;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!active || !hero.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.to(".hero-art", {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: hero.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }, hero.current);
        dispose = () => ctx.revert();
      },
    );
    return () => {
      active = false;
      dispose?.();
    };
  }, [reduce]);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("character");
    if (id && byId.has(id)) {
      useArchive.getState().locate(id);
      document.getElementById("explorer")?.scrollIntoView();
    }
  }, []);
  return (
    <>
      <a className="skip" href="#explorer">
        Skip to the family tree
      </a>
      <header className="site-header">
        <div className="nav-inner">
          <a className="home-link" href="#top" aria-label="EPICVERSE home">
            <Brand />
          </a>
          <nav
            className={menu ? "nav-links show" : "nav-links"}
            aria-label="Archive navigation"
          >
            <button
              className={mode === "tree" ? "nav-active" : ""}
              onClick={() => go("tree")}
            >
              Lineage Explorer
            </button>
            <button
              className={mode === "index" ? "nav-active" : ""}
              onClick={() => go("index")}
            >
              Character Index
            </button>
            <button
              onClick={() => {
                setPanel("chronicles");
                setMenu(false);
              }}
            >
              Chronicles
            </button>
          </nav>
          <div className="nav-actions">
            <button className="nav-search" onClick={() => setPanel("search")}>
              <Search size={17} />
              <span>Search archive</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="hamburger"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="top">
        <section className="hero" ref={hero}>
          <Image
            className="hero-art"
            alt="An illustrated royal elephant approaches the sandstone palaces of Hastinapura."
            src="/art/hastinapura.webp"
            fill
            preload
            sizes="100vw"
          />
          <div className="hero-shade" />
          <div className="hero-inner page-frame">
            <motion.div
              className="hero-copy"
              initial={false}
              animate={{ opacity: 1 }}
            >
              <div className="eyebrow decorated">
                <span />
                The Great Bharata Dynasty
              </div>
              <h1>The Kuru Dynasty</h1>
              <p className="hero-tag">A Lineage of Destiny.</p>
              <div className="hero-ornament" aria-hidden="true">
                <i />
                <b /> <i />
              </div>
              <p className="hero-summary">
                Explore the generations, relationships, marriages, rivalries and
                descendants that shaped the Mahabharatam.
              </p>
              <div className="hero-actions">
                <button className="primary" onClick={() => go("tree")}>
                  <Network size={17} />
                  Explore the lineage
                  <ArrowRight size={15} />
                </button>
                <button
                  className="hero-secondary"
                  onClick={() => setPanel("about")}
                >
                  <BookOpen size={16} />
                  Discover the dynasty
                </button>
              </div>
            </motion.div>
          </div>
          <div className="location">
            <MapPin size={13} />
            Hastinapura <i /> The Kuru capital
          </div>
        </section>
        <section className="stats" aria-label="Archive statistics">
          <div className="page-frame">
            {stats.map(([Icon, count, label]) => (
              <div className="stat" key={label}>
                <Icon className="stat-icon" strokeWidth={1.15} />
                <div>
                  <b>{count}</b>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Explorer
          open={select}
          search={() => setPanel("search")}
          mode={mode}
          setMode={setMode}
        />
      </main>
      <footer className="page-frame">
        <div>
          <Seal size={23} />
          EPICVERSE
        </div>
        <button onClick={() => setPanel("about")}>
          <Landmark size={14} />
          About the archive
          <ChevronRight size={13} />
        </button>
      </footer>
      {panel && (
        <Dialog
          wide={panel === "profile"}
          title={
            panel === "profile"
              ? "Royal biography"
              : panel === "search"
                ? "Archive search"
                : panel === "about"
                  ? "About the dynasty"
                  : "The royal chronicles"
          }
          close={() => setPanel(null)}
        >
          {panel === "search" && <SearchPanel onPick={locate} />}{" "}
          {panel === "about" && <About />}
          {panel === "chronicles" && (
            <Chronicles
              open={(i) => {
                s.changeChapter(i);
                setMode("tree");
                setPanel(null);
                scrollTree();
              }}
            />
          )}
          {panel === "profile" && person && (
            <>
              <div className="profile-nav">
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      s.select(history[history.length - 1]);
                      setHistory(history.slice(0, -1));
                    }}
                  >
                    <ArrowLeft size={14} />
                    Previous folio
                  </button>
                )}
                <button onClick={() => locate(person.id)}>
                  <Network size={14} />
                  Locate in tree
                </button>
              </div>
              <Profile
                person={person}
                onPerson={(id) => {
                  setHistory([...history, person.id]);
                  s.select(id);
                  document.querySelector("dialog")?.scrollTo(0, 0);
                }}
              />
            </>
          )}
        </Dialog>
      )}
    </>
  );
}
