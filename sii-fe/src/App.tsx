import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreditCard } from "./components/CreditCard";
import { CustomTextField } from "./components/CustomTextField";
import { cardService, type SavedCard } from "./services/cardService";
import "./App.css";

function App() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [focused, setFocused] = useState<
    "number" | "name" | "expiry" | "cvc" | undefined
  >(undefined);

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cardHolder: "",
    cvv: "",
  });

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

  const validateCardNumber = (value: string): string => {
    if (!value) return "El número de tarjeta es requerido";
    if (!/^\d+$/.test(value))
      return "El número de tarjeta solo puede contener números";
    if (value.length !== 16)
      return "El número de tarjeta debe tener 16 dígitos";
    return "";
  };

  const validateExpiryDate = (value: string): string => {
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

  const validateCardHolder = (value: string): string => {
    if (!value) return "El nombre del titular es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
      return "El nombre solo puede contener letras y letras con tildes";
    if (value.length > 20) return "El nombre no puede exceder 20 caracteres";
    return "";
  };

  const validateCVV = (value: string): string => {
    if (!value) return "El CVV es requerido";
    if (!/^\d+$/.test(value)) return "El CVV solo puede contener números";
    if (value.length !== 3) return "El CVV debe tener 3 dígitos";
    return "";
  };

  const handleCardNumberChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(numericValue);
    setErrors((prev) => ({
      ...prev,
      cardNumber: validateCardNumber(numericValue),
    }));
  };

  const handleExpiryDateChange = (value: string) => {
    let formattedValue = value.replace(/\D/g, "");

    if (formattedValue.length >= 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
    }

    formattedValue = formattedValue.slice(0, 5);
    setExpiryDate(formattedValue);
    setErrors((prev) => ({
      ...prev,
      expiryDate: validateExpiryDate(formattedValue),
    }));
  };

  const handleCardHolderChange = (value: string) => {
    const filteredValue = value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
      .slice(0, 20);
    setCardHolder(filteredValue);
    setErrors((prev) => ({
      ...prev,
      cardHolder: validateCardHolder(filteredValue),
    }));
  };

  const handleCVVChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 3);
    setCvv(numericValue);
    setErrors((prev) => ({ ...prev, cvv: validateCVV(numericValue) }));
  };

  const maskCardNumber = (number: string): string => {
    if (number.length !== 16) return number;
    return number.slice(0, 2) + "********" + number.slice(-4);
  };

  const handleAddCard = async () => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber),
      expiryDate: validateExpiryDate(expiryDate),
      cardHolder: validateCardHolder(cardHolder),
      cvv: validateCVV(cvv),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error !== "")) {
      try {
        setLoading(true);
        setApiError("");

        const newCard = await cardService.create({
          cardNumber: cardNumber,
          cardHolder: cardHolder,
          expiryDate: expiryDate,
          cvv: cvv,
        });

        setSavedCards((prev) => [...prev, newCard]);
        setSuccessMessage("Tarjeta agregada exitosamente");
        handleCancel();
        console.log("Tarjeta agregada exitosamente:", newCard);
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
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteCard = async (id: string) => {
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

  const handleCancel = () => {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          background: "white",
          borderRadius: { xs: "16px", sm: "24px" },
          padding: { xs: 3, sm: 4, md: 6 },
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        {apiError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setApiError("")}
          >
            {apiError}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <CircularProgress />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 3, sm: 4 },
          }}
        >
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <CreditCard
              cardNumber={cardNumber}
              cardHolder={cardHolder}
              expiryDate={expiryDate}
              cvv={cvv}
              focused={focused}
            />
          </Box>

          <Box sx={{ width: "100%", maxWidth: "680px" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: { xs: 2, sm: 3 },
              }}
            >
              <Box>
                <CustomTextField
                  label="Número de Tarjeta"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  onFocus={() => setFocused("number")}
                  onBlur={() => setFocused(undefined)}
                  placeholder="1234567890123456"
                  error={!!errors.cardNumber}
                  required
                />
                {errors.cardNumber && (
                  <Typography
                    sx={{ color: "red", fontSize: "12px", mt: 0.5, ml: 1 }}
                  >
                    {errors.cardNumber}
                  </Typography>
                )}
              </Box>

              <Box>
                <CustomTextField
                  label="Fecha Vencimiento"
                  value={expiryDate}
                  onChange={(e) => handleExpiryDateChange(e.target.value)}
                  onFocus={() => setFocused("expiry")}
                  onBlur={() => setFocused(undefined)}
                  placeholder="MM/YY"
                  error={!!errors.expiryDate}
                  required
                />
                {errors.expiryDate && (
                  <Typography
                    sx={{ color: "red", fontSize: "12px", mt: 0.5, ml: 1 }}
                  >
                    {errors.expiryDate}
                  </Typography>
                )}
              </Box>

              <Box>
                <CustomTextField
                  label="Nombre Titular"
                  value={cardHolder}
                  onChange={(e) => handleCardHolderChange(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(undefined)}
                  placeholder="Nombre completo"
                  error={!!errors.cardHolder}
                  required
                />
                {errors.cardHolder && (
                  <Typography
                    sx={{ color: "red", fontSize: "12px", mt: 0.5, ml: 1 }}
                  >
                    {errors.cardHolder}
                  </Typography>
                )}
              </Box>

              <Box>
                <CustomTextField
                  label="CVV"
                  value={cvv}
                  onChange={(e) => handleCVVChange(e.target.value)}
                  onFocus={() => setFocused("cvc")}
                  onBlur={() => setFocused(undefined)}
                  placeholder="123"
                  type="password"
                  error={!!errors.cvv}
                  required
                />
                {errors.cvv && (
                  <Typography
                    sx={{ color: "red", fontSize: "12px", mt: 0.5, ml: 1 }}
                  >
                    {errors.cvv}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: { xs: 3, sm: 4 },
              }}
            >
              <Button
                variant="contained"
                onClick={handleAddCard}
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#5b4bdb",
                  color: "white",
                  borderRadius: "12px",
                  padding: "12px 32px",
                  textTransform: "none",
                  fontSize: { xs: "14px", sm: "16px" },
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#4a3bc0",
                  },
                }}
              >
                {loading ? "Agregando..." : "Agregar Tarjeta"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                fullWidth
                disabled={loading}
                sx={{
                  borderColor: "#d0d0d0",
                  color: "#888",
                  borderRadius: "12px",
                  padding: "12px 32px",
                  textTransform: "none",
                  fontSize: { xs: "14px", sm: "16px" },
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#b0b0b0",
                    backgroundColor: "#f9f9f9",
                  },
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>

        {savedCards.length > 0 && (
          <Box sx={{ width: "100%", maxWidth: "1200px", mt: 4 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 600, color: "#333" }}
            >
              Tarjetas Guardadas
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {savedCards.map((card) => (
                <Card
                  key={card.id}
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative", padding: 3 }}>
                    <IconButton
                      onClick={() => handleDeleteCard(card.id)}
                      disabled={loading}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#f44336",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#888",
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        Número de Tarjeta
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#333",
                          mt: 0.5,
                        }}
                      >
                        {maskCardNumber(card.cardNumber)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#888",
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        Nombre Titular
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#333",
                          mt: 0.5,
                        }}
                      >
                        {card.cardHolder}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#888",
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        Fecha Vencimiento
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#333",
                          mt: 0.5,
                        }}
                      >
                        {card.expiryDate}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
