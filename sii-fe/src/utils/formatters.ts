export const maskCardNumber = (number: string): string => {
  if (number.length !== 16) return number;
  return number.slice(0, 2) + "********" + number.slice(-4);
};

export const formatCardNumber = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 16);
};

export const formatExpiryDate = (value: string): string => {
  let formattedValue = value.replace(/\D/g, "");

  if (formattedValue.length >= 2) {
    formattedValue =
      formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
  }

  return formattedValue.slice(0, 5);
};

export const formatCardHolder = (value: string): string => {
  return value
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
    .slice(0, 20);
};

export const formatCVV = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 3);
};
