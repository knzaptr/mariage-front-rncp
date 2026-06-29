"use client";
import Countdown from "@/components/Countdown";
import Title from "@/components/Title";
import { useLanguage } from "@/context/LanguageContext";
import { WeddingInfo } from "@/types";
import { GoArrowUpRight } from "react-icons/go";

export default function HomeClient({ home }: { home: WeddingInfo }) {
  const { t, language } = useLanguage();
  const translation = home.translations.find((t) => t.language === language);

  return (
    <section className="md:mx-[2%] lg:mx-[10%]">
      <p className="text-center italic px-4">{translation?.description}</p>
      <Title level={1} className="flex flex-col my-5">
        <span className="ml-[17%] lg:ml-[25%]">{home.brideName} & </span>
        <span className="text-end mr-[17%] lg:mr-[25%]">{home.groomName}</span>
      </Title>
      <Countdown targetDate={home.weddingDate.toString()} />

      {/* Informations du mariage */}
      <section className="w-[80vw] mx-auto grid grid-cols-12 gap-3 md:gap-5 mt-7 ">
        <figure className="col-span-12 md:col-span-5 relative overflow-hidden bg-secondary aspect-[3/4] group">
          <img
            src="/ll3.JPG"
            alt="Portrait éditorial du couple"
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105"
          />
          <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-background bg-ink/70 backdrop-blur px-2 py-1">
            01 — {t("couple")}
          </figcaption>
        </figure>

        <div className="col-span-12 md:col-span-4 flex flex-col gap-3 md:gap-5">
          <figure className="relative overflow-hidden bg-secondary aspect-square group">
            <img
              src="/pexels4-KPl9CBmh.jpg"
              alt="Bouquet de pivoines"
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105"
            />
            <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-background bg-ink/70 backdrop-blur px-2 py-1">
              02 — {t("warmcolors")}
            </figcaption>
          </figure>
          <div className="flex-1 border border-glass-edge bg-glass-surface/60 backdrop-blur-xl p-6 flex flex-col justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Huis Van Wonterghem
            </p>
            <div className="mt-4">
              <p className="text-2xl font-light leading-tight tracking-tight text-balance">
                {t("onceuponatime")}
              </p>
            </div>
            <a
              href="/programme"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] border-b border-ink pb-1 self-start hover:gap-4 transition-all"
            >
              {t("seeprogram")}
              <GoArrowUpRight className="size-3.5" strokeWidth={2} />
            </a>
          </div>
        </div>

        <figure className="col-span-12 md:col-span-3 relative overflow-hidden bg-secondary aspect-[3/5] group">
          <img
            src="/lieu.png"
            alt="Architecture du lieu"
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105"
          />
          <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-background bg-ink/70 backdrop-blur px-2 py-1">
            03 — Le lieu
          </figcaption>
        </figure>
      </section>

      {/* Date et lieu du mariage */}
      <section className="w-[80vw] mx-auto mt-16 md:mt-24 border-t border-b border-glass-edge py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[{
          k: t("date"),
          v: new Date(home.weddingDate).toLocaleDateString(
            language === "fr" ? "fr-FR" : "en-GB",
            { day: "2-digit", month: "2-digit", year: "numeric" }
          ).replace(/\//g, "."),
        },
        { k: t("ceremony"), v: "14:00" },
        { k: t("venue"), v: translation?.venueAddress },
        { k: t("faq"), v: t("questionprompt") },
        ].map((item) => (
          <div key={item.k} className="flex flex-col">
          <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {item.k}
          </span>
        
          {item.k === t("venue") ? (
            <a
              href={home.venueLink}
              className="font-display text-xl md:text-2xl font-light tracking-tight"
            >
              {item.v}
            </a>
          ) 
          : item.k === t("faq") ? (
            <a
              href="/faq"
              className="font-display text-xl md:text-2xl font-light tracking-tight"
            >
              {item.v}
            </a>
          ) : (
            <span className="font-display text-xl md:text-2xl font-light tracking-tight">
              {item.v}
            </span>
          )}
        </div>
        ))}
      </section>

      {/* CTA */}
      <section className="w-[80vw] mx-auto mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-md">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-balance">
          {t("confirmrsvp")}{" "}
          <span className="font-mono text-2xl md:text-3xl">
            {new Date(home.rsvpDeadline).toLocaleDateString(
              language === "fr" ? "fr-FR" : "en-GB",
              { day: "2-digit", month: "2-digit", year: "numeric" }
            ).replace(/\//g, ".")}
          </span>.
        </h2>
        </div>
        <a
          href="/rsvp"
          className="group inline-flex items-center gap-4 px-8 py-5 font-mono text-xs uppercase tracking-[0.25em] hover:gap-6 transition-all bg-wine text-white"
        >
          Répondre au RSVP
          <GoArrowUpRight
            className="size-4 group-hover:rotate-45 transition-transform"
            strokeWidth={2}
          />
        </a>
      </section>
    </section>
  );
}
