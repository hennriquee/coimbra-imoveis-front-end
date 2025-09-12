import axios from "axios";

export const api = axios.create({
  baseURL: "https://coimbra-imoveis-back-end.onrender.com",
});
