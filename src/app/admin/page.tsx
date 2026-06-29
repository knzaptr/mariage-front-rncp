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
import { useRouter } from "next/navigation";
import { apiPath } from "@/lib/api-client";

const pageStateClass =
  "flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center text-slate-600";
const sectionClass =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6";
const sectionHeaderClass =
  "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";
const fieldClass = "space-y-2";
const labelClass = "block text-sm font-medium text-slate-700";
const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400";
const disabledInputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm uppercase text-slate-500";
const primaryButtonClass =
  "inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";
const addButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50";
const dangerIconButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50";

export default function PageAdmin() {
  const [weddingInfos, setWeddingInfos] = useState<WeddingInfo | null>(null);
  const [prog, setProg] = useState<Activity[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalType, setModalType] = useState<ModalType>(null);

  const adminToken = Cookies.get("adminToken");
  const router = useRouter();

  useEffect(() => {
    if(!adminToken) {
      router.push("/login")
    }
    async function fetchHome() {
      try {
        const res = await fetch(apiPath("weddinginfos"), {
          method: "GET",
          cache: "no-store",
        });
        const weddinginfos = await res.json();

        const resProg = await fetch(apiPath("programme"), {
          method: "GET",
          cache: "no-store",
        });
        const progs = await resProg.json();

        const resFaq = await fetch(apiPath("faq"), {
          method: "GET",
          cache: "no-store",
        });
        const faqs = await resFaq.json();

        const resContacts = await fetch(apiPath("contact"), {
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

  if (loading) return <p className={pageStateClass}>Chargement…</p>;
  if (!weddingInfos) {
    return (
      <p className={pageStateClass}>Erreur de chargement Wedding Infos</p>
    );
  }
  if (!prog) {
    return (
      <p className={pageStateClass}>Erreur de chargement Programmation</p>
    );
  }
  if (!faqs) return <p className={pageStateClass}>Erreur de chargement FAQ</p>;

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
      const res = await fetch(apiPath("weddinginfos"), {
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
      router.refresh();
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
      const response = await fetch(apiPath("programme"), {
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
      router.refresh();
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
        apiPath(`programme?id=${activityId}`),
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
      router.refresh();
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
      const response = await fetch(apiPath("faq"), {
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
      router.refresh();
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

    const response = await fetch(apiPath("faq"), {
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
    router.refresh();
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

      const response = await fetch(apiPath("contact"), {
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
      router.refresh();
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
      const response = await fetch(apiPath(`contact?id=${contactId}`), {
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
      router.refresh();
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

    const response = await fetch(apiPath("faq"), {
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
    router.refresh();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitActivityNew = async (data: any) => {
    const response = await fetch(apiPath("programme"), {
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
    router.refresh();
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

    const response = await fetch(apiPath("contact"), {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout du contact");

    const newContact = await response.json();
    setContacts([...contacts, newContact]);
    alert("Contact ajouté avec succès ✅");
    router.refresh();
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
    <main className="min-h-screen px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Administration
          </p>
          <Title
            level={1}
            className="px-0 text-4xl leading-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            Modifications des informations
          </Title>
        </div>

        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <Title level={2} className="text-3xl text-slate-900 sm:text-4xl">
              Page Home
            </Title>
          </div>

          <form onSubmit={handleSubmitHome} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>Nom de la mariée</label>
                <Input
                  type="text"
                  value={weddingInfos.brideName}
                  onChange={(e) =>
                    handleChangeHome("brideName", e.target.value)
                  }
                  placeholder="Prénom de la mariée"
                  className={inputClass}
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass}>Nom du marié</label>
                <Input
                  type="text"
                  value={weddingInfos.groomName}
                  onChange={(e) =>
                    handleChangeHome("groomName", e.target.value)
                  }
                  placeholder="Prénom du marié"
                  className={inputClass}
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass}>Date du mariage</label>
                <Input
                  type="date"
                  value={
                    weddingInfos.weddingDate
                      ? new Date(weddingInfos.weddingDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChangeHome("weddingDate", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass}>Deadline RSVP</label>
                <Input
                  type="date"
                  value={
                    weddingInfos.rsvpDeadline
                      ? new Date(weddingInfos.rsvpDeadline)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChangeHome("rsvpDeadline", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-4">
              {weddingInfos.translations?.map((t) => (
                <div
                  key={t.id}
                  className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[100px_1fr]"
                >
                  <select
                    value={t.language}
                    className={inputClass}
                    onChange={(e) =>
                      handleChangeHomeTranslateById(t.id, {
                        language: e.target.value as Language,
                      })
                    }
                  >
                    <option value="fr">FR</option>
                    <option value="en">EN</option>
                  </select>
                  <div>
                  <Input
                    type="text"
                    value={t.description}
                    className={inputClass}
                    onChange={(e) =>
                      handleChangeHomeTranslateById(t.id, {
                        description: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="text"
                    value={t.venueAddress}
                    className={inputClass}
                    onChange={(e) =>
                      handleChangeHomeTranslateById(t.id, {
                        venueAddress: e.target.value,
                      })
                    }
                  />
                  </div>
                </div>
              ))}
            </div>

            <div className={fieldClass}>
              <label className={labelClass}>Lien vers le lieu du mariage</label>
              <Input
                type="text"
                value={weddingInfos.venueLink || ""}
                onChange={(e) => handleChangeHome("venueLink", e.target.value)}
                placeholder="Lien vers le lieu du mariage"
                className={inputClass}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={primaryButtonClass}
              >
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>

        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <Title level={2} className="text-3xl text-slate-900 sm:text-4xl">
              Programme
            </Title>
            <button
              type="button"
              onClick={() => setModalType("activity")}
              className={addButtonClass}
            >
              + Ajouter une activité
            </button>
          </div>

          <form onSubmit={handleSubmitProgramme} className="space-y-5">
            {prog.map((p, index) => (
              <div
                key={p.id}
                className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-800">
                    Activité {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDeleteActivity(p.id)}
                    disabled={saving}
                    className={dangerIconButtonClass}
                    aria-label={`Supprimer l'activité ${index + 1}`}
                  >
                    <MdOutlineDeleteForever />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                  <Input
                    type="time"
                    value={p.time}
                    onChange={(e) =>
                      handleActivityChange(p.id, "time", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  {p.translations?.map((t) => (
                    <div
                      key={t.id}
                      className="grid gap-3 sm:grid-cols-[100px_1fr]"
                    >
                      <Input
                        type="text"
                        value={t.language}
                        className={disabledInputClass}
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
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={primaryButtonClass}
              >
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>

        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <Title level={2} className="text-3xl text-slate-900 sm:text-4xl">
              FAQ
            </Title>
            <div className="space-y-2 sm:text-right">
              {Object.keys(faqsGrouped).length === 10 && (
                <p className="text-sm text-amber-700">
                  Limite de 10 questions atteinte.
                </p>
              )}
              <button
                type="button"
                onClick={() => setModalType("faq")}
                disabled={Object.keys(faqsGrouped).length === 10}
                className={addButtonClass}
              >
                + Ajouter une FAQ
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitFaq} className="space-y-5">
            {Object.entries(faqsGrouped || {}).map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ([displayOrder, group]: any, index: number) => (
                <div
                  key={displayOrder}
                  className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-800">
                      Question #{index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaqGroup(displayOrder)}
                      className="text-left text-sm font-semibold text-red-600 transition hover:text-red-700 sm:text-right"
                    >
                      Supprimer la question
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {group.map((f: any) => {
                      const index = faqs.findIndex(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (faq: any) => faq.id === f.id,
                      );

                      return (
                        <div
                          key={f.id}
                          className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            {f.language}
                          </div>

                          <Input
                            type="text"
                            className={inputClass}
                            value={f.question}
                            onChange={(e) =>
                              handleFaqChange(index, "question", e.target.value)
                            }
                          />

                          <Input
                            type="text"
                            className={inputClass}
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={primaryButtonClass}
              >
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>

        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <Title level={2} className="text-3xl text-slate-900 sm:text-4xl">
              Contacts
            </Title>
            <button
              type="button"
              onClick={() => setModalType("contact")}
              className={addButtonClass}
            >
              + Ajouter un contact
            </button>
          </div>

          <form onSubmit={handleSubmitContact} className="space-y-5">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(contact.id)}
                    disabled={saving}
                    className={dangerIconButtonClass}
                    aria-label={`Supprimer le contact ${contact.name}`}
                  >
                    <MdOutlineDeleteForever />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="text"
                    value={contact.name}
                    className={inputClass}
                    onChange={(e) =>
                      handleContactChange(contact.id, "name", e.target.value)
                    }
                  />
                  <Input
                    type="text"
                    value={contact.phoneNumber}
                    className={inputClass}
                    onChange={(e) =>
                      handleContactChange(
                        contact.id,
                        "phoneNumber",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
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

                <div className="space-y-3">
                  {contact.translations?.map((t) => (
                    <div
                      key={t.id}
                      className="grid gap-3 md:grid-cols-[100px_1fr_1fr]"
                    >
                      <Input
                        type="text"
                        value={t.language}
                        className={disabledInputClass}
                        disabled
                      />
                      <Input
                        type="text"
                        value={t.relationship}
                        className={inputClass}
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
                        className={inputClass}
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
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={primaryButtonClass}
              >
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <AddModal
        isOpen={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
        onSubmit={handleSubmitNew}
      />
    </main>
  );
}
