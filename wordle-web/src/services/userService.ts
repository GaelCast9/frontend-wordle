import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchRanking = async () => {
  const res = await axios.get(`${API_URL}/users/ranking`);
  return res.data;
};
