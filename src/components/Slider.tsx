"use client";

import { Contact } from "@/types";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";

export default function Slider({ listContact }: { listContact: Contact[] }) {
  const [index, setIndex] = useState(0);
  const { language } = useLanguage();

  const next = () => setIndex((prev) => (prev + 1) % listContact.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + listContact.length) % listContact.length);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-gray-700 via-gray-400 to-gray-20">
      {/* Conteneur des slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {listContact.map((p) => {
          const translation = p.translations?.find(
            (t) => t.language === language,
          );

          return (
            <div
              key={p.id}
              className="w-full flex-shrink-0 flex justify-center items-center"
              style={{
                backgroundImage: `
                  linear-gradient(
                    rgba(255,255,255,0.7),
                    rgba(255,255,255,0.7)
                  ),
                  url(${p.imageContact?.[0] || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="w-[90%] md:w-[700px] md:h-[600px] flex flex-col justify-center items-end px-10">
                <div className="h-[200px] md:w-[500px] md:h-[350px] bg-gray-300 rounded-lg mb-6">
                  {p.imageContact?.[0] && (
                    <Image
                      src={p.imageContact[0]}
                      alt={p.name}
                      width={500}
                      height={350}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="text-right text-black">
                  <p className="text-xl font-semibold">{p.name}</p>

                  {translation && (
                    <>
                      <p className="italic">{translation.relationship}</p>
                      <p>{translation.role}</p>
                    </>
                  )}

                  <Link
                    href={`tel:${p.phoneNumber
                      .replace("0", "+33")
                      .replaceAll(" ", "")}`}
                    className="underline"
                  >
                    {p.phoneNumber}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flèches */}
      <button
        onClick={prev}
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
      >
        <IoChevronBack className="text-2xl" />
      </button>

      <button
        onClick={next}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
      >
        <IoChevronForward className="text-2xl" />
      </button>
    </div>
  );
}
