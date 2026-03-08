import { getActivities } from "@/queries/programme";
import ProgClient from "./ProgClient";
import { getWeddingInfo } from "@/queries/weddinginfo";

export default async function ProgServer() {
  const progs = await getActivities();
  const weddingInfoData = await getWeddingInfo();

  if (!weddingInfoData) return <p>Erreur de chargement</p>;

  return <ProgClient progs={progs} weddingInfo={weddingInfoData} />;
}
