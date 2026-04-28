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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");

    const syncScrollLock = () => {
      if (!open) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        return;
      }
      const lock = mq.matches ? "hidden" : "";
      document.documentElement.style.overflow = lock;
      document.body.style.overflow = lock;
    };

    syncScrollLock();
    mq.addEventListener("change", syncScrollLock);

    return () => {
      mq.removeEventListener("change", syncScrollLock);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = () => {
    Cookies.remove("adminToken");
    setIsAuth(false);
    setOpen(false);
    router.push("/");
  };

  /** Mobile : cartes sur fond blanc ; desktop : uppercase + police plus grande */
  const navItemClass =
    "uppercase block w-full max-w-sm mx-auto rounded-2xl border border-slate-200 bg-white px-6 py-4 " +
    "text-center text-sm font-medium text-slate-800 shadow-sm shadow-slate-200/80 " +
    "transition-colors hover:border-slate-300 active:scale-[0.99] " +
    "lg:inline lg:w-auto lg:max-w-none lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 " +
    "lg:text-left lg:text-lg lg:font-normal lg:text-slate-900 lg:shadow-none lg:hover:border-transparent " +
    "lg:hover:bg-transparent lg:active:scale-100";

  return (
    <header className="relative z-40 flex flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        className={`${
          open ? "hidden" : "flex"
        } -ml-2 cursor-pointer items-center justify-center rounded-xl p-2 text-slate-800 transition-colors hover:bg-slate-100 lg:hidden`}
        onClick={() => setOpen(true)}
      >
        <IoMenu className="text-3xl" aria-hidden />
        <span className="sr-only">Ouvrir le menu</span>
      </button>
      <div className="flex flex-col items-center gap-3 lg:flex-row">
        <Link href="/">
          <Image
            src={Logo}
            alt="logo"
            className="h-[60px] w-[60px] mix-blend-multiply lg:h-[80px] lg:w-[80px]"
          />
        </Link>
        <div
          id="mobile-nav"
          className={`${
            open ? "flex" : "hidden lg:flex"
          } fixed inset-0 z-50 flex-col bg-white lg:relative lg:inset-auto lg:z-auto lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-3 lg:bg-transparent`}
        >
          {/* Panneau mobile uniquement */}
          <div className="flex flex-none items-center justify-between border-b border-slate-200 bg-white px-6 py-5 lg:hidden">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
              Menu
            </span>
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-slate-800 transition-colors hover:bg-slate-100"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
            >
              <IoCloseSharp className="text-3xl" aria-hidden />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col items-stretch justify-center gap-3 overflow-y-auto px-6 pb-10 pt-4 lg:flex-initial lg:flex-row lg:items-center lg:gap-3 lg:overflow-visible lg:px-0 lg:py-0"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={navItemClass}
            >
              {t("home")}
            </Link>

            <Link
              href="/programme"
              onClick={() => setOpen(false)}
              className={navItemClass}
            >
              {t("program")}
            </Link>

            <Link
              href="/rsvp"
              onClick={() => setOpen(false)}
              className={navItemClass}
            >
              {t("rsvp")}
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={navItemClass}
            >
              {t("contact")}
            </Link>

            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className={navItemClass}
            >
              {t("faq")}
            </Link>

            {isAuth && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className={navItemClass}
                >
                  Admin
                </Link>
                <Link
                  href="/admin/addguest"
                  onClick={() => setOpen(false)}
                  className={navItemClass}
                >
                  Ajouter des invités
                </Link>
                <Link
                  href="/admin/allguest"
                  onClick={() => setOpen(false)}
                  className={navItemClass}
                >
                  Tous les invités
                </Link>
              </>
            )}
          </nav>
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
          aria-label="Language"
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
