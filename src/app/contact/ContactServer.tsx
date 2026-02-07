import ContactClient from "./ContactClient";
export default async function ContactServer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/contact`, {
    cache: "no-store",
  });

  const contact = await res.json();
  // console.log(contact);

  return <ContactClient contact={contact} />;
}
