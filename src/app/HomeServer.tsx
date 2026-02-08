import HomeClient from "./HomeClient";

export default async function HomeServer() {
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`/api/weddinginfos`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch wedding info");

  const home = await res.json(); // c'est déjà un objet

  return <HomeClient home={home} />;
}
