import { useState } from "react";

// Types
export type ModalType = "faq" | "activity" | "contact" | null;

interface ModalProps {
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
}

// Composant Modal exportable
export default function AddModal({
  isOpen,
  type,
  onClose,
  onSubmit,
}: ModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !type) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({});
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (type) {
      case "faq":
        return (
          <>
            {/* FR */}
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                Français 🇫🇷
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Question (FR)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.questionFr || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, questionFr: e.target.value })
                  }
                  placeholder="Comment puis-je confirmer ma présence ?"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Réponse (FR)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.answerFr || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, answerFr: e.target.value })
                  }
                  placeholder="Vous pouvez confirmer votre présence via le formulaire RSVP."
                />
              </div>
            </div>

            {/* EN */}
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                English 🇬🇧
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Question (EN)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.questionEn || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, questionEn: e.target.value })
                  }
                  placeholder="How can I confirm my attendance?"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Answer (EN)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.answerEn || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, answerEn: e.target.value })
                  }
                  placeholder="You can confirm your attendance via the RSVP form."
                />
              </div>
            </div>
          </>
        );

      case "activity":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Heure</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Nom de lactivité (FR)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.activityNameFr || ""}
                onChange={(e) =>
                  setFormData({ ...formData, activityNameFr: e.target.value })
                }
                placeholder="Cérémonie"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Nom de lactivité (EN)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.activityNameEn || ""}
                onChange={(e) =>
                  setFormData({ ...formData, activityNameEn: e.target.value })
                }
                placeholder="Ceremony"
              />
            </div>
          </>
        );

      case "contact":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Kenza"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="0612345678"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Relation (FR)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.relationshipFr || ""}
                onChange={(e) =>
                  setFormData({ ...formData, relationshipFr: e.target.value })
                }
                placeholder="Sœur de Lisy"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Relation (EN)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.relationshipEn || ""}
                onChange={(e) =>
                  setFormData({ ...formData, relationshipEn: e.target.value })
                }
                placeholder="Lisy's sister"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Rôle (FR)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.roleFr || ""}
                onChange={(e) =>
                  setFormData({ ...formData, roleFr: e.target.value })
                }
                placeholder="Pour toute question concernant le site internet"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Rôle (EN)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.roleEn || ""}
                onChange={(e) =>
                  setFormData({ ...formData, roleEn: e.target.value })
                }
                placeholder="For any questions about the website"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({ ...formData, imageFile: e.target.files?.[0] })
                }
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "faq":
        return "Ajouter une FAQ";
      case "activity":
        return "Ajouter une activité";
      case "contact":
        return "Ajouter un contact";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{getTitle()}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <div>
            {renderForm()}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Ajout..." : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
