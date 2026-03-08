import { getFaqs } from "@/queries/faq";
import FaqClient from "./FaqClient";

export default async function FaqServer() {
  const faqs = await getFaqs();
  return <FaqClient faq={faqs} />;
}
