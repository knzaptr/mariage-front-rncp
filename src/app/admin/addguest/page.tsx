"use client";

import Input from "@/components/Input";
import { Guest } from "@/types";
import { useState } from "react";

const AddGuest = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [guests, setGuests] = useState<Partial<Guest>[]>([
    { firstName: "", lastName: "", allowsPlusOne: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddGuest = () => {
    setGuests([
      ...guests,
      { firstName: "", lastName: "", allowsPlusOne: false },
    ]);
  };

  const handleRemoveGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const handleGuestChange = (
    index: number,
    field: keyof Guest,
    value: string | boolean,
  ) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Générer le nom du groupe à partir du premier nom de famille
    const firstLastName = guests[0]?.lastName?.trim();
    if (!firstLastName) {
      setMessage({
        type: "error",
        text: "Le nom de famille du premier invité est requis",
      });
      setIsLoading(false);
      return;
    }

    const finalGroupName = `Famille ${firstLastName}`;

    try {
      const response = await fetch(`${baseUrl}/api/guests/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group: finalGroupName,
          guests: guests.map((g) => ({
            firstName: g.firstName?.trim(),
            lastName: g.lastName?.trim(),
            allowsPlusOne: g.allowsPlusOne,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Groupe créé avec succès !" });
        // Réinitialiser le formulaire
        setGuests([{ firstName: "", lastName: "", allowsPlusOne: false }]);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur de connexion au serveur" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un groupe dinvités</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom du groupe (optionnel) */}
        {/* <div>
          <label htmlFor="groupName" className="block text-sm font-medium mb-2">
            Nom du groupe (optionnel)
          </label>
          <Input
            name="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Famille Lemoine"
          />
          <p className="text-sm text-gray-500 mt-1">
            Par défaut : `{guests[0]?.lastName || "[Nom]"}`
          </p>
        </div> */}

        {/* Liste des invités */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Invités</h2>

          {guests.map((guest, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Invité {index + 1}</h3>
                {guests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Retirer
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom de famille *
                </label>
                <Input
                  name={`lastName-${index}`}
                  type="text"
                  value={guest.lastName}
                  onChange={(e) =>
                    handleGuestChange(index, "lastName", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Prénom *
                </label>
                <Input
                  name={`firstName-${index}`}
                  type="text"
                  value={guest.firstName}
                  onChange={(e) =>
                    handleGuestChange(index, "firstName", e.target.value)
                  }
                  required
                />
              </div>

              <label className="flex items-center space-x-2">
                <Input
                  name={`plusOne-${index}`}
                  type="checkbox"
                  checked={guest.allowsPlusOne}
                  onChange={(e) =>
                    handleGuestChange(index, "allowsPlusOne", e.target.checked)
                  }
                />
                <span className="text-sm">Autorise un +1</span>
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddGuest}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-600 hover:text-gray-800"
          >
            + Ajouter un invité
          </button>
        </div>

        {/* Message de feedback */}
        {message && (
          <div
            className={`p-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? "Création en cours..." : "Créer le groupe"}
        </button>
      </form>
    </div>
  );
};

export default AddGuest;
