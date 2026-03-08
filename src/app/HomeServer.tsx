import { getWeddingInfo } from "@/queries/weddinginfo";
import HomeClient from "./HomeClient";

export default async function HomeServer() {
  const home = await getWeddingInfo();
  if (!home) throw new Error("Failed to fetch wedding info");

  return <HomeClient home={home} />;
}
