import FaqClient from "./FaqClient";

export default async function FaqServer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/faq`, {
    cache: "no-store",
  });
  const faqs = await res.json();
  return <FaqClient faq={faqs} />;
}
