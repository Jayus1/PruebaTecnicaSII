import { useState, useEffect } from "react";
import { cardService, type SavedCard } from "../services/cardService";

export const useCards = () => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const cards = await cardService.getAll();
      setSavedCards(cards);
    } catch (error) {
      console.error("Error al cargar tarjetas:", error);
      setApiError("Error al cargar las tarjetas");
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  }) => {
    try {
      setLoading(true);
      setApiError("");

      const newCard = await cardService.create(cardData);

      setSavedCards((prev) => [...prev, newCard]);
      setSuccessMessage("Tarjeta agregada exitosamente");
      console.log("Tarjeta agregada exitosamente:", newCard);

      return { success: true };
    } catch (error: any) {
      console.error("Error al agregar tarjeta:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Error al agregar la tarjeta"
        );
      } else if (error.request) {
        setApiError(
          "No se puede conectar con el servidor. Verifique que el backend esté ejecutándose."
        );
      } else {
        setApiError("Error al agregar la tarjeta");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      setLoading(true);
      setApiError("");

      await cardService.delete(id);
      setSavedCards((prev) => prev.filter((card) => card.id !== id));
      setSuccessMessage("Tarjeta eliminada exitosamente");
    } catch (error: any) {
      console.error("Error al eliminar tarjeta:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Error al eliminar la tarjeta"
        );
      } else if (error.request) {
        setApiError(
          "No se puede conectar con el servidor. Verifique que el backend esté ejecutándose."
        );
      } else {
        setApiError("Error al eliminar la tarjeta");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearApiError = () => setApiError("");
  const clearSuccessMessage = () => setSuccessMessage("");

  return {
    savedCards,
    loading,
    apiError,
    successMessage,
    addCard,
    deleteCard,
    clearApiError,
    clearSuccessMessage,
  };
};
