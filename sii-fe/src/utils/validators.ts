export const validateCardNumber = (value: string): string => {
  if (!value) return "El número de tarjeta es requerido";
  if (!/^\d+$/.test(value))
    return "El número de tarjeta solo puede contener números";
  if (value.length !== 16)
    return "El número de tarjeta debe tener 16 dígitos";
  return "";
};

export const validateExpiryDate = (value: string): string => {
  if (!value) return "La fecha de vencimiento es requerida";

  const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
  if (!regex.test(value)) return "El formato debe ser MM/YY";

  const [month, year] = value.split("/");
  const currentYear = new Date().getFullYear() % 100;
  const maxYear = currentYear + 5;
  const yearNum = parseInt(year);

  if (yearNum < 22) return "El año no puede ser menor a 22";
  if (yearNum > maxYear) return `El año no puede ser mayor a ${maxYear}`;

  return "";
};

export const validateCardHolder = (value: string): string => {
  if (!value) return "El nombre del titular es requerido";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
    return "El nombre solo puede contener letras y letras con tildes";
  if (value.length > 20) return "El nombre no puede exceder 20 caracteres";
  return "";
};

export const validateCVV = (value: string): string => {
  if (!value) return "El CVV es requerido";
  if (!/^\d+$/.test(value)) return "El CVV solo puede contener números";
  if (value.length !== 3) return "El CVV debe tener 3 dígitos";
  return "";
};
