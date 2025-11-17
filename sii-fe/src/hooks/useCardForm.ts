import { useState } from "react";
import {
  validateCardNumber,
  validateExpiryDate,
  validateCardHolder,
  validateCVV,
} from "../utils/validators";
import {
  formatCardNumber,
  formatExpiryDate,
  formatCardHolder,
  formatCVV,
} from "../utils/formatters";

interface CardFormErrors {
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  cvv: string;
}

export const useCardForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [focused, setFocused] = useState<
    "number" | "name" | "expiry" | "cvc" | undefined
  >(undefined);

  const [errors, setErrors] = useState<CardFormErrors>({
    cardNumber: "",
    expiryDate: "",
    cardHolder: "",
    cvv: "",
  });

  const handleCardNumberChange = (value: string) => {
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
    setErrors((prev) => ({
      ...prev,
      cardNumber: validateCardNumber(formattedValue),
    }));
  };

  const handleExpiryDateChange = (value: string) => {
    const formattedValue = formatExpiryDate(value);
    setExpiryDate(formattedValue);
    setErrors((prev) => ({
      ...prev,
      expiryDate: validateExpiryDate(formattedValue),
    }));
  };

  const handleCardHolderChange = (value: string) => {
    const formattedValue = formatCardHolder(value);
    setCardHolder(formattedValue);
    setErrors((prev) => ({
      ...prev,
      cardHolder: validateCardHolder(formattedValue),
    }));
  };

  const handleCVVChange = (value: string) => {
    const formattedValue = formatCVV(value);
    setCvv(formattedValue);
    setErrors((prev) => ({
      ...prev,
      cvv: validateCVV(formattedValue),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber),
      expiryDate: validateExpiryDate(expiryDate),
      cardHolder: validateCardHolder(cardHolder),
      cvv: validateCVV(cvv),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const resetForm = () => {
    setCardNumber("");
    setExpiryDate("");
    setCardHolder("");
    setCvv("");
    setErrors({
      cardNumber: "",
      expiryDate: "",
      cardHolder: "",
      cvv: "",
    });
  };

  const getFormData = () => ({
    cardNumber,
    cardHolder,
    expiryDate,
    cvv,
  });

  return {
    cardNumber,
    expiryDate,
    cardHolder,
    cvv,
    focused,
    errors,
    setFocused,
    handleCardNumberChange,
    handleExpiryDateChange,
    handleCardHolderChange,
    handleCVVChange,
    validateForm,
    resetForm,
    getFormData,
  };
};
