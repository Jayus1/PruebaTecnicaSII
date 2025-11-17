import axios from 'axios';

const API_URL = 'http://localhost:3000/cards';

export interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardDto {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export const cardService = {
  async getAll(): Promise<SavedCard[]> {
    const response = await axios.get<SavedCard[]>(API_URL);
    return response.data;
  },

  async create(card: CreateCardDto): Promise<SavedCard> {
    const response = await axios.post<SavedCard>(API_URL, card);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
