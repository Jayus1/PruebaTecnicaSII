import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  focused: 'number' | 'name' | 'expiry' | 'cvc' | undefined;
}

export const CreditCard = ({
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  focused
}: CreditCardProps) => {
  return (
    <Cards
      number={cardNumber}
      name={cardHolder}
      expiry={expiryDate}
      cvc={cvv}
      focused={focused}
    />
  );
};
