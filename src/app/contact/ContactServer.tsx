import ContactClient from "./ContactClient";
// ContactServer.tsx
import { getContacts } from "@/queries/contact";

export default async function ContactServer() {
  const contact = await getContacts();
  return <ContactClient contact={contact} />;
}
