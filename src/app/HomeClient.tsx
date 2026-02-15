"use client";
import Countdown from "@/components/Countdown";
import Title from "@/components/Title";
import { useLanguage } from "@/context/LanguageContext";
import { WeddingInfo } from "@/types";
import Link from "next/link";
import Image from "next/image";

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
      <p className="text-[25px] text-center pt-6 px-4 italic">
        {t("rdvwedding")}{" "}
        {new Date(home.weddingDate).toLocaleDateString(
          language === "fr" ? "fr-FR" : "en-US",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        )}
      </p>

      <div className="grid grid-cols-2 grid-rows-3 gap-4 my-7 text-[21px] text-white md:grid-cols-3 md:grid-rows-2">
        <div className="row-span-2 md:col-span-1 md:row-span-2 md:h-[400px] bg-wine p-3 content-center text-center">
          <Image
            src="/ll3.JPG"
            alt="logo"
            width={400}
            height={400}
            className="w-[100%] h-[100%] object-cover"
          />
        </div>

        <div className="md:row-start-auto bg-wine p-3 content-center text-center">
          <Link href="/rsvp">
            {t("rvspdeadline")}{" "}
            {new Date(home.rsvpDeadline).toLocaleDateString(
              language === "fr" ? "fr-FR" : "en-US",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            )}
          </Link>
        </div>
        <div className="col-start-2 md:col-start-2 bg-wine p-3 content-center text-center">
          <Link href="/faq"> {t("questionprompt")}</Link>
        </div>
        <Link
          href={home.venueLink || "#"}
          className="col-span-2 row-start-3 md:row-span-2 md:col-start-3 md:row-start-1 bg-wine p-3 content-center text-center underline"
        >
          {translation?.venueAddress}
        </Link>
      </div>
    </section>
  );
}
