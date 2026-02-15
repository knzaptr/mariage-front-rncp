"use client";
import Title from "@/components/Title";
import { Activity, WeddingInfo } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function ProgrammePage({
  progs,
  weddingInfo,
}: {
  progs: Activity[];
  weddingInfo: WeddingInfo;
}) {
  const { t, language } = useLanguage();
  const weddingInfoTranslation = weddingInfo.translations.find(
    (t) => t.language === language,
  );

  return (
    <section className="md:mx-[2%] lg:mx-[10%] px-5 relative">
      {/* On prend la date du premier programme pour le titre */}
      <Title level={1} className="text-[60px] text-right capitalize">
        {new Date(weddingInfo.weddingDate).toLocaleDateString(
          language === "fr" ? "fr-FR" : "en-US",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        )}
      </Title>

      <div className="md:my-10 md:ml-8 text-[25px] lg:text-[40px] lg:w-[70%]">
        {progs.map((prog) => {
          // Récupère la traduction correspondant à la langue choisie
          const translation = prog.translations?.find(
            (t) => t.language === language,
          );
          if (!translation) return null;

          return (
            <div key={prog.id} className="flex justify-between my-4">
              <span className="italic">{translation.activityName}</span>
              <span className="font-extrabold italic">{prog.time}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white h-[1px] lg:w-[70%]"></div>
      <p className="text-right text-[45px] lg:text-[65px] capitalize lg:w-[70%]">
        {t("place")}
      </p>
      <p className="text-[30px] lg:w-[75%] lg:text-[55px]">
        {weddingInfoTranslation?.venueAddress}
      </p>
      <Image
        src="/Sujet.PNG"
        alt="Venue"
        width={500}
        height={300}
        className="hidden lg:block w-auto h-auto my-10 absolute top-15 right-0"
      />
      <Image
        src="/ll4.jpeg"
        alt="Venue"
        width={500}
        height={300}
        className="lg:hidden w-auto h-auto my-10 rounded-lg m-auto"
      />
    </section>
  );
}
