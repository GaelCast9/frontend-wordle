// src/services/gameService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const sendGuess = async (guess: string, token: string) => {
  const res = await axios.post(
    `${API_URL}/game/guess`,
    { guess },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getNextWord = async (token: string) => {
  const res = await axios.get(`${API_URL}/game/next`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
