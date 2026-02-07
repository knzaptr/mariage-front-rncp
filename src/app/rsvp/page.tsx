"use client";
import Input from "@/components/Input";
import Title from "@/components/Title";
import { Guest, GuestGroup, MealChoice } from "@/types";
import { useState, useEffect } from "react";
import Image from "next/image";

const RsvpPage = () => {
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [isInvited, setIsInvited] = useState<boolean>(false);
  const [foundGroup, setFoundGroup] = useState<GuestGroup | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const updateGuest = (guestId: number, updates: Partial<Guest>): void => {
    setFoundGroup((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        guests: prev.guests.map((g) =>
          g.id === guestId ? { ...g, ...updates } : g,
        ),
      };
    });
  };

  const addPlusOneToGroup = (mainGuest: Guest): void => {
    setFoundGroup((prev) => {
      if (!prev) return prev;

      const newPlusOne: Guest = {
        id: Date.now(), // ID temporaire
        groupId: prev.id,
        firstName: "",
        lastName: "",
        hasResponded: false,
        attending: false,
        mealChoice: "viande",
        allergies: "",
        allowsPlusOne: false,
        plusOneOf: mainGuest.firstName + " " + mainGuest.lastName, // Stocker l'ID au lieu du nom
        rsvpSubmittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        guests: [
          ...prev.guests.map((g) =>
            g.firstName === mainGuest.firstName &&
            g.lastName === mainGuest.lastName
              ? { ...g, allowsPlusOne: false }
              : g,
          ),
          newPlusOne,
        ],
      };
    });
  };

  const removePlusOne = (mainGuest: Guest): void => {
    setFoundGroup((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        guests: [
          ...prev.guests
            .filter(
              (g) =>
                g.plusOneOf !== mainGuest.firstName + " " + mainGuest.lastName,
            )
            .map((g) =>
              g.firstName === mainGuest.firstName &&
              g.lastName === mainGuest.lastName
                ? { ...g, allowsPlusOne: true }
                : g,
            ),
        ],
      };
    });
  };

  const resetForm = (): void => {
    setNom("");
    setPrenom("");
    setIsInvited(false);
    setFoundGroup(null);
    setErrorMessage("");
  };

  const handleSubmitRSVP = async () => {
    setErrorMessage("");

    if (!foundGroup) return;

    for (const guest of foundGroup.guests) {
      if (guest.attending === null || guest.attending === undefined) {
        setErrorMessage(
          `Veuillez indiquer si ${
            guest.firstName || "l'invité"
          } sera présent(e)`,
        );
        return;
      }

      if (guest.attending && !guest.mealChoice) {
        setErrorMessage(
          `Veuillez choisir le repas pour ${guest.firstName || "l'invité"}`,
        );
        return;
      }

      if (guest.plusOneOf && (!guest.firstName || !guest.lastName)) {
        setErrorMessage(
          "Veuillez remplir le nom et prénom de votre accompagnant",
        );
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3000/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group: foundGroup.groupName,
          guests: foundGroup.guests,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement");
      }

      alert("Merci ! Vos réponses ont bien été enregistrées.");
      resetForm();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
      );
    }
  };

  const fetchGuestExists = async () => {
    setErrorMessage("");

    if (!nom.trim() || !prenom.trim()) {
      setErrorMessage("Veuillez remplir votre nom et prénom");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/guests/guest/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastName: nom.trim(),
            firstName: prenom.trim(),
          }),
        },
      );

      if (!response.ok) {
        setIsInvited(false);
        setErrorMessage(
          "Désolé, nous ne trouvons pas votre nom sur la liste des invités",
        );
        return;
      }

      setIsInvited(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Une erreur est survenue, veuillez réessayer");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchGroup = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/guests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: prenom.trim(),
          lastName: nom.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          "Désolé, nous ne trouvons pas votre nom sur la liste des invités",
        );
        return;
      }

      setFoundGroup(data);
    };

    if (isInvited && nom && prenom) {
      fetchGroup();
    }
  }, [isInvited, nom, prenom]);

  const getPlusOneForGuest = (guest: Guest): Guest | undefined => {
    return foundGroup?.guests.find(
      (g) => g.plusOneOf === guest.firstName + " " + guest.lastName,
    );
  };

  return (
    <section className="py-8">
      <div className="mx-auto">
        <Title level={1}>RSVP</Title>

        <div className="md:bg-black w-full h-60 lg:relative lg:mt-50 lg:mb-80 flex justify-end ">
          <Image
            src="/ll1.JPG"
            alt="logo"
            width={150}
            height={400}
            className="h-full w-full object-contain"
          />
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8 lg:absolute lg:left-50 lg:-top-30 lg:w-[650px] overflow-y-scroll">
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errorMessage}
              </div>
            )}

            {!isInvited ? (
              <div className="lg:mt-25 lg:h-[350px] ">
                <div className="flex gap-[10%] mb-8">
                  <Input
                    type="text"
                    placeholder="Nom"
                    className="w-[45%]"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />

                  <Input
                    type="text"
                    placeholder="Prénom"
                    className="w-[45%]"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>

                <button
                  onClick={fetchGuestExists}
                  className="w-full bg-wine text-white px-6 py-3 rounded hover:bg-blue-900 transition font-medium"
                >
                  Vérifier mon invitation
                </button>
              </div>
            ) : (
              <div className="lg:h-[650px] lg:overflow-y-scroll">
                <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
                  <p className="text-green-800 font-medium">✓ Bienvenue !</p>
                  {foundGroup &&
                    foundGroup.guests.filter((g) => !g.plusOneOf).length >
                      1 && (
                      <p className="text-green-700 text-sm mt-1">
                        Veuillez remplir les informations pour chaque personne
                        de votre groupe
                      </p>
                    )}
                </div>

                {foundGroup?.guests
                  .filter((g) => !g.plusOneOf)
                  .map((guest, index) => {
                    const plusOne = getPlusOneForGuest(guest);

                    return (
                      <div
                        key={guest.id}
                        className={`mb-8 ${
                          index > 0 ? "pt-8 border-t-2 border-gray-200" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {guest.firstName} {guest.lastName}
                          </h3>
                        </div>

                        {/* Présence */}
                        <div className="mb-6">
                          <label className="block text-gray-700 font-medium mb-3">
                            Serez-vous présent(e) ? *
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`coming-${guest.id}`}
                                checked={guest.attending === true}
                                onChange={() =>
                                  updateGuest(guest.id, { attending: true })
                                }
                                className="w-4 h-4"
                              />
                              <span>Oui, avec plaisir</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`coming-${guest.id}`}
                                checked={guest.attending === false}
                                onChange={() =>
                                  updateGuest(guest.id, { attending: false })
                                }
                                className="w-4 h-4"
                              />
                              <span>Non, désolé(e)</span>
                            </label>
                          </div>
                        </div>

                        {guest.attending && (
                          <>
                            {/* Choix du repas */}
                            <div className="mb-6">
                              <label className="block text-gray-700 font-medium mb-3">
                                Choix du repas *
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {(
                                  [
                                    "viande",
                                    "poisson",
                                    "vegetarien",
                                    "enfant",
                                  ] as MealChoice[]
                                ).map((choice) => (
                                  <label
                                    key={choice}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name={`meal-${guest.id}`}
                                      checked={guest.mealChoice === choice}
                                      onChange={() =>
                                        updateGuest(guest.id, {
                                          mealChoice: choice,
                                        })
                                      }
                                      className="w-4 h-4"
                                    />
                                    <span className="capitalize">{choice}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Allergies */}
                            <div className="mb-6">
                              <label className="block text-gray-700 font-medium mb-2">
                                Allergies, intolérances ou régime particulier
                              </label>
                              <textarea
                                placeholder="Ex: Allergie aux fruits à coque, régime sans gluten..."
                                value={guest.allergies ?? ""}
                                onChange={(e) =>
                                  updateGuest(guest.id, {
                                    allergies: e.target.value,
                                  })
                                }
                                className="border border-gray-300 rounded px-3 py-2 w-full h-24 resize-none"
                              />
                            </div>

                            {/* Plus One */}
                            {(guest.allowsPlusOne || plusOne) && (
                              <div className="border-t pt-6 mt-6 bg-blue-50 py-4 rounded">
                                <div className="mb-4">
                                  <label className="block text-gray-700 font-medium mb-3">
                                    Souhaitez-vous être accompagné(e) ?
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`addPlusOne-${guest.id}`}
                                        checked={!!plusOne}
                                        onChange={() => {
                                          if (!plusOne) {
                                            addPlusOneToGroup(guest);
                                          }
                                        }}
                                        className="w-4 h-4"
                                      />
                                      <span>Oui</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`addPlusOne-${guest.id}`}
                                        checked={!plusOne}
                                        onChange={() => {
                                          if (plusOne) {
                                            removePlusOne(guest);
                                          }
                                        }}
                                        className="w-4 h-4"
                                      />
                                      <span>Non</span>
                                    </label>
                                  </div>
                                </div>

                                {plusOne && (
                                  <div className="bg-white rounded p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                          Nom *
                                        </label>
                                        <Input
                                          type="text"
                                          placeholder="Nom"
                                          value={plusOne.lastName || ""}
                                          onChange={(e) =>
                                            updateGuest(plusOne.id, {
                                              lastName: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                          Prénom *
                                        </label>
                                        <Input
                                          type="text"
                                          placeholder="Prénom"
                                          value={plusOne.firstName || ""}
                                          onChange={(e) =>
                                            updateGuest(plusOne.id, {
                                              firstName: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Sera présent(e) ? *
                                      </label>
                                      <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`comingPlusOne-${plusOne.id}`}
                                            checked={plusOne.attending === true}
                                            onChange={() =>
                                              updateGuest(plusOne.id, {
                                                attending: true,
                                              })
                                            }
                                            className="w-4 h-4"
                                          />
                                          <span>Oui</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`comingPlusOne-${plusOne.id}`}
                                            checked={
                                              plusOne.attending === false
                                            }
                                            onChange={() =>
                                              updateGuest(plusOne.id, {
                                                attending: false,
                                              })
                                            }
                                            className="w-4 h-4"
                                          />
                                          <span>Non</span>
                                        </label>
                                      </div>
                                    </div>

                                    {plusOne.attending && (
                                      <>
                                        <div>
                                          <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Choix du repas *
                                          </label>
                                          <div className="grid grid-cols-2 gap-2">
                                            {(
                                              [
                                                "viande",
                                                "poisson",
                                                "vegetarien",
                                                "enfant",
                                              ] as MealChoice[]
                                            ).map((choice) => (
                                              <label
                                                key={choice}
                                                className="flex items-center gap-2 cursor-pointer"
                                              >
                                                <input
                                                  type="radio"
                                                  name={`mealPlusOne-${plusOne.id}`}
                                                  checked={
                                                    plusOne.mealChoice ===
                                                    choice
                                                  }
                                                  onChange={() =>
                                                    updateGuest(plusOne.id, {
                                                      mealChoice: choice,
                                                    })
                                                  }
                                                  className="w-4 h-4"
                                                />
                                                <span className="capitalize text-sm">
                                                  {choice}
                                                </span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Allergies / régime
                                          </label>
                                          <textarea
                                            placeholder="Allergies ou régime particulier..."
                                            value={plusOne.allergies ?? ""}
                                            onChange={(e) =>
                                              updateGuest(plusOne.id, {
                                                allergies: e.target.value,
                                              })
                                            }
                                            className="border border-gray-300 rounded px-3 py-2 w-full h-20 resize-none text-sm"
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}

                <button
                  onClick={handleSubmitRSVP}
                  className="w-full bg-wine text-white px-6 py-3 rounded hover:bg-blue-900 transition font-medium mt-6 mb-6"
                >
                  Confirmer toutes les réponses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RsvpPage;
