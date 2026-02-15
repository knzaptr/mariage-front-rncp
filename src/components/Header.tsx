"use client";
import Logo from "../../public/logo-nD3SZYrT.jpeg";
import Image from "next/image";
import Link from "next/link";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  // Vérifier l'authentification uniquement côté client
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("adminToken");
      setIsAuth(!!token);
    };

    // Vérifier au montage
    checkAuth();

    // Vérifier régulièrement (toutes les secondes)
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Cookies.remove("adminToken");
    setIsAuth(false);
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="flex flex-row justify-between items-center px-4 sm:px-6 lg:px-8 ">
      <IoMenu
        className={`${open ? "hidden" : "block"} lg:hidden text-[35px]`}
        onClick={() => setOpen(true)}
      />
      <IoCloseSharp
        className={`${
          open ? "block" : "hidden"
        } absolute top-8 right-3 z-2 lg:hidden text-[35px]`}
        onClick={() => setOpen(false)}
      />
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <Link href="/">
          <Image
            src={Logo}
            alt="logo"
            className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] mix-blend-multiply"
          />
        </Link>
        <div
          className={`${
            open ? "flex" : "hidden lg:flex"
          } flex-col justify-center gap-7 absolute left-0 top-0 bottom-0 right-0 bg-cyan-950 lg:bg-transparent lg:static lg:flex-row lg:gap-3 items-center z-10`}
          onClick={() => setOpen(false)}
        >
          <Link href="/" onClick={() => setOpen(true)} className="uppercase">
            {t("home")}
          </Link>
          <Link href="/programme" className="uppercase">
            {t("program")}
          </Link>
          <Link href="/rsvp" className="uppercase">
            {t("rsvp")}
          </Link>
          <Link href="/contact" className="uppercase">
            {t("contact")}
          </Link>
          <Link href="/faq" className="uppercase">
            {t("faq")}
          </Link>

          {isAuth && (
            <>
              <Link href="/admin" className="uppercase">
                Admin
              </Link>
              <Link href="/admin/addguest" className="uppercase">
                Ajouter des invités
              </Link>
              <Link href="/admin/allguest" className="uppercase">
                Tous les invités
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        {!isAuth ? (
          <Link href="/login" className="uppercase">
            Admin
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="uppercase bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        )}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "fr" | "en")}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="fr">FR 🇫🇷</option>
          <option value="en">EN 🇬🇧</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
