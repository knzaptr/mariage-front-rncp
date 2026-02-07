"use client";
import Title from "@/components/Title";
import Image from "next/image";
import { Faq } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export default function FaqClient({ faq }: { faq: Faq[] }) {
  const { language } = useLanguage();
  const positions = [
    "", // index 0
    "", // index 1
    "", // index 2
    "lg:col-start-2 lg:row-start-2", // index 3
    "lg:col-start-3 lg:row-start-2", // index 4
    "lg:col-start-3 lg:row-start-3", // index 5
    "lg:col-start-2 lg:row-start-3", // index 6
    "lg:col-start-2 lg:row-start-4", // index 7
    "lg:col-start-3 lg:row-start-4", // index 8
    "lg:col-start-4 lg:row-start-4", // index 9
  ];

  // console.log(faq);

  return (
    <section className="px-4 sm:px-6 lg:px-8 ">
      <Title level={1} className="md:mx-[2%] lg:mx-[10%]">
        FAQ
      </Title>
      <div className="grid grid-cols-2 grid-rows-5 lg:grid-cols-5 lg:grid-rows-4 gap-4">
        <div className="relative aspect-square lg:aspect-auto lg:row-span-2 lg:block bg-pink-300">
          <Image src="/ll1.JPG" alt="logo" fill className="object-cover" />
        </div>
        {faq
          ?.filter((t) => t.language === language)
          .slice(0, 10) // prend les 10 premières
          .map((t, index) => (
            <div key={t.id} className={`aspect-square ${positions[index]}`}>
              <div className="card">
                <div className="content">
                  <div className="front">{t.question}</div>
                  <div className="back">{t.answer}</div>
                </div>
              </div>
            </div>
          ))}
        <div className="relative lg:col-span-2 lg:row-span-2 lg:col-start-4 lg:row-start-2 lg:block bg-pink-300 aspect-square">
          <Image src="/ll2.JPG" alt="logo" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
