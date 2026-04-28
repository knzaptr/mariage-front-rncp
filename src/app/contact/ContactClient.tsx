"use client";

import Title from "@/components/Title";
import { Contact } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight } from "lucide-react";

export default function ContactClient({ contact }: { contact: Contact[] }) {
  const { language } = useLanguage();

  return (
    <section>
      <Title level={1} className="md:mx-[2%] lg:mx-[10%]">
        Contact
      </Title>
      <p className="md:mx-[2%] lg:mx-[10%] mt-4 p-5">
        En attendant le grand jour, pour toute question ou information, merci de
        vous adresser aux personnes ci-dessous.
      </p>
      <div className="md:mx-[2%] lg:mx-[10%] px-5 pb-10">
        <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-glass-edge overflow-hidden rounded-sm gap-4">
          {contact.map((person, idx) => {
            const translation = person.translations?.find(
              (t) => t.language === language,
            );

            return (
              <article
                key={person.id}
                className="group relative bg-card transition-colors duration-500 hover:bg-secondary/60 border border-glass-edge"
              >
                <div className="p-8 md:p-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-10 md:mb-14">
                    <div className="size-20 md:size-24 bg-secondary overflow-hidden border border-glass-edge grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={person.imageContact?.[0]}
                        alt={person.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground border border-glass-edge px-2 py-1">
                      {String(idx + 1).padStart(2, "0")} /{" "}
                      {String(contact.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-auto">
                    {translation && (
                      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-2">
                        {translation.role}
                      </p>
                    )}
                    <h2 className="text-3xl font-medium tracking-tight mb-1">
                      {person.name}
                    </h2>
                    {translation && (
                      <p className="text-muted-foreground mb-8">
                        {translation.relationship}
                      </p>
                    )}

                    <a
                      href={`tel:${person.phoneNumber
                        .replace("0", "+33")
                        .replaceAll(" ", "")}`}
                      className="group/btn relative inline-flex items-center gap-4 w-full p-4 border border-glass-edge bg-glass-surface/60 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-ink"
                    >
                      <span className="font-mono text-base md:text-lg tracking-tight tabular-nums">
                        {person.phoneNumber}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-muted-foreground group-hover/btn:text-ink transition-colors">
                        Appeler
                        <ArrowUpRight className="size-3.5" strokeWidth={2} />
                      </span>
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-500 group-hover/btn:w-full" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </section>
  );
}
