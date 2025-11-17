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
import { useCardForm } from "./hooks/useCardForm";
import { useCards } from "./hooks/useCards";
import { maskCardNumber } from "./utils/formatters";
import "./App.css";

function App() {
  const {
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
  } = useCardForm();

  const {
    savedCards,
    loading,
    apiError,
    successMessage,
    addCard,
    deleteCard,
    clearApiError,
    clearSuccessMessage,
  } = useCards();

  const handleAddCard = async () => {
    if (validateForm()) {
      const result = await addCard(getFormData());
      if (result.success) {
        resetForm();
      }
    }
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
        onClose={clearSuccessMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={clearSuccessMessage}
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
            onClose={clearApiError}
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
                onClick={resetForm}
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
                      onClick={() => deleteCard(card.id)}
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
