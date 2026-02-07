"use client";

import Title from "@/components/Title";
import { Guest } from "@/types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function PageAllGuest() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const adminToken = Cookies.get("adminToken");

  useEffect(() => {
    const fetchAllGuests = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/guests`);
        if (!response.ok) {
          throw new Error("Failed to fetch guests");
        }
        const data = await response.json();
        setAllGuests(data);
      } catch (error) {
        console.error("Error fetching guests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGuests();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  loading && <p>Loading...</p>;

  const exportGuestsToCSV = (guests: Guest[]) => {
    const headers = [
      "Prénom",
      "Nom",
      "Présent",
      "Repas",
      "Allergies",
      "Plus-un de",
      "Groupe",
      "Répondu",
      "Date RSVP",
    ];

    const rows = guests.map((guest) => [
      guest.firstName,
      guest.lastName,
      guest.attending === true
        ? "Oui"
        : guest.attending === false
          ? "Non"
          : "—",
      guest.mealChoice ?? "—",
      guest.allergies ?? "—",
      guest.plusOneOf ?? "—",
      guest.groupId,
      guest.hasResponded ? "Oui" : "Non",
      guest.rsvpSubmittedAt
        ? new Date(guest.rsvpSubmittedAt).toLocaleDateString("fr-FR")
        : "—",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invites.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteGuest = async (guestId: number) => {
    try {
      const res = await fetch(`/api/guests/guest/${guestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete guest");
      }

      // ✅ mise à jour du state
      setAllGuests((prev) => prev.filter((g) => g.id !== guestId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Delete guest error:", error.message);
    }
  };

  return (
    <div className="p-6">
      <Title level={1}>Liste de tous les invités</Title>

      <button onClick={() => exportGuestsToCSV(allGuests)}>
        Télécharger la liste
      </button>

      {allGuests.length === 0 ? (
        <p>Aucun invité trouvé.</p>
      ) : (
        <table className="w-full border border-gray-300 mt-4 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">RSVP</th>
              <th className="border px-4 py-2">Présence</th>
              <th className="border px-4 py-2">Plat</th>
              <th className="border px-4 py-2">Plus-One de</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allGuests.map((guest) => (
              <tr key={guest.id}>
                <td className="border px-4 py-2">{guest.lastName}</td>
                <td className="border px-4 py-2">{guest.firstName}</td>
                <td className="border px-4 py-2">
                  {guest.hasResponded ? "Oui" : "Non"}
                </td>
                <td className="border px-4 py-2">
                  {guest.attending === null || guest.attending === undefined
                    ? "—"
                    : guest.attending
                      ? "Oui"
                      : "Non"}
                </td>
                <td className="border px-4 py-2">{guest.mealChoice || "—"}</td>
                <td className="border px-4 py-2">{guest.plusOneOf || "—"}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
