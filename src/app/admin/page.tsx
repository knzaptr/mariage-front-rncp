"use client";
import Input from "@/components/Input";
import {
  Activity,
  ActivityTranslation,
  Contact,
  ContactTranslation,
  Faq,
  Language,
  WeddingInfo,
  WeddingInfoTranslation,
} from "@/types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Title from "@/components/Title";
import { MdOutlineDeleteForever } from "react-icons/md";
import AddModal, { ModalType } from "@/components/Modal";

export default function PageAdmin() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [weddingInfos, setWeddingInfos] = useState<WeddingInfo | null>(null);
  const [prog, setProg] = useState<Activity[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalType, setModalType] = useState<ModalType>(null);

  const adminToken = Cookies.get("adminToken");

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    async function fetchHome() {
      try {
        const res = await fetch(`${baseUrl}/api/weddinginfos`, {
          method: "GET",
          cache: "no-store",
        });
        const weddinginfos = await res.json();

        const resProg = await fetch(`${baseUrl}/api/programme`, {
          method: "GET",
          cache: "no-store",
        });
        const progs = await resProg.json();

        const resFaq = await fetch(`${baseUrl}/api/faq`, {
          method: "GET",
          cache: "no-store",
        });
        const faqs = await resFaq.json();

        const resContacts = await fetch(`${baseUrl}/api/contact`, {
          method: "GET",
          cache: "no-store",
        });
        const contacts = await resContacts.json();

        setWeddingInfos(weddinginfos);
        setProg(progs);
        setFaqs(faqs);
        setContacts(contacts);
      } catch (err) {
        console.error("Erreur :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHome();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (!weddingInfos) return <p>Erreur de chargement Wedding Infos</p>;
  if (!prog) return <p>Erreur de chargement Programmation</p>;
  if (!faqs) return <p>Erreur de chargement FAQ</p>;

  // HOME
  const handleChangeHome = (key: keyof WeddingInfo, value: string) => {
    setWeddingInfos((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleChangeHomeTranslateById = (
    id: number,
    patch: Partial<WeddingInfoTranslation>,
  ) => {
    setWeddingInfos((prev) => {
      if (!prev) return prev;

      const updated = prev.translations.map((t) =>
        t.id === id ? { ...t, ...patch } : t,
      );

      return { ...prev, translations: updated };
    });
  };

  const handleSubmitHome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingInfos) return;

    setSaving(true);

    try {
      const res = await fetch(`${baseUrl}/api/weddinginfos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(weddingInfos),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      alert("Modification enregistrée !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  // PROGRAMME
  const handleActivityChange = (
    activityId: number,
    field: keyof Activity,
    value: string | number,
  ) => {
    setProg((prevProg) =>
      prevProg.map((activity) =>
        activity.id === activityId ? { ...activity, [field]: value } : activity,
      ),
    );
  };

  const handleTranslationChange = (
    activityId: number,
    translationId: number,
    field: keyof ActivityTranslation,
    value: string,
  ) => {
    setProg((prevProg) =>
      prevProg.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              translations: activity.translations?.map((translation) =>
                translation.id === translationId
                  ? { ...translation, [field]: value }
                  : translation,
              ),
            }
          : activity,
      ),
    );
  };

  const handleSubmitProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${baseUrl}/api/programme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ activities: prog }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur serveur:", errorData);
        throw new Error("Erreur lors de la sauvegarde");
      }

      const updatedActivities = await response.json();

      // ✅ Mettre à jour l'état avec les données complètes retournées
      setProg(updatedActivities);

      alert("Programme mis à jour avec succès ✅");
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Erreur lors de la mise à jour du programme");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = async (activityId: number) => {
    // Confirmation avant suppression
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${baseUrl}/api/programme?id=${activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur serveur:", errorData);
        throw new Error("Erreur lors de la suppression de l'activité");
      }

      // ✅ Mise à jour du state local en retirant l'activité supprimée
      setProg((prevProg) =>
        prevProg.filter((activity) => activity.id !== activityId),
      );

      alert("Activité supprimée avec succès ✅");
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Erreur lors de la suppression de l'activité");
    } finally {
      setSaving(false);
    }
  };

  // FAQ
  const handleFaqChange = (index: number, field: keyof Faq, value: string) => {
    setFaqs((prevFaq) =>
      prevFaq.map((faqItem, i) =>
        i === index ? { ...faqItem, [field]: value } : faqItem,
      ),
    );
  };

  const handleSubmitFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${baseUrl}/api/faq`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ faqs }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur serveur:", errorData);
        throw new Error("Erreur lors de la sauvegarde de la FAQ");
      }

      const updatedFaqs = await response.json();

      // ✅ Mise à jour du state avec les données retournées
      setFaqs(updatedFaqs);

      alert("FAQ mise à jour avec succès ✅");
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Erreur lors de la mise à jour de la FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaqGroup = async (displayOrder: number | string) => {
    const confirmDelete = confirm("Supprimer cette question en FR et EN ?");
    if (!confirmDelete) return;

    const response = await fetch(`${baseUrl}/api/faq`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        displayOrder: Number(displayOrder),
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la FAQ");
    }

    // Update local state
    setFaqs((prev) =>
      prev.filter((faq) => faq.displayOrder !== Number(displayOrder)),
    );

    alert("Question supprimée avec succès 🗑️");
  };

  // CONTACTS
  const handleContactChange = (
    contactId: number,
    field: keyof Contact,
    value: string | number,
  ) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, [field]: value } : contact,
      ),
    );
  };

  const handleContactTranslationChange = (
    contactId: number,
    translationId: number,
    field: keyof ContactTranslation,
    value: string,
  ) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              translations: contact.translations?.map((translation) =>
                translation.id === translationId
                  ? { ...translation, [field]: value }
                  : translation,
              ),
            }
          : contact,
      ),
    );
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // console.log("Contacts envoyés :", contacts); // 🔍 debug utile
      const formData = new FormData();

      const contactsPayload = contacts.map(({ ...rest }) => rest);

      formData.append("contacts", JSON.stringify(contactsPayload));

      // 📸 Images
      contacts.forEach((contact) => {
        if (contact.newImageFile) {
          formData.append(`image-${contact.id}`, contact.newImageFile);
        }
      });

      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          // ❌ surtout PAS Content-Type
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur serveur:", errorData);
        throw new Error("Erreur lors de la sauvegarde des contacts");
      }

      const updatedContacts = await response.json();

      // ✅ Resync du state avec la DB
      setContacts(updatedContacts);

      alert("Contacts mis à jour avec succès ✅");
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Erreur lors de la mise à jour des contacts");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    // Confirmation avant suppression
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${baseUrl}/api/contact?id=${contactId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur serveur:", errorData);
        throw new Error("Erreur lors de la suppression du contact");
      }

      // ✅ Mise à jour du state local en retirant le contact supprimé
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== contactId),
      );

      alert("Contact supprimé avec succès ✅");
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Erreur lors de la suppression du contact");
    } finally {
      setSaving(false);
    }
  };

  //ADD MODAL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitFaqNew = async (data: any) => {
    const nextDisplayOrder =
      faqs.length > 0 ? Math.max(...faqs.map((f) => f.displayOrder)) + 1 : 1;

    const response = await fetch(`${baseUrl}/api/faq`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        displayOrder: nextDisplayOrder,
        translations: [
          {
            language: "fr",
            question: data.questionFr,
            answer: data.answerFr,
          },
          {
            language: "en",
            question: data.questionEn,
            answer: data.answerEn,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la FAQ");
    }

    const createdFaqs = await response.json(); // tableau FR + EN

    setFaqs((prev) => [...prev, ...createdFaqs]);

    alert("FAQ ajoutée avec succès ✅");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitActivityNew = async (data: any) => {
    const response = await fetch(`${baseUrl}/api/programme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        time: data.time,
        displayOrder: prog.length + 1,
        translations: [
          { language: "fr", activityName: data.activityNameFr },
          { language: "en", activityName: data.activityNameEn },
        ],
      }),
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout de l'activité");

    const newActivity = await response.json();
    setProg([...prog, newActivity]);
    alert("Activité ajoutée avec succès ✅");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitContactNew = async (data: any) => {
    const formData = new FormData();

    // Ajouter les données principales
    formData.append("name", data.name);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("displayOrder", (contacts.length + 1).toString());

    // Ajouter les traductions en JSON (comme dans votre PUT)
    const translations = [
      {
        language: "fr",
        relationship: data.relationshipFr,
        role: data.roleFr,
      },
      {
        language: "en",
        relationship: data.relationshipEn,
        role: data.roleEn,
      },
    ];
    formData.append("translations", JSON.stringify(translations));

    // Ajouter l'image si présente
    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout du contact");

    const newContact = await response.json();
    setContacts([...contacts, newContact]);
    alert("Contact ajouté avec succès ✅");
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitNew = async (data: any) => {
    switch (modalType) {
      case "faq":
        await handleSubmitFaqNew(data);
        break;
      case "activity":
        await handleSubmitActivityNew(data);
        break;
      case "contact":
        await handleSubmitContactNew(data);
        break;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faqsGrouped = faqs?.reduce((acc: any, faq: any) => {
    if (!acc[faq.displayOrder]) {
      acc[faq.displayOrder] = [];
    }

    acc[faq.displayOrder].push(faq);

    // 👉 tri immédiat : fr avant en
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc[faq.displayOrder].sort((a: any, b: any) => {
      if (a.language === "fr") return -1;
      if (b.language === "fr") return 1;
      return 0;
    });

    return acc;
  }, {});

  return (
    <>
      <Title level={1} className="md:text-5xl p-10">
        Modifications des informations
      </Title>
      <div className="max-w-5xl mx-auto p-6">
        <Title level={2} className="text-4xl">
          Page Home
        </Title>
        <form onSubmit={handleSubmitHome} className="space-y-4 p-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom de la mariée
            </label>
            <Input
              type="text"
              value={weddingInfos.brideName}
              onChange={(e) => handleChangeHome("brideName", e.target.value)}
              placeholder="Prénom de la mariée"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nom du marié
            </label>
            <Input
              type="text"
              value={weddingInfos.groomName}
              onChange={(e) => handleChangeHome("groomName", e.target.value)}
              placeholder="Prénom du marié"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date du mariage
            </label>
            <Input
              type="date"
              value={
                weddingInfos.weddingDate
                  ? new Date(weddingInfos.weddingDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) => handleChangeHome("weddingDate", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Deadline RSVP
            </label>
            <Input
              type="date"
              value={
                weddingInfos.rsvpDeadline
                  ? new Date(weddingInfos.rsvpDeadline)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) => handleChangeHome("rsvpDeadline", e.target.value)}
              className="w-full"
            />
          </div>

          {weddingInfos.translations?.map((t) => (
            <div key={t.id} className="flex justify-between">
              <select
                value={t.language}
                className="w-[10%]"
                onChange={(e) =>
                  handleChangeHomeTranslateById(t.id, {
                    language: e.target.value as Language,
                  })
                }
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
              <Input
                type="text"
                value={t.description}
                className="w-[25%]"
                onChange={(e) =>
                  handleChangeHomeTranslateById(t.id, {
                    description: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                value={t.venueAddress}
                className="w-[50%]"
                onChange={(e) =>
                  handleChangeHomeTranslateById(t.id, {
                    venueAddress: e.target.value,
                  })
                }
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </form>
        <Title level={2} className="text-4xl">
          Programme
        </Title>
        <form onSubmit={handleSubmitProgramme} className="space-y-4 p-5">
          {prog.map((p, index) => (
            <div key={p.id} className="relative">
              <div>
                Activité {index + 1}
                <button
                  type="button"
                  onClick={() => handleDeleteActivity(p.id)}
                  disabled={saving}
                  className="color-red px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  <MdOutlineDeleteForever />
                </button>
              </div>
              <div className="flex justify-between">
                <Input
                  type="time"
                  value={p.time}
                  onChange={(e) =>
                    handleActivityChange(p.id, "time", e.target.value)
                  }
                  className="w-[10%]"
                />
              </div>
              {p.translations?.map((t) => (
                <div key={t.id} className="flex justify-between">
                  <Input
                    type="text"
                    value={t.language}
                    className="w-[10%]"
                    disabled
                  />
                  <Input
                    type="text"
                    value={t.activityName}
                    onChange={(e) =>
                      handleTranslationChange(
                        p.id,
                        t.id,
                        "activityName",
                        e.target.value,
                      )
                    }
                    className="w-[80%]"
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </form>
        <button
          onClick={() => setModalType("activity")}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          + Ajouter une activité
        </button>
        <Title level={2} className="text-4xl">
          FAQ
        </Title>
        <form onSubmit={handleSubmitFaq} className="space-y-6 p-5">
          {Object.entries(faqsGrouped || {}).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ([displayOrder, group]: any, index: number) => (
              <div
                key={displayOrder}
                className="border rounded-lg p-4 bg-gray-50 space-y-4"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteFaqGroup(displayOrder)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Supprimer la question
                </button>

                {/* Header */}
                <div className="font-semibold text-gray-700">
                  Question #{index + 1}
                </div>

                {/* FR / EN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {group.map((f: any) => {
                    const index = faqs.findIndex(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (faq: any) => faq.id === f.id,
                    );

                    return (
                      <div
                        key={f.id}
                        className="space-y-2 border rounded-md p-3 bg-white"
                      >
                        <div className="text-sm font-medium text-gray-600 uppercase">
                          {f.language}
                        </div>

                        <Input
                          type="text"
                          className="w-full"
                          value={f.question}
                          onChange={(e) =>
                            handleFaqChange(index, "question", e.target.value)
                          }
                        />

                        <Input
                          type="text"
                          className="w-full"
                          value={f.answer}
                          onChange={(e) =>
                            handleFaqChange(index, "answer", e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </form>

        {Object.keys(faqsGrouped).length === 10 && (
          <p>Limite de 10 questions atteinte.</p>
        )}
        <button
          onClick={() => setModalType("faq")}
          disabled={Object.keys(faqsGrouped).length === 10}
          className={`mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
            Object.keys(faqsGrouped).length === 10 &&
            "opacity-50 cursor-not-allowed hover:bg-green-600"
          }`}
        >
          + Ajouter une FAQ
        </button>

        <div className="flex justify-between">
          <Title level={2} className="text-4xl">
            Contacts
          </Title>

          <div className="flex gap-2">
            <button
              onClick={() => setModalType("contact")}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Ajouter un contact
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmitContact}>
          {contacts.map((contact) => (
            <div key={contact.id} className="mb-4 p-4 border rounded relative">
              <button
                type="button"
                onClick={() => handleDeleteContact(contact.id)}
                disabled={saving}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 absolute right-4"
              >
                <MdOutlineDeleteForever />
              </button>
              <Input
                type="text"
                value={contact.name}
                className="mb-2 w-full"
                onChange={(e) =>
                  handleContactChange(contact.id, "name", e.target.value)
                }
              />
              <Input
                type="text"
                value={contact.phoneNumber}
                className="mb-2 w-full"
                onChange={(e) =>
                  handleContactChange(contact.id, "phoneNumber", e.target.value)
                }
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setContacts((prev) =>
                    prev.map((c) =>
                      c.id === contact.id ? { ...c, newImageFile: file } : c,
                    ),
                  );
                }}
              />
              {contact.translations?.map((t) => (
                <div key={t.id} className="flex justify-between">
                  <Input
                    type="text"
                    value={t.language}
                    className="w-[10%]"
                    disabled
                  />
                  <Input
                    type="text"
                    value={t.relationship}
                    className="w-[80%]"
                    onChange={(e) =>
                      handleContactTranslationChange(
                        contact.id,
                        t.id,
                        "relationship",
                        e.target.value,
                      )
                    }
                  />
                  <Input
                    type="text"
                    value={t.role}
                    className="w-[80%]"
                    onChange={(e) =>
                      handleContactTranslationChange(
                        contact.id,
                        t.id,
                        "role",
                        e.target.value,
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </form>
      </div>

      <AddModal
        isOpen={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
        onSubmit={handleSubmitNew}
      />
    </>
  );
}
