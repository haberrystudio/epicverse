import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { characters, byId } from "@/data/archive";
import { Profile } from "@/components/archive/profile";
import { Brand } from "@/components/archive/brand";
type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = byId.get((await params).id);
  return p ? { title: p.name + " — " + p.title, description: p.biography } : {};
}
export default async function CharacterPage({ params }: Props) {
  const p = byId.get((await params).id);
  if (!p) notFound();
  return (
    <>
      <header className="site-header">
        <div className="nav-inner">
          <Link href="/">
            <Brand />
          </Link>
          <Link
            className="text-action"
            href={"/?character=" + p.id + "#explorer"}
          >
            Locate in family tree →
          </Link>
        </div>
      </header>
      <main className="folio-page">
        <h1 className="sr-only">{p.name}</h1>
        <Profile person={p} />
      </main>
    </>
  );
}
