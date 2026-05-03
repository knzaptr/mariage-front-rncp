// page.tsx
import HomeServer from "./HomeServer"; // ou le chemin correct

export const dynamic = "force-dynamic";

export default function PageHome() {
  return <HomeServer />;
}
