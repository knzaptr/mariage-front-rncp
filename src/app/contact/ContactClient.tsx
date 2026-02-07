import Slider from "@/components/Slider";
import Title from "@/components/Title";
import { Contact } from "@/types";

export default function ContactClient({ contact }: { contact: Contact[] }) {
  return (
    <section>
      <Title level={1} className="md:mx-[2%] lg:mx-[10%]">
        Contact
      </Title>
      <p className="md:mx-[2%] lg:mx-[10%] mt-4 p-5">
        En attendant le grand jour, pour toute question ou information, merci de
        vous adresser aux personnes ci-dessous.
      </p>
      <Slider listContact={contact} />
    </section>
  );
}
