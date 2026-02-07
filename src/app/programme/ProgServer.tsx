import ProgClient from "./ProgClient";

export default async function ProgServer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/programme`, {
    cache: "no-store",
  });
  const weddingInfo = await fetch(`${baseUrl}/api/weddinginfos`, {
    cache: "no-store",
  });
  const progs = await res.json();
  const weddingInfoData = await weddingInfo.json();
  return <ProgClient progs={progs} weddingInfo={weddingInfoData} />;
}
