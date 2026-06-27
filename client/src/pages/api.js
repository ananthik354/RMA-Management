import axios from "axios";

const API =
  "https://rma-management.onrender.com/api";

export const getReminder =
(id) =>
  axios.get(
    `${API}/reminder/${id}`
  );

export const updateReminder =
(id, data) =>
  axios.put(
    `${API}/reminder/update/${id}`,
    data
  );