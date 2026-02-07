"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Cookies from "js-cookie";

export default function PageAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Une erreur est survenue");
      } else {
        router.push("/admin");
        Cookies.set("adminToken", data.token, { expires: 14 });
      }
    } catch (err) {
      setMessage("Erreur serveur");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow-[0px_14px_28px_rgba(0,0,0,0.25),_0px_10px_10px_rgba(0,0,0,0.22)] w-[40%] p-5 flex flex-col justify-center items-center gap-2 m-auto"
    >
      <Input
        type="email"
        placeholder="email@mail.com"
        className="w-100"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="••••••••••••"
        className="w-100"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">ok</button>
      {message && <p>{message}</p>}
    </form>
  );
}
