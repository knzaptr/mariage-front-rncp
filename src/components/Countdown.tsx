"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const { t } = useLanguage();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // première exécution immédiate
    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-[80vw] mx-auto">
      <div className="bg-white h-[1px] w-full"></div>
      <div className="flex flex-row flex-wrap justify-center items-center my-[15px] mx-auto gap-y-5 md:w-[100%] md:gap-20 md:flex-nowrap text-center">
        <div className="w-[calc(100%/2)]">
          <p className="text-5xl font-bold">{timeLeft.days}</p>
          <p className="text-sm text-gray-500">
            {timeLeft.days > 1 ? t("days") : t("day")}
          </p>
        </div>
        <div className="w-[calc(100%/2)]">
          <p className="text-5xl font-bold">{timeLeft.hours}</p>
          <p className="text-sm text-gray-500">
            {timeLeft.hours > 1 ? t("hours") : t("hour")}
          </p>
        </div>
        <div className="w-[calc(100%/2)]">
          <p className="text-5xl font-bold">{timeLeft.minutes}</p>
          <p className="text-sm text-gray-500">
            {timeLeft.minutes > 1 ? t("minutes") : t("minute")}
          </p>
        </div>
        <div className="w-[calc(100%/2)]">
          <p className="text-5xl font-bold">{timeLeft.seconds}</p>
          <p className="text-sm text-gray-500">
            {timeLeft.seconds > 1 ? t("seconds") : t("second")}
          </p>
        </div>
      </div>
      <div className="bg-white h-[1px] w-full"></div>
    </div>
  );
}
